import { MainButton } from "@/components/MainButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import { DropZoneColors } from "@/constants/Colors";
import { CreateMathTaskType } from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useTaskLifecycle } from "@/hooks/useTaskLifecycle";
import { checkAnswers } from "@/utils/game";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// Constants
const CONTAINER_HEIGHT = 220;
const GRID_COLS = 2;
const GRID_ROWS = 2;
const GRID_MARGIN = 20;
const DRAG_SCALE = 1.7;
const NORMAL_SCALE = 1;
const BUTTON_BOTTOM_MARGIN = 26;
const BUTTON_CONTAINER_HEIGHT = 70;
const BUTTON_CONTENT_PADDING = 24;

type ResponsiveCreateMathLayout = {
  dropZoneSize: number;
  draggableNumberSize: number;
  equationFontSize: number;
  rowGap: number;
  draggableNumberFontSize: number;
  snappedScale: number;
};

export const getResponsiveCreateMathLayout = (width: number): ResponsiveCreateMathLayout => {
  const baseLayout =
    width >= 390
      ? { dropZoneSize: 110, draggableNumberSize: 75, equationFontSize: 40, rowGap: 16, draggableNumberFontSize: 32 }
      : width >= 360
        ? { dropZoneSize: 96, draggableNumberSize: 70, equationFontSize: 32, rowGap: 12, draggableNumberFontSize: 30 }
        : { dropZoneSize: 84, draggableNumberSize: 64, equationFontSize: 28, rowGap: 8, draggableNumberFontSize: 28 };

  return {
    ...baseLayout,
    snappedScale: Math.min(1.4, (baseLayout.dropZoneSize - 8) / baseLayout.draggableNumberSize),
  };
};

const doBoxesIntersect = (boxA: LayoutRectangle, boxB: LayoutRectangle) => {
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
};

const getDropZonePosition = (zoneLayout: LayoutRectangle, draggableNumberSize: number): NumberPosition => {
  const relativeX = zoneLayout.x + (zoneLayout.width - draggableNumberSize) / 2;
  const relativeY = zoneLayout.y + (zoneLayout.height - draggableNumberSize) / 2;

  return { x: relativeX, y: relativeY };
};

interface NumberPosition {
  x: number;
  y: number;
}

interface CreateMathTaskOption {
  id: number;
  value: number;
}

interface CreateMathTaskProps {
  level: string;
  maxLevelStep: number;
  task: CreateMathTaskType;
  isFinalTaskInLevel: boolean;
  removedAnswerIds?: number[];
  getLevelCompletionDurationMs?: () => number;
  isBossLevel?: boolean;
  onBossInteraction?: () => void;
}

