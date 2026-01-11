import { MainButton } from "@/components/MainButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import { DropZoneColors } from "@/constants/Colors";
import { CreateMathTaskType, LevelsEnum } from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { checkAnswers } from "@/utils/game";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// Constants
const DRAGGABLE_NUMBER_SIZE = 75;
const DROP_ZONE_SIZE = 110;
const CONTAINER_HEIGHT = 220;
const GRID_COLS = 2;
const GRID_ROWS = 2;
const GRID_MARGIN = 20;
const DRAG_SCALE = 1.7;
const SNAPPED_SCALE = 1.4;
const NORMAL_SCALE = 1;

const measureView = (ref: React.RefObject<View | null>): Promise<LayoutRectangle> => {
  return new Promise((resolve) => {
    if (!ref.current) {
      resolve({ x: 0, y: 0, width: 0, height: 0 });
      return;
    }

    ref.current.measure((x, y, width, height, pageX, pageY) => {
      resolve({ x: pageX, y: pageY, width, height });
    });
  });
};

const doBoxesIntersect = (boxA: LayoutRectangle, boxB: LayoutRectangle) => {
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
};

interface NumberPosition {
  x: number;
  y: number;
}

interface CreateMathTaskProps {
  level: LevelsEnum;
  maxLevelStep: number;
  task: CreateMathTaskType;
  isFinalTaskInLevel: boolean;
  removedAnswerIds?: number[];
}

