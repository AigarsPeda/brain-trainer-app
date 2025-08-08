import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateMathTaskType, LevelsEnum } from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View, useColorScheme } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const DRAGGABLE_NUMBER_SIZE = 75;
const COLLISION_BUFFER = 10; // Extra space between numbers

// A helper function to measure a view and return a Promise
const measureView = (ref: React.RefObject<View | null>): Promise<LayoutRectangle> => {
  if (!ref.current) {
    return Promise.resolve({ x: 0, y: 0, width: 0, height: 0 });
  }

  return new Promise((resolve) => {
    if (ref.current) {
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        resolve({ x: pageX, y: pageY, width, height });
      });
    } else {
      // Resolve with an empty layout if the ref is not available
      resolve({ x: 0, y: 0, width: 0, height: 0 });
    }
  });
};

const doBoxesIntersect = (boxA: LayoutRectangle, boxB: LayoutRectangle) => {
  // Simple bounding box intersection check
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
  task: CreateMathTaskType;
}

export function CreateMathTask({ task }: CreateMathTaskProps) {
  const theme = useThemeColor();
  const leftZoneRef = useRef<View>(null);
  const rightZoneRef = useRef<View>(null);
  const containerRef = useRef<View>(null);

  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [rightValue, setRightValue] = useState<number | null>(null);
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle | null>(null);

  const [numberPositions, setNumberPositions] = useState<Map<number, NumberPosition>>(new Map());
  const numbers = useMemo(() => task.options.map((item) => Number(item.number)), [task.options]);

  // ensure we only initialize once after container layout is available
  const initializedRef = useRef(false);

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

      const margin = 20;
      const spacing = DRAGGABLE_NUMBER_SIZE + COLLISION_BUFFER;
      const cols = Math.floor((containerLayout.width - margin * 2) / spacing);
      const rows = Math.floor((200 - margin * 2) / spacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = margin + col * spacing;
          const y = margin + row * spacing;
          const position = { x, y };

          if (!isPositionOccupied(position, existingPositions, excludeNumber)) {
            return position;
          }
        }
      }

      return { x: margin, y: margin };
    },
    [containerLayout, isPositionOccupied]
  );

  const generateRandomPosition = useCallback(
    (existingPositions: Map<number, NumberPosition> = new Map(), excludeNumber?: number): NumberPosition => {
      if (!containerLayout) {
        return { x: 0, y: 0 };
      }

      const margin = 20;
      const maxWidth = containerLayout.width - DRAGGABLE_NUMBER_SIZE - margin * 2;
      const maxHeight = 200 - DRAGGABLE_NUMBER_SIZE - margin * 2;

      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        const x = Math.random() * maxWidth + margin;
        const y = Math.random() * maxHeight + margin;
        const newPosition = { x, y };

        if (!isPositionOccupied(newPosition, existingPositions, excludeNumber)) {
          return newPosition;
        }

        attempts++;
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

  const getDropZonePosition = (zoneLayout: LayoutRectangle, containerLayout: LayoutRectangle): NumberPosition => {
    const relativeX = zoneLayout.x - containerLayout.x + (zoneLayout.width - DRAGGABLE_NUMBER_SIZE) / 2;
    const relativeY = zoneLayout.y - containerLayout.y + (zoneLayout.height - DRAGGABLE_NUMBER_SIZE) / 2;

    return { x: relativeX, y: relativeY };
  };

  const handleDrop = async (x: number, y: number, number: number) => {
    if (leftValue === number) {
      setLeftValue(null);
    }
    if (rightValue === number) {
      setRightValue(null);
    }

    const draggedItemBox: LayoutRectangle = {
      x: x - DRAGGABLE_NUMBER_SIZE / 2,
      y: y - DRAGGABLE_NUMBER_SIZE / 2,
      width: DRAGGABLE_NUMBER_SIZE,
      height: DRAGGABLE_NUMBER_SIZE,
    };

    // Measure the drop zones at the time of the drop
    const leftZoneLayout = await measureView(leftZoneRef);
    const rightZoneLayout = await measureView(rightZoneRef);

    let snapped = false;

    if (containerLayout && doBoxesIntersect(draggedItemBox, leftZoneLayout)) {
      if (leftValue !== null) {
        animateNumberToRandomPosition(leftValue);
      }

      setLeftValue(number);
      const dropPosition = getDropZonePosition(leftZoneLayout, containerLayout);
      setNumberPositions((prev) => new Map(prev.set(number, dropPosition)));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      snapped = true;
    } else if (containerLayout && doBoxesIntersect(draggedItemBox, rightZoneLayout)) {
      if (rightValue !== null) {
        animateNumberToRandomPosition(rightValue);
      }

      setRightValue(number);
      const dropPosition = getDropZonePosition(rightZoneLayout, containerLayout);
      setNumberPositions((prev) => new Map(prev.set(number, dropPosition)));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      snapped = true;
    }

    if (!snapped) {
      animateNumberToRandomPosition(number);
    }
  };

  const checkAnswers = () => {
    if (leftValue !== null && rightValue !== null) {
      let calculatedResult;
      switch (task.operation) {
        case "+":
          calculatedResult = leftValue + rightValue;
          break;
        case "-":
          calculatedResult = leftValue - rightValue;
          break;
        case "×":
        case "*":
          calculatedResult = leftValue * rightValue;
          break;
        case "÷":
        case "/":
          calculatedResult = leftValue / rightValue;
          break;
        default:
          calculatedResult = 0;
      }

      const isCorrect = calculatedResult === task.result;
      // handlePress(task.id, isCorrect);
      console.log(`Task ID: ${task.id}, Is Correct: ${isCorrect}`);
    }
  };

  return (
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
        <View ref={leftZoneRef} style={{ ...styles.button, borderColor: theme.border }}></View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
          {task.operation}
        </ThemedText>

        <View ref={rightZoneRef} style={{ ...styles.button, borderColor: theme.border }}></View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
          = {task.result}
        </ThemedText>
      </View>

      <View
        ref={containerRef}
        onLayout={() => {
          containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setContainerLayout({ x: pageX, y: pageY, width, height });
          });
        }}
        style={{ height: 200, marginTop: 50, position: "relative" }}
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
              onDrop={(x, y) => handleDrop(x, y, number)}
            />
          );
        })}
      </View>

      <View style={{ marginTop: 20 }}>
        <ThemedText
          onPress={checkAnswers}
          style={{
            padding: 10,
            backgroundColor: theme.tint,
            color: "white",
            textAlign: "center",
            borderRadius: 8,
          }}
        >
          Check Answers (Debug)
        </ThemedText>
      </View>
    </ThemedView>
  );
}

