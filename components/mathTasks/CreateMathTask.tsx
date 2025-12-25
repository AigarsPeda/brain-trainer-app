import { MainButton } from "@/components/MainButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateMathTaskType, LevelsEnum } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { useThemeColor } from "@/hooks/useThemeColor";
import { checkAnswers } from "@/utils/game";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View, useColorScheme } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// Constants
const DRAGGABLE_NUMBER_SIZE = 75;
const COLLISION_BUFFER = 10;
const DROP_ZONE_SIZE = 110;
const CONTAINER_HEIGHT = 200;
const GRID_COLS = 3;
const GRID_ROWS = 3;
const GRID_MARGIN = 25;
const POSITION_MARGIN = 20;
const MAX_POSITION_ATTEMPTS = 50;
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

const doPositionsOverlap = (pos1: NumberPosition, pos2: NumberPosition): boolean => {
  const size = DRAGGABLE_NUMBER_SIZE + COLLISION_BUFFER;
  const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  return distance < size;
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
}

export function CreateMathTask({ level, task, maxLevelStep, isFinalTaskInLevel }: CreateMathTaskProps) {
  const theme = useThemeColor();
  const leftZoneRef = useRef<View | null>(null);
  const rightZoneRef = useRef<View | null>(null);
  const containerRef = useRef<View | null>(null);

  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [rightValue, setRightValue] = useState<number | null>(null);
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const [hasAppliedLifePenalty, setHasAppliedLifePenalty] = useState(false);
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle | null>(null);

  const [numberPositions, setNumberPositions] = useState<Map<number, NumberPosition>>(new Map());
  const numbers = useMemo(() => task.options.map((item) => Number(item.number)), [task.options]);

  // ensure we only initialize once after container layout is available
  const initializedRef = useRef(false);
  const isBothValuesSet = leftValue !== null && rightValue !== null;

  const {
    dispatch,
    state: { availableLevels, lives },
  } = useAppContext();
  const router = useRouter();
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const isPositionOccupied = useCallback(
    (newPosition: NumberPosition, existingPositions: Map<number, NumberPosition>, excludeNumber?: number): boolean => {
      for (const [num, position] of existingPositions) {
        if (excludeNumber !== undefined && num === excludeNumber) {
          continue;
        }
        if (doPositionsOverlap(newPosition, position)) {
          return true;
        }
      }
      return false;
    },
    []
  );

  const generateGridPosition = useCallback(
    (existingPositions: Map<number, NumberPosition>, excludeNumber?: number): NumberPosition => {
      if (!containerLayout) {
        return { x: 0, y: 0 };
      }

      const spacing = (containerLayout.width - GRID_MARGIN * 2) / GRID_COLS;
      const verticalSpacing = (CONTAINER_HEIGHT - GRID_MARGIN * 2) / GRID_ROWS;

      // Collect all available grid positions
      const gridPositions: NumberPosition[] = [];
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const x = GRID_MARGIN + col * spacing + (spacing - DRAGGABLE_NUMBER_SIZE) / 2;
          const y = GRID_MARGIN + row * verticalSpacing + (verticalSpacing - DRAGGABLE_NUMBER_SIZE) / 2;
          gridPositions.push({ x, y });
        }
      }

      // Shuffle and find first unoccupied position
      const shuffledPositions = gridPositions.sort(() => Math.random() - 0.5);

      for (const position of shuffledPositions) {
        if (!isPositionOccupied(position, existingPositions, excludeNumber)) {
          return position;
        }
      }

      // Fallback: return first grid position
      return gridPositions[0] || { x: GRID_MARGIN, y: GRID_MARGIN };
    },
    [containerLayout, isPositionOccupied]
  );

  const generateRandomPosition = useCallback(
    (existingPositions: Map<number, NumberPosition> = new Map(), excludeNumber?: number): NumberPosition => {
      if (!containerLayout) {
        return { x: 0, y: 0 };
      }

      const maxWidth = containerLayout.width - DRAGGABLE_NUMBER_SIZE - POSITION_MARGIN * 2;
      const maxHeight = CONTAINER_HEIGHT - DRAGGABLE_NUMBER_SIZE - POSITION_MARGIN * 2;

      for (let attempts = 0; attempts < MAX_POSITION_ATTEMPTS; attempts++) {
        const x = Math.random() * maxWidth + POSITION_MARGIN;
        const y = Math.random() * maxHeight + POSITION_MARGIN;
        const newPosition = { x, y };

        if (!isPositionOccupied(newPosition, existingPositions, excludeNumber)) {
          return newPosition;
        }
      }

      return generateGridPosition(existingPositions, excludeNumber);
    },
    [containerLayout, isPositionOccupied, generateGridPosition]
  );

  useEffect(() => {
    if (!containerLayout) {
      return;
    }
    if (initializedRef.current) {
      return;
    }

    const initialPositions = new Map<number, NumberPosition>();

    numbers.forEach((number) => {
      const position = generateRandomPosition(initialPositions);
      initialPositions.set(number, position);
    });

    setNumberPositions(initialPositions);
    initializedRef.current = true;
  }, [containerLayout, numbers, generateRandomPosition]);

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

  const getCorrectnessPercentage = useCallback(() => {
    const isCorrect = checkAnswers(leftValue, rightValue, task.operation, task.result);
    if (maxLevelStep <= 0) return isCorrect ? 100 : 0;

    const perTaskScore = Number((100 / maxLevelStep).toFixed(2));
    return isCorrect ? perTaskScore : 0;
  }, [leftValue, rightValue, task.operation, task.result, maxLevelStep]);

  const finalizeTaskProgress = useCallback(() => {
    const correctnessPercentage = getCorrectnessPercentage();

    dispatch({
      type: "GET_NEXT_TASK",
      payload: {
        correctnessPercentage,
        maxLevelStep,
      },
    });

    setDisplayTaskResults(false);
    setLeftValue(null);
    setRightValue(null);
    initializedRef.current = false;
    setHasAppliedLifePenalty(false);
  }, [getCorrectnessPercentage, dispatch, maxLevelStep]);

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
    const isCorrect = checkAnswers(leftValue, rightValue, task.operation, task.result);

    if (!isCorrect && !hasAppliedLifePenalty) {
      dispatch({ type: "LOSE_LIFE" });
      setHasAppliedLifePenalty(true);
    }

    setDisplayTaskResults(true);
  }, [leftValue, rightValue, task.operation, task.result, hasAppliedLifePenalty, dispatch]);

  const handleTryAgain = useCallback(() => {
    dispatch({ type: "LOSE_LIFE" });
    setLeftValue(null);
    setRightValue(null);
    setDisplayTaskResults(false);
    initializedRef.current = false;
  }, [dispatch]);

  return (
    <>
      <ThemedView>
        <ThemedView
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 6,
          }}
        >
          <ThemedText type="subtitle">Izveido</ThemedText>
          <ThemedText type="subtitle" style={{ color: "#D81E5B" }}>
            vienādojumu
          </ThemedText>
        </ThemedView>

        <View
          style={{
            flexDirection: "row",
            gap: 16,
            paddingTop: 30,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View ref={leftZoneRef} style={[styles.dropZone, { borderColor: theme.border }]} />

          <ThemedText type="defaultSemiBold" style={styles.operationText}>
            {task.operation}
          </ThemedText>

          <View ref={rightZoneRef} style={[styles.dropZone, { borderColor: theme.border }]} />

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
      </ThemedView>
      {!displayTaskResults ? (
        <ThemedView
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
        </ThemedView>
      ) : (
        <ShowResults
          lives={lives}
          adLoaded={adLoaded}
          onGoHomePress={handleGoHome}
          isAllAnswersCorrect={isAllAnswersCorrect}
          onNextTaskPress={goToNextTask}
          onTryAgainPress={handleTryAgain}
          onWatchAdPress={() => {
            showAdForReward(() => {
              dispatch({ type: "RESTORE_LIFE_FROM_AD" });
              // Reset task and close modal - free retry after watching ad
              setLeftValue(null);
              setRightValue(null);
              setDisplayTaskResults(false);
              initializedRef.current = false;
              setHasAppliedLifePenalty(false);
            });
          }}
          levelCompletionState={
            isFinalTaskInLevel
              ? {
                  isCompleted: true,
                  hasNextLevel,
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
  initialPosition: NumberPosition;
  onDrop: (x: number, y: number) => void;
  isSnapped: boolean;
}

const DraggableNumber = ({ number, initialPosition, onDrop, isSnapped }: DraggableNumberProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);
  const scale = useSharedValue(1);
  const context = useSharedValue({ x: 0, y: 0 });
  const isDragging = useSharedValue(false);
  const zIndex = useSharedValue(0);

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
          colors={gradientColors as [string, string]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.numberContainer}
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
