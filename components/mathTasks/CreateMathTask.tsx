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
  const leftValueRef = useRef<number | null>(null);
  const rightValueRef = useRef<number | null>(null);
  const [leftZoneLayout, setLeftZoneLayout] = useState<LayoutRectangle | null>(null);
  const [rightZoneLayout, setRightZoneLayout] = useState<LayoutRectangle | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState(task.options.map((item) => Number(item.number)));

  const handleDrop = (x: number, y: number, number: number) => {
    const draggedItemBox: LayoutRectangle = {
      x: x - DRAGGABLE_NUMBER_SIZE / 2,
      y: y - DRAGGABLE_NUMBER_SIZE / 2,
      width: DRAGGABLE_NUMBER_SIZE,
      height: DRAGGABLE_NUMBER_SIZE,
    };

    let snapped = false;

    // Check if dropped on the left zone
    if (leftZoneLayout && doBoxesIntersect(draggedItemBox, leftZoneLayout)) {
      if (leftValueRef.current !== null) {
        // Return the old value to the list
        setAvailableNumbers((prev) => [...prev, leftValueRef.current!]);
      }
      leftValueRef.current = number;
      setAvailableNumbers((prev) => prev.filter((n) => n !== number));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      snapped = true;
    }

    // Check if dropped on the right zone
    if (rightZoneLayout && doBoxesIntersect(draggedItemBox, rightZoneLayout)) {
      if (rightValueRef.current !== null) {
        // Return the old value to the list
        setAvailableNumbers((prev) => [...prev, rightValueRef.current!]);
      }
      rightValueRef.current = number;
      setAvailableNumbers((prev) => prev.filter((n) => n !== number));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      snapped = true;
    }

    // If not snapped, return the number to the list
    if (!snapped) {
      setAvailableNumbers((prev) => [...prev, number]);
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
            {leftValueRef.current !== null ? leftValueRef.current : "?"}
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
            {rightValueRef.current !== null ? rightValueRef.current : "?"}
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 40 }}>
          = {task.result}
        </ThemedText>
      </View>

      <Animated.FlatList
        horizontal
        data={availableNumbers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <DraggableNumber number={item} onDrop={(x, y) => handleDrop(x, y, item)} />}
        style={{ overflow: "visible", paddingTop: 50, maxHeight: 150 }}
      />
    </ThemedView>
  );
}

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