export function CreateMathTask({ level, task, maxLevelStep, isFinalTaskInLevel, removedAnswerIds = [] }: CreateMathTaskProps) {
  const colorScheme = useAppColorScheme();
  const leftZoneRef = useRef<View | null>(null);
  const rightZoneRef = useRef<View | null>(null);
  const containerRef = useRef<View | null>(null);
  const dropZoneColors = DropZoneColors[colorScheme ?? "dark"];

  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [rightValue, setRightValue] = useState<number | null>(null);
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  // const [hasAppliedLifePenalty, setHasAppliedLifePenalty] = useState(false);
  const hasAppliedLifePenaltyRef = useRef(false);
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle | null>(null);

  const [numberPositions, setNumberPositions] = useState<Map<number, NumberPosition>>(new Map());
  const numbers = useMemo(
    () => task.options.filter((option) => !removedAnswerIds.includes(option.id)).map((item) => Number(item.number)),
    [task.options, removedAnswerIds]
  );

  const initializedRef = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const isBothValuesSet = leftValue !== null && rightValue !== null;

  const {
    dispatch,
    state: { availableLevels, lives },
  } = useAppContext();
  const router = useRouter();
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const generateAllPositions = useCallback(
    (numbers: number[]): Map<number, NumberPosition> => {
      if (!containerLayout) {
        return new Map();
      }

      // Simple 2x2 grid for 4 numbers with guaranteed spacing
      const availableWidth = containerLayout.width - GRID_MARGIN * 2;
      const availableHeight = CONTAINER_HEIGHT - GRID_MARGIN * 2;

      // Divide space evenly into a 2x2 grid
      const cellWidth = availableWidth / GRID_COLS;
      const cellHeight = availableHeight / GRID_ROWS;

      // Maximum random offset to add natural positioning while preventing overlaps
      const maxOffsetX = Math.min(30, (cellWidth - DRAGGABLE_NUMBER_SIZE * DRAG_SCALE) / 2);
      const maxOffsetY = Math.min(30, (cellHeight - DRAGGABLE_NUMBER_SIZE * DRAG_SCALE) / 2);

      // Create all 4 grid positions (2x2 = 4 positions) with random offsets
      const gridPositions: NumberPosition[] = [];

      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          // Center the number within each grid cell
          const baseX = GRID_MARGIN + col * cellWidth + (cellWidth - DRAGGABLE_NUMBER_SIZE) / 2;
          const baseY = GRID_MARGIN + row * cellHeight + (cellHeight - DRAGGABLE_NUMBER_SIZE) / 2;

          // Add random offset for more natural look
          const randomOffsetX = (Math.random() - 0.5) * 2 * maxOffsetX;
          const randomOffsetY = (Math.random() - 0.5) * 2 * maxOffsetY;

          const x = baseX + randomOffsetX;
          const y = baseY + randomOffsetY;

          gridPositions.push({ x, y });
        }
      }

      // Shuffle positions
      const shuffledPositions = gridPositions.sort(() => Math.random() - 0.5);

      // Assign positions to numbers
      const positionsMap = new Map<number, NumberPosition>();
      numbers.forEach((number, index) => {
        positionsMap.set(number, shuffledPositions[index] || { x: GRID_MARGIN, y: GRID_MARGIN });
      });

      return positionsMap;
    },
    [containerLayout]
  );

  const generateRandomPosition = useCallback(
    (existingPositions: Map<number, NumberPosition> = new Map(), excludeNumber?: number): NumberPosition => {
      if (!containerLayout) {
        return { x: 0, y: 0 };
      }

      // Simple 2x2 grid fallback for drag-back positioning
      const availableWidth = containerLayout.width - GRID_MARGIN * 2;
      const availableHeight = CONTAINER_HEIGHT - GRID_MARGIN * 2;

      const cellWidth = availableWidth / GRID_COLS;
      const cellHeight = availableHeight / GRID_ROWS;

      // Find an unoccupied grid cell
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const x = GRID_MARGIN + col * cellWidth + (cellWidth - DRAGGABLE_NUMBER_SIZE) / 2;
          const y = GRID_MARGIN + row * cellHeight + (cellHeight - DRAGGABLE_NUMBER_SIZE) / 2;

          // Check if position is occupied
          let isOccupied = false;
          for (const [num, existingPos] of existingPositions) {
            if (excludeNumber !== undefined && num === excludeNumber) {
              continue;
            }
            if (Math.abs(x - existingPos.x) < 50 && Math.abs(y - existingPos.y) < 50) {
              isOccupied = true;
              break;
            }
          }

          if (!isOccupied) {
            // Add small random offset
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            return { x: x + offsetX, y: y + offsetY };
          }
        }
      }

      return { x: GRID_MARGIN, y: GRID_MARGIN };
    },
    [containerLayout]
  );

  useEffect(() => {
    if (!containerLayout) {
      return;
    }
    if (initializedRef.current) {
      return;
    }

    // Generate all positions at once to ensure proper spacing and randomization
    const initialPositions = generateAllPositions(numbers);

    setNumberPositions(initialPositions);
    initializedRef.current = true;
  }, [containerLayout, numbers, generateAllPositions, resetKey]);

  const animateNumberToRandomPosition = (num: number) => {
    setNumberPositions((prev) => {
      const cloned = new Map(prev);
      const newPosition = generateRandomPosition(prev, num);
      cloned.set(num, newPosition);
      return cloned;
    });
  };

  const getDropZonePosition = (zoneLayout: LayoutRectangle, containerLayoutRect: LayoutRectangle): NumberPosition => {
    // Calculate position so the number's center aligns with the drop zone's center
    // Since transform scales from center, we just need to center the original bounds
    const relativeX = zoneLayout.x - containerLayoutRect.x + (zoneLayout.width - DRAGGABLE_NUMBER_SIZE) / 2;
    const relativeY = zoneLayout.y - containerLayoutRect.y + (zoneLayout.height - DRAGGABLE_NUMBER_SIZE) / 2;

    return { x: relativeX, y: relativeY };
  };

  const handleDrop = useCallback(
    async (x: number, y: number, number: number) => {
      // Clear if number was already placed
      if (leftValue === number) setLeftValue(null);
      if (rightValue === number) setRightValue(null);

      const draggedItemBox: LayoutRectangle = {
        x: x - DRAGGABLE_NUMBER_SIZE / 2,
        y: y - DRAGGABLE_NUMBER_SIZE / 2,
        width: DRAGGABLE_NUMBER_SIZE,
        height: DRAGGABLE_NUMBER_SIZE,
      };

      // Measure all refs fresh at drop time for accurate positioning
      const [leftZoneLayout, rightZoneLayout, freshContainerLayout] = await Promise.all([
        measureView(leftZoneRef),
        measureView(rightZoneRef),
        measureView(containerRef),
      ]);

      if (freshContainerLayout.width === 0 || freshContainerLayout.height === 0) {
        animateNumberToRandomPosition(number);
        return;
      }

      // Check left zone
      if (doBoxesIntersect(draggedItemBox, leftZoneLayout)) {
        if (leftValue !== null) animateNumberToRandomPosition(leftValue);
        setLeftValue(number);
        const dropPosition = getDropZonePosition(leftZoneLayout, freshContainerLayout);
        setNumberPositions((prev) => new Map(prev).set(number, dropPosition));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }

      // Check right zone
      if (doBoxesIntersect(draggedItemBox, rightZoneLayout)) {
        if (rightValue !== null) animateNumberToRandomPosition(rightValue);
        setRightValue(number);
        const dropPosition = getDropZonePosition(rightZoneLayout, freshContainerLayout);
        setNumberPositions((prev) => new Map(prev).set(number, dropPosition));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }

      // Not snapped to any zone
      animateNumberToRandomPosition(number);
    },
    [leftValue, rightValue, animateNumberToRandomPosition, getDropZonePosition]
  );

  const finalizeTaskProgress = useCallback(() => {
    const isCorrect = checkAnswers(leftValue, rightValue, task.operation, task.result);

    dispatch({
      type: "GET_NEXT_TASK",
      payload: {
        isCorrect,
        maxLevelStep,
      },
    });

    setDisplayTaskResults(false);
    setLeftValue(null);
    setRightValue(null);
    initializedRef.current = false;
    // setHasAppliedLifePenalty(false);
    hasAppliedLifePenaltyRef.current = false;
  }, [leftValue, rightValue, task.operation, task.result, dispatch, maxLevelStep]);

  const nextLevelValue = (levelNumber + 1).toString();
  const isAllAnswersCorrect = checkAnswers(leftValue, rightValue, task.operation, task.result);

  const { goToNextTask, handleGoHome, handleNextLevel } = createLevelNavigationHandlers({
    isFinalTaskInLevel,
    hasNextLevel,
    finalizeTaskProgress,
    router,
    nextLevelValue,
  });

  const handleCheckAnswers = useCallback(() => {
    // Use ref for synchronous check to prevent double life loss on rapid taps
    if (hasAppliedLifePenaltyRef.current) {
      setDisplayTaskResults(true);
      return;
    }

    const isCorrect = checkAnswers(leftValue, rightValue, task.operation, task.result);

    if (!isCorrect) {
      hasAppliedLifePenaltyRef.current = true;
      dispatch({ type: "LOSE_LIFE" });
      // setHasAppliedLifePenalty(true);
    }

    setDisplayTaskResults(true);
  }, [leftValue, rightValue, task.operation, task.result, dispatch]);

  const handleTryAgain = useCallback(() => {
    setLeftValue(null);
    setRightValue(null);
    setDisplayTaskResults(false);
    initializedRef.current = false;
    hasAppliedLifePenaltyRef.current = false;
    setResetKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <View>
        <View
          style={{
            gap: 6,
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ThemedText type="subtitle">Izveido</ThemedText>
          <ThemedText type="subtitle" style={{ color: "#D81E5B" }}>
            vienādojumu
          </ThemedText>
        </View>

        <View
          style={{
            gap: 16,
            paddingTop: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            ref={leftZoneRef}
            style={[
              styles.dropZone,
              {
                borderColor: dropZoneColors.border,
                backgroundColor: dropZoneColors.background,
              },
            ]}
          />

          <ThemedText type="defaultSemiBold" style={styles.operationText}>
            {task.operation}
          </ThemedText>

          <View
            ref={rightZoneRef}
            style={[
              styles.dropZone,
              {
                borderColor: dropZoneColors.border,
                backgroundColor: dropZoneColors.background,
              },
            ]}
          />

          <ThemedText type="defaultSemiBold" style={styles.operationText}>
            = {task.result}
          </ThemedText>
        </View>

        <View
          ref={containerRef}
          onLayout={() => {
            containerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
              setContainerLayout({ x: pageX, y: pageY, width, height });
            });
          }}
          style={styles.numbersContainer}
        >
          {numbers.map((number) => {
            const position = numberPositions.get(number);
            if (!position) {
              return null;
            }
            return (
              <DraggableNumber
                key={number}
                number={number}
                initialPosition={position}
                isSnapped={leftValue === number || rightValue === number}
                onDrop={(x, y) => handleDrop(x, y, number)}
              />
            );
          })}
        </View>
      </View>
      {!displayTaskResults ? (
        <View
          style={{
            display: "flex",
            marginBottom: 26,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <MainButton disabled={!isBothValuesSet} onPress={checkAnswers}> */}
          <MainButton disabled={!isBothValuesSet} onPress={handleCheckAnswers}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 20,
              }}
            >
              {displayTaskResults ? "Nākamais uzdevums" : "Pārbaudīt"}
            </ThemedText>
          </MainButton>
        </View>
      ) : (
        <ShowResults
          lives={lives}
          adLoaded={adLoaded}
          onGoHomePress={handleGoHome}
          isAllAnswersCorrect={isAllAnswersCorrect}
          onNextTaskPress={goToNextTask}
          onTryAgainPress={handleTryAgain}
          onWatchAdPress={() => {
            showAdForReward(
              () => {
                // Called when user earns reward
                dispatch({ type: "RESTORE_LIFE_FROM_AD" });
                // Reset task - free retry after watching ad
                setLeftValue(null);
                setRightValue(null);
                initializedRef.current = false;
                // setHasAppliedLifePenalty(false);
                hasAppliedLifePenaltyRef.current = false;
                setResetKey((prev) => prev + 1);
              },
              () => {
                // Called when ad closes (regardless of reward)
                setDisplayTaskResults(false);
              }
            );
          }}
          levelCompletionState={
            isFinalTaskInLevel
              ? {
                  hasNextLevel,
                  isCompleted: true,
                  onGoHomePress: handleGoHome,
                  onNextLevelPress: handleNextLevel,
                }
              : undefined
          }
        />
      )}
    </>
  );
}

interface DraggableNumberProps {
  number: number;
  isSnapped: boolean;
  initialPosition: NumberPosition;
  onDrop: (x: number, y: number) => void;
}

const DraggableNumber = ({ number, initialPosition, onDrop, isSnapped }: DraggableNumberProps) => {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";

  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const context = useSharedValue({ x: 0, y: 0 });
  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);

  // use a shared value (not a React ref) for data accessed in worklets
  const isSnappedSV = useSharedValue(isSnapped);

  useEffect(() => {
    isSnappedSV.value = isSnapped;
    scale.value = withSpring(isSnapped ? SNAPPED_SCALE : NORMAL_SCALE);
  }, [isSnapped, scale, isSnappedSV]);

  useEffect(() => {
    positionX.value = withSpring(initialPosition.x);
    positionY.value = withSpring(initialPosition.y);
  }, [initialPosition, positionX, positionY]);

  const gradientColors = isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"];
  const textColor = isDarkMode ? "#ffffff" : "#166534";

  const panGesture = Gesture.Pan()
    .onStart(async () => {
      context.value = { x: positionX.value, y: positionY.value };
      isDragging.value = true;
      scale.value = withSpring(DRAG_SCALE);
      zIndex.value = 999;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      positionX.value = context.value.x + event.translationX;
      positionY.value = context.value.y + event.translationY;
    })
    .onEnd((event) => {
      const { absoluteX, absoluteY } = event;
      scheduleOnRN(onDrop, absoluteX, absoluteY);
      zIndex.value = 0;
      isDragging.value = false;
      scale.value = withSpring(isSnappedSV.value ? SNAPPED_SCALE : NORMAL_SCALE);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: positionY.value,
    zIndex: zIndex.value,
    left: positionX.value,
    elevation: zIndex.value,
    transform: [{ scale: scale.value }],
  }));

  const dragColorDark = isSnapped ? "rgba(34,197,94,0.22)" : "rgba(34,211,238,0.22)";
  const dragColorLight = isSnapped ? "rgba(34,197,94,0.16)" : "rgba(34,211,238,0.18)";

  const overlayStyle = useAnimatedStyle(() => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    position: "absolute",
    backgroundColor: isDarkMode ? dragColorDark : dragColorLight,
    opacity: withSpring(isDragging.value ? 1 : 0, { damping: 12, stiffness: 180 }),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <LinearGradient
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.5, y: 0 }}
          style={styles.numberContainer}
          colors={gradientColors as [string, string]}
        >
          <Animated.View style={overlayStyle} pointerEvents="none" />
          <ThemedText type="defaultSemiBold" style={{ fontSize: 32, color: textColor, textAlign: "center" }}>
            {number}
          </ThemedText>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  dropZone: {
    width: DROP_ZONE_SIZE,
    height: DROP_ZONE_SIZE,
    borderWidth: 3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  numbersContainer: {
    height: CONTAINER_HEIGHT,
    marginTop: 50,
    position: "relative",
    overflow: "visible",
  },
  operationText: {
    fontSize: 40,
  },
  numberContainer: {
    width: DRAGGABLE_NUMBER_SIZE,
    height: DRAGGABLE_NUMBER_SIZE,
    elevation: 2,
    borderWidth: 1,
    borderRadius: 8,
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
  },
});