// DraggableNumber component remains the same
interface DraggableNumberProps {
  number: number;
  initialPosition: NumberPosition;
  onDrop: (x: number, y: number) => void;
}

const DraggableNumber = ({ number, initialPosition, onDrop }: DraggableNumberProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);
  const scale = useSharedValue(1);
  const context = useSharedValue({ x: 0, y: 0 });

  const gradientColors = isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"];
  const textColor = isDarkMode ? "#ffffff" : "#166534";

  useEffect(() => {
    positionX.value = withSpring(initialPosition.x);
    positionY.value = withSpring(initialPosition.y);
  }, [initialPosition, positionX, positionY]);

  const panGesture = Gesture.Pan()
    .onStart(async () => {
      context.value = { x: positionX.value, y: positionY.value };
      scale.value = withSpring(1.4);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      positionX.value = context.value.x + event.translationX;
      positionY.value = context.value.y + event.translationY;
    })
    .onEnd((event) => {
      const { absoluteX, absoluteY } = event;
      runOnJS(onDrop)(absoluteX, absoluteY);
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: positionX.value,
    top: positionY.value,
    transform: [{ scale: scale.value }],
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
          <ThemedText type="defaultSemiBold" style={{ fontSize: 32, color: textColor, textAlign: "center" }}>
            {number}
          </ThemedText>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 110,
    height: 110,
    borderWidth: 3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  numberContainer: {
    width: 75,
    height: 75,
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
