import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateMathTaskType } from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { LayoutRectangle, StyleSheet, View, useColorScheme } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";

const DRAGGABLE_NUMBER_SIZE = 75;
const COLLISION_BUFFER = 10; // Extra space between numbers

const doBoxesIntersect = (boxA: LayoutRectangle, boxB: LayoutRectangle) => {
  const xIntersect = boxA.x < boxB.x + boxB.width && boxA.x + boxA.width > boxB.x;
  const yIntersect = boxA.y < boxB.y + boxB.height && boxA.y + boxA.height > boxB.y;
  return xIntersect && yIntersect;
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
  task: CreateMathTaskType;
}

export function CreateMathTask({ task }: CreateMathTaskProps) {
  const theme = useThemeColor();
  const leftZoneRef = useRef<View>(null);
  const rightZoneRef = useRef<View>(null);
  const containerRef = useRef<View>(null);

  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [rightValue, setRightValue] = useState<number | null>(null);
  const [leftZoneLayout, setLeftZoneLayout] = useState<LayoutRectangle | null>(null);
  const [rightZoneLayout, setRightZoneLayout] = useState<LayoutRectangle | null>(null);
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle | null>(null);

  const [numberPositions, setNumberPositions] = useState<Map<number, NumberPosition>>(new Map());
  const numbers = useMemo(() => task.options.map((item) => Number(item.number)), [task.options]);

  const isPositionOccupied = (
    newPosition: NumberPosition,
    existingPositions: Map<number, NumberPosition>,
    excludeNumber?: number
  ): boolean => {
    for (const [number, position] of existingPositions) {
      if (excludeNumber && number === excludeNumber) {
        continue;
      }
      if (doPositionsOverlap(newPosition, position)) {
        return true;
      }
    }
    return false;
  };

  // Generate random position that doesn't overlap with existing numbers
  const generateRandomPosition = (
    existingPositions: Map<number, NumberPosition> = new Map(),
    excludeNumber?: number
  ): NumberPosition => {
    if (!containerLayout) {
      return { x: 0, y: 0 };
    }

    const margin = 20;
    const maxWidth = containerLayout.width - DRAGGABLE_NUMBER_SIZE - margin * 2;
    const maxHeight = 200 - DRAGGABLE_NUMBER_SIZE - margin * 2;

    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    while (attempts < maxAttempts) {
      const x = Math.random() * maxWidth + margin;
      const y = Math.random() * maxHeight + margin;
      const newPosition = { x, y };

      if (!isPositionOccupied(newPosition, existingPositions, excludeNumber)) {
        return newPosition;
      }

      attempts++;
    }

    // Fallback: if we can't find a non-overlapping position, use a grid-based approach
    return generateGridPosition(existingPositions, excludeNumber);
  };

  // Fallback grid-based positioning when random positioning fails
  const generateGridPosition = (
    existingPositions: Map<number, NumberPosition>,
    excludeNumber?: number
  ): NumberPosition => {
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

    // Ultimate fallback
    return { x: margin, y: margin };
  };

  useEffect(() => {
    if (containerLayout) {
      const initialPositions = new Map<number, NumberPosition>();

      numbers.forEach((number) => {
        const position = generateRandomPosition(initialPositions);
        initialPositions.set(number, position);
      });

      setNumberPositions(initialPositions);
    }
  }, [containerLayout, numbers]);

  const animateNumberToRandomPosition = (number: number) => {
    setNumberPositions((prev) => {
      const newPosition = generateRandomPosition(prev, number);
      return new Map(prev.set(number, newPosition));
    });
  };

  const getDropZonePosition = (zoneLayout: LayoutRectangle, containerLayout: LayoutRectangle): NumberPosition => {
    // Calculate relative position within the container
    const relativeX = zoneLayout.x - containerLayout.x + (zoneLayout.width - DRAGGABLE_NUMBER_SIZE) / 2;
    const relativeY = zoneLayout.y - containerLayout.y + (zoneLayout.height - DRAGGABLE_NUMBER_SIZE) / 2;

    return { x: relativeX, y: relativeY };
  };

  const handleDrop = (x: number, y: number, number: number) => {
    const draggedItemBox: LayoutRectangle = {
      x: x - DRAGGABLE_NUMBER_SIZE / 2,
      y: y - DRAGGABLE_NUMBER_SIZE / 2,
      width: DRAGGABLE_NUMBER_SIZE,
      height: DRAGGABLE_NUMBER_SIZE,
    };

    let snapped = false;

    // Check if dropped on the left zone
    if (leftZoneLayout && containerLayout && doBoxesIntersect(draggedItemBox, leftZoneLayout)) {
      if (leftValue !== null) {
        // Animate the old number to a random position
        animateNumberToRandomPosition(leftValue);
      }

      setLeftValue(number);

      // Position the number in the left drop zone
      const dropPosition = getDropZonePosition(leftZoneLayout, containerLayout);
      setNumberPositions((prev) => new Map(prev.set(number, dropPosition)));

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      snapped = true;
    }

    // Check if dropped on the right zone
    if (rightZoneLayout && containerLayout && doBoxesIntersect(draggedItemBox, rightZoneLayout)) {
      if (rightValue !== null) {
        // Animate the old number to a random position
        animateNumberToRandomPosition(rightValue);
      }

      setRightValue(number);

      // Position the number in the right drop zone
      const dropPosition = getDropZonePosition(rightZoneLayout, containerLayout);
      setNumberPositions((prev) => new Map(prev.set(number, dropPosition)));

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      snapped = true;
    }

    // If not snapped, animate back to a random position
    if (!snapped) {
      animateNumberToRandomPosition(number);
    }
  };

  const checkAnswers = () => {
    console.log("Left value:", leftValue);
    console.log("Right value:", rightValue);
    console.log("Expected result:", task.result);

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

      console.log("Calculated result:", calculatedResult);
      console.log("Is correct:", calculatedResult === task.result);
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
        <View
          ref={leftZoneRef}
          onLayout={() => {
            leftZoneRef.current?.measure((x, y, width, height, pageX, pageY) => {
              setLeftZoneLayout({ x: pageX, y: pageY, width, height });
            });
          }}
          style={{ ...styles.button, borderColor: theme.border }}
        >
          {/* Empty - numbers will be visually positioned here */}
        </View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
          {task.operation}
        </ThemedText>

        <View
          ref={rightZoneRef}
          onLayout={() => {
            rightZoneRef.current?.measure((x, y, width, height, pageX, pageY) => {
              setRightZoneLayout({ x: pageX, y: pageY, width, height });
            });
          }}
          style={{ ...styles.button, borderColor: theme.border }}
        >
          {/* Empty - numbers will be visually positioned here */}
        </View>

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

      {/* Temporary button for testing */}
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

interface DraggableNumberProps {
  number: number;
  initialPosition: NumberPosition;
  onDrop: (x: number, y: number) => void;
}

const DraggableNumber = ({ number, initialPosition, onDrop }: DraggableNumberProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const baseX = useSharedValue(initialPosition.x);
  const baseY = useSharedValue(initialPosition.y);

  const gradientColors = isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"];
  const textColor = isDarkMode ? "#ffffff" : "#166534";

  // Update base position when initialPosition changes
  useEffect(() => {
    baseX.value = withSpring(initialPosition.x);
    baseY.value = withSpring(initialPosition.y);
  }, [baseX, baseY, initialPosition]);

  const panGesture = Gesture.Pan()
    .onStart(async () => {
      scale.value = withSpring(1.4);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const { absoluteX, absoluteY } = event;

      runOnJS(onDrop)(absoluteX, absoluteY);

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: baseX.value,
    top: baseY.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
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
  button: { width: 110, height: 110, borderWidth: 3, borderRadius: 12, alignItems: "center", justifyContent: "center" },
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