export function CreateMathTask({
  level,
  task,
  maxLevelStep,
  isFinalTaskInLevel,
  removedAnswerIds = [],
  getLevelCompletionDurationMs,
  isBossLevel = false,
  onBossInteraction,
}: CreateMathTaskProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useAppColorScheme();
  const dropZoneColors = DropZoneColors[colorScheme ?? "dark"];
  const { dropZoneSize, draggableNumberSize, equationFontSize, rowGap, draggableNumberFontSize, snappedScale } =
    useMemo(() => getResponsiveCreateMathLayout(width), [width]);

  const [leftOptionId, setLeftOptionId] = useState<number | null>(null);
  const [rightOptionId, setRightOptionId] = useState<number | null>(null);
  const [leftZoneLayout, setLeftZoneLayout] = useState<LayoutRectangle | null>(null);
  const [rightZoneLayout, setRightZoneLayout] = useState<LayoutRectangle | null>(null);
  const [numbersContainerLayout, setNumbersContainerLayout] = useState<LayoutRectangle | null>(null);

  const [numberPositions, setNumberPositions] = useState<Map<number, NumberPosition>>(new Map());
  const options = useMemo<CreateMathTaskOption[]>(
    () =>
      task.options
        .filter((option) => !removedAnswerIds.includes(option.id))
        .map((option) => ({ id: option.id, value: Number(option.number) })),
    [task.options, removedAnswerIds]
  );
  const optionValueMap = useMemo(() => new Map(options.map((option) => [option.id, option.value])), [options]);

  const initializedRef = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const leftValue = leftOptionId !== null ? (optionValueMap.get(leftOptionId) ?? null) : null;
  const rightValue = rightOptionId !== null ? (optionValueMap.get(rightOptionId) ?? null) : null;
  const isBothValuesSet = leftOptionId !== null && rightOptionId !== null;

  const checkIfCorrect = useCallback((): boolean => {
    return checkAnswers(leftValue, rightValue, task.operation, task.result);
  }, [leftValue, rightValue, task.operation, task.result]);

  const resetTaskState = useCallback(() => {
    setLeftOptionId(null);
    setRightOptionId(null);
    initializedRef.current = false;
    setResetKey((prev) => prev + 1);
  }, []);

  const { displayTaskResults, handleCheckAnswers, showResultsProps } = useTaskLifecycle({
    level,
    maxLevelStep,
    isFinalTaskInLevel,
    taskNumberInLevel: task.taskNumberInLevel,
    checkIfCorrect,
    resetTaskState,
    getLevelCompletionDurationMs,
    isBossLevel,
  });

  const isAllAnswersCorrect = checkIfCorrect();

  const updateLayout = useCallback(
    (setter: React.Dispatch<React.SetStateAction<LayoutRectangle | null>>, event: LayoutChangeEvent) => {
      const { x, y, width: nextWidth, height: nextHeight } = event.nativeEvent.layout;

      setter((previous) => {
        if (
          previous?.x === x &&
          previous?.y === y &&
          previous?.width === nextWidth &&
          previous?.height === nextHeight
        ) {
          return previous;
        }

        return { x, y, width: nextWidth, height: nextHeight };
      });
    },
    []
  );

  const generateAllPositions = useCallback(
    (optionIds: number[]): Map<number, NumberPosition> => {
      if (!numbersContainerLayout) {
        return new Map();
      }

      const availableWidth = numbersContainerLayout.width - GRID_MARGIN * 2;
      const availableHeight = numbersContainerLayout.height - GRID_MARGIN * 2;

      const cellWidth = availableWidth / GRID_COLS;
      const cellHeight = availableHeight / GRID_ROWS;

      const maxOffsetX = Math.max(0, Math.min(30, (cellWidth - draggableNumberSize * DRAG_SCALE) / 2));
      const maxOffsetY = Math.max(0, Math.min(30, (cellHeight - draggableNumberSize * DRAG_SCALE) / 2));

      const gridPositions: NumberPosition[] = [];

      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const baseX = GRID_MARGIN + col * cellWidth + (cellWidth - draggableNumberSize) / 2;
          const baseY = GRID_MARGIN + row * cellHeight + (cellHeight - draggableNumberSize) / 2;

          const randomOffsetX = (Math.random() - 0.5) * 2 * maxOffsetX;
          const randomOffsetY = (Math.random() - 0.5) * 2 * maxOffsetY;

          const x = baseX + randomOffsetX;
          const y = baseY + randomOffsetY;

          gridPositions.push({ x, y });
        }
      }

      const shuffledPositions = gridPositions.sort(() => Math.random() - 0.5);

      const positionsMap = new Map<number, NumberPosition>();
      optionIds.forEach((optionId, index) => {
        positionsMap.set(optionId, shuffledPositions[index] || { x: GRID_MARGIN, y: GRID_MARGIN });
      });

      return positionsMap;
    },
    [draggableNumberSize, numbersContainerLayout]
  );

  const generateRandomPosition = useCallback(
    (existingPositions: Map<number, NumberPosition> = new Map(), excludeOptionId?: number): NumberPosition => {
      if (!numbersContainerLayout) {
        return { x: 0, y: 0 };
      }

      const availableWidth = numbersContainerLayout.width - GRID_MARGIN * 2;
      const availableHeight = numbersContainerLayout.height - GRID_MARGIN * 2;

      const cellWidth = availableWidth / GRID_COLS;
      const cellHeight = availableHeight / GRID_ROWS;
      const minimumSpacing = draggableNumberSize * 0.65;
      const offsetRangeX = Math.max(0, Math.min(20, (cellWidth - draggableNumberSize) / 2));
      const offsetRangeY = Math.max(0, Math.min(20, (cellHeight - draggableNumberSize) / 2));

      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const x = GRID_MARGIN + col * cellWidth + (cellWidth - draggableNumberSize) / 2;
          const y = GRID_MARGIN + row * cellHeight + (cellHeight - draggableNumberSize) / 2;

          let isOccupied = false;
          for (const [optionId, existingPos] of existingPositions) {
            if (excludeOptionId !== undefined && optionId === excludeOptionId) {
              continue;
            }
            if (Math.abs(x - existingPos.x) < minimumSpacing && Math.abs(y - existingPos.y) < minimumSpacing) {
              isOccupied = true;
              break;
            }
          }

          if (!isOccupied) {
            const offsetX = (Math.random() - 0.5) * 2 * offsetRangeX;
            const offsetY = (Math.random() - 0.5) * 2 * offsetRangeY;
            return { x: x + offsetX, y: y + offsetY };
          }
        }
      }

      return { x: GRID_MARGIN, y: GRID_MARGIN };
    },
    [draggableNumberSize, numbersContainerLayout]
  );

  useEffect(() => {
    initializedRef.current = false;
  }, [draggableNumberSize]);

  useEffect(() => {
    if (!numbersContainerLayout) {
      return;
    }
    if (initializedRef.current) {
      return;
    }

    const initialPositions = generateAllPositions(options.map((option) => option.id));

    setNumberPositions(initialPositions);
    initializedRef.current = true;
  }, [generateAllPositions, numbersContainerLayout, options, resetKey]);

  const animateNumberToRandomPosition = useCallback(
    (optionId: number) => {
      setNumberPositions((prev) => {
        const cloned = new Map(prev);
        const newPosition = generateRandomPosition(prev, optionId);
        cloned.set(optionId, newPosition);
        return cloned;
      });
    },
    [generateRandomPosition]
  );

  const getRelativeDropZoneLayout = useCallback(
    (zoneLayout: LayoutRectangle | null): LayoutRectangle | null => {
      if (!zoneLayout || !numbersContainerLayout) {
        return null;
      }

      return {
        x: zoneLayout.x - numbersContainerLayout.x,
        y: zoneLayout.y - numbersContainerLayout.y,
        width: zoneLayout.width,
        height: zoneLayout.height,
      };
    },
    [numbersContainerLayout]
  );

  const handleDrop = useCallback(
    (centerX: number, centerY: number, optionId: number) => {
      if (!numbersContainerLayout) {
        animateNumberToRandomPosition(optionId);
        return;
      }

      if (leftOptionId === optionId) {
        setLeftOptionId(null);
      }
      if (rightOptionId === optionId) {
        setRightOptionId(null);
      }

      const draggedItemBox: LayoutRectangle = {
        x: centerX - draggableNumberSize / 2,
        y: centerY - draggableNumberSize / 2,
        width: draggableNumberSize,
        height: draggableNumberSize,
      };

      const leftDropZoneLayout = getRelativeDropZoneLayout(leftZoneLayout);
      const rightDropZoneLayout = getRelativeDropZoneLayout(rightZoneLayout);

      if (!leftDropZoneLayout || !rightDropZoneLayout) {
        animateNumberToRandomPosition(optionId);
        return;
      }

      if (doBoxesIntersect(draggedItemBox, leftDropZoneLayout)) {
        onBossInteraction?.();
        if (leftOptionId !== null && leftOptionId !== optionId) {
          animateNumberToRandomPosition(leftOptionId);
        }
        setLeftOptionId(optionId);
        const dropPosition = getDropZonePosition(leftDropZoneLayout, draggableNumberSize);
        setNumberPositions((prev) => new Map(prev).set(optionId, dropPosition));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }

      if (doBoxesIntersect(draggedItemBox, rightDropZoneLayout)) {
        onBossInteraction?.();
        if (rightOptionId !== null && rightOptionId !== optionId) {
          animateNumberToRandomPosition(rightOptionId);
        }
        setRightOptionId(optionId);
        const dropPosition = getDropZonePosition(rightDropZoneLayout, draggableNumberSize);
        setNumberPositions((prev) => new Map(prev).set(optionId, dropPosition));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }

      animateNumberToRandomPosition(optionId);
    },
    [
      animateNumberToRandomPosition,
      draggableNumberSize,
      getRelativeDropZoneLayout,
      leftOptionId,
      leftZoneLayout,
      numbersContainerLayout,
      rightOptionId,
      rightZoneLayout,
      onBossInteraction,
    ]
  );

  return (
    <>
      {!displayTaskResults ? (
        <View style={styles.taskLayout}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            <View
              style={{
                gap: 6,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                paddingHorizontal: 16,
              }}
            >
              <ThemedText type="subtitle">Izveido</ThemedText>
              <ThemedText type="subtitle" style={{ color: "#D81E5B" }}>
                vienādojumu
              </ThemedText>
            </View>
            <View style={styles.boardLayout}>
              <View testID="equation-row" style={[styles.equationRow, { gap: rowGap }]}>
                <View
                  testID="left-drop-zone"
                  onLayout={(event) => updateLayout(setLeftZoneLayout, event)}
                  style={[
                    styles.dropZone,
                    {
                      width: dropZoneSize,
                      height: dropZoneSize,
                      borderColor: dropZoneColors.border,
                      backgroundColor: dropZoneColors.background,
                    },
                  ]}
                />

                <ThemedText type="defaultSemiBold" style={[styles.operationText, { fontSize: equationFontSize }]}>
                  {task.operation}
                </ThemedText>

                <View
                  testID="right-drop-zone"
                  onLayout={(event) => updateLayout(setRightZoneLayout, event)}
                  style={[
                    styles.dropZone,
                    {
                      width: dropZoneSize,
                      height: dropZoneSize,
                      borderColor: dropZoneColors.border,
                      backgroundColor: dropZoneColors.background,
                    },
                  ]}
                />

                <ThemedText type="defaultSemiBold" style={[styles.operationText, { fontSize: equationFontSize }]}>
                  =
                </ThemedText>

                <View style={styles.resultContainer}>
                  <ThemedText
                    testID="result-text"
                    type="defaultSemiBold"
                    style={[styles.operationText, styles.resultText, { fontSize: equationFontSize }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {task.result}
                  </ThemedText>
                </View>
              </View>

              <View
                onLayout={(event) => updateLayout(setNumbersContainerLayout, event)}
                style={styles.numbersContainer}
              >
                {options.map((option) => {
                  const position = numberPositions.get(option.id);
                  const isSnapped = leftOptionId === option.id || rightOptionId === option.id;

                  if (!position) {
                    return null;
                  }

                  return (
                    <DraggableNumber
                      key={option.id}
                      optionId={option.id}
                      value={option.value}
                      size={draggableNumberSize}
                      fontSize={draggableNumberFontSize}
                      snappedScale={snappedScale}
                      initialPosition={position}
                      isSnapped={isSnapped}
                      onDrop={handleDrop}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <MainButton disabled={!isBothValuesSet} onPress={handleCheckAnswers}>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 20,
                }}
              >
                Pārbaudīt
              </ThemedText>
            </MainButton>
          </View>
        </View>
      ) : (
        <ShowResults isAllAnswersCorrect={isAllAnswersCorrect} {...showResultsProps} />
      )}
    </>
  );
}

interface DraggableNumberProps {
  optionId: number;
  value: number;
  size: number;
  fontSize: number;
  snappedScale: number;
  isSnapped: boolean;
  initialPosition: NumberPosition;
  onDrop: (centerX: number, centerY: number, optionId: number) => void;
}

const DraggableNumber = ({
  optionId,
  value,
  size,
  fontSize,
  snappedScale,
  initialPosition,
  onDrop,
  isSnapped,
}: DraggableNumberProps) => {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";

  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const context = useSharedValue({ x: 0, y: 0 });
  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);

  const isSnappedSV = useSharedValue(isSnapped);

  useEffect(() => {
    isSnappedSV.value = isSnapped;
    scale.value = withSpring(isSnapped ? snappedScale : NORMAL_SCALE);
  }, [isSnapped, scale, isSnappedSV, snappedScale]);

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
    .onEnd(() => {
      scheduleOnRN(onDrop, positionX.value + size / 2, positionY.value + size / 2, optionId);
      zIndex.value = 0;
      isDragging.value = false;
      scale.value = withSpring(isSnappedSV.value ? snappedScale : NORMAL_SCALE);
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
          testID={`draggable-number-${optionId}`}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.5, y: 0 }}
          style={[styles.numberContainer, { width: size, height: size, borderRadius: Math.max(8, size * 0.14) }]}
          colors={gradientColors as [string, string]}
        >
          <Animated.View style={overlayStyle} pointerEvents="none" />
          <ThemedText type="defaultSemiBold" style={{ fontSize, color: textColor, textAlign: "center" }}>
            {value}
          </ThemedText>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  taskLayout: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: BUTTON_BOTTOM_MARGIN + BUTTON_CONTAINER_HEIGHT + BUTTON_CONTENT_PADDING,
  },
  boardLayout: {
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    right: 0,
    bottom: BUTTON_BOTTOM_MARGIN,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 20,
  },
  dropZone: {
    borderWidth: 3,
    borderRadius: 12,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  equationRow: {
    width: "100%",
    paddingTop: 30,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  numbersContainer: {
    height: CONTAINER_HEIGHT,
    marginTop: 50,
    position: "relative",
    overflow: "visible",
  },
  operationText: {
    flexShrink: 0,
  },
  resultContainer: {
    minWidth: 0,
    flexShrink: 1,
    justifyContent: "center",
  },
  resultText: {
    minWidth: 0,
  },
  numberContainer: {
    elevation: 2,
    borderWidth: 1,
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
  },
});
