import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateMathTaskType } from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View, useColorScheme } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const DRAGGABLE_NUMBER_SIZE = 75;

const doBoxesIntersect = (boxA: LayoutRectangle, boxB: LayoutRectangle) => {
  "worklet";
  const xIntersect = boxA.x < boxB.x + boxB.width && boxA.x + boxA.width > boxB.x;
  const yIntersect = boxA.y < boxB.y + boxB.height && boxA.y + boxA.height > boxB.y;
  return xIntersect && yIntersect;
};

interface CreateMathTaskProps {
  task: CreateMathTaskType;
}

export function CreateMathTask({ task }: CreateMathTaskProps) {
  const theme = useThemeColor();
  const leftZoneRef = useRef<View>(null);
  const rightZoneRef = useRef<View>(null);
  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [rightValue, setRightValue] = useState<number | null>(null);
  const [leftZoneLayout, setLeftZoneLayout] = useState<LayoutRectangle | null>(null);
  const [rightZoneLayout, setRightZoneLayout] = useState<LayoutRectangle | null>(null);

  // --- MODIFIED ---
  // This function now handles replacing existing values.
  const handleDropOnLeft = (x: number, y: number, number: number) => {
    if (!leftZoneLayout) {
      return false;
    }

    const draggedItemBox: LayoutRectangle = {
      x: x - DRAGGABLE_NUMBER_SIZE / 2,
      y: y - DRAGGABLE_NUMBER_SIZE / 2,
      width: DRAGGABLE_NUMBER_SIZE,
      height: DRAGGABLE_NUMBER_SIZE,
    };

    if (doBoxesIntersect(draggedItemBox, leftZoneLayout)) {
      // If the number we are dropping is already in the *other* slot, clear the other slot.
      if (number === rightValue) {
        setRightValue(null);
      }
      // Set the new value for the left slot. The old value is automatically "returned" to the list.
      setLeftValue(number);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return true;
    }
    return false;
  };

  // --- MODIFIED ---
  // This function now also handles replacing existing values.
  const handleDropOnRight = (x: number, y: number, number: number) => {
    if (!rightZoneLayout) {
      return false;
    }

    const draggedItemBox: LayoutRectangle = {
      x: x - DRAGGABLE_NUMBER_SIZE / 2,
      y: y - DRAGGABLE_NUMBER_SIZE / 2,
      width: DRAGGABLE_NUMBER_SIZE,
      height: DRAGGABLE_NUMBER_SIZE,
    };

    if (doBoxesIntersect(draggedItemBox, rightZoneLayout)) {
      // If the number we are dropping is already in the *other* slot, clear the other slot.
      if (number === leftValue) {
        setLeftValue(null);
      }
      // Set the new value for the right slot.
      setRightValue(number);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return true;
    }
    return false;
  };

  const handleDrop = (x: number, y: number, number: number) => {
    // Try to drop on the left. If it succeeds, we're done.
    const droppedOnLeft = handleDropOnLeft(x, y, number);
    // If it didn't drop on the left, try to drop on the right.
    if (!droppedOnLeft) {
      handleDropOnRight(x, y, number);
    }
  };

  return (
    <ThemedView>
      <ThemedView style={{ width: "100%", display: "flex", flexDirection: "row", gap: 6 }}>
        <ThemedText type="subtitle">Izveido</ThemedText>
        <ThemedText type="subtitle" style={{ color: "#D81E5B" }}>
          vienādojumu
        </ThemedText>
      </ThemedView>
      <View
        style={{ flexDirection: "row", gap: 16, paddingTop: 30, alignItems: "center", justifyContent: "space-between" }}
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
          <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
            {leftValue !== null ? leftValue : "?"}
          </ThemedText>
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
          <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
            {rightValue !== null ? rightValue : "?"}
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
          = {task.result}
        </ThemedText>
      </View>

      <Animated.FlatList
        horizontal
        data={task.options}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const num = Number(item.number);
          // This logic remains the same. It correctly filters based on the current state.
          const isDropped = num === leftValue || num === rightValue;

          if (isDropped) {
            return null;
          }

          return <DraggableNumber number={num} onDrop={(x, y) => handleDrop(x, y, num)} />;
        }}
        style={{ overflow: "visible", paddingTop: 50, maxHeight: 150 }}
      />
    </ThemedView>
  );
}

// --- DraggableNumber component and styles remain unchanged ---
const DraggableNumber = ({ number, onDrop }: { number: number; onDrop: (x: number, y: number) => void }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gradientColors = isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"];

  const textColor = isDarkMode ? "#ffffff" : "#166534";

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
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, { marginRight: 10 }]}>
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
