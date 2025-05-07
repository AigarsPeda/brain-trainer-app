import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateMathTaskType } from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View, useColorScheme } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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

  const handleDropOnLeft = (x: number, y: number, number: number) => {
    if (!leftZoneLayout) {
      return;
    }

    const withinX = x >= leftZoneLayout.x && x <= leftZoneLayout.x + leftZoneLayout.width;
    const withinY = y >= leftZoneLayout.y && y <= leftZoneLayout.y + leftZoneLayout.height;

    if (withinX && withinY) {
      setLeftValue(number);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleDropOnRight = (x: number, y: number, number: number) => {
    if (!rightZoneLayout) {
      return;
    }

    const withinX = x >= rightZoneLayout.x && x <= rightZoneLayout.x + rightZoneLayout.width;
    const withinY = y >= rightZoneLayout.y && y <= rightZoneLayout.y + rightZoneLayout.height;

    if (withinX && withinY) {
      setRightValue(number);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        <ThemedText
          type="subtitle"
          style={{
            color: "#D81E5B",
          }}
        >
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
        itemLayoutAnimation={LinearTransition}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const num = Number(item.number);
          const isDropped = num === leftValue || num === rightValue;

          if (isDropped) {
            return null;
          }

          return (
            <DraggableNumber
              number={num}
              onDrop={(x, y) => {
                handleDropOnLeft(x, y, num);
                handleDropOnRight(x, y, num);
              }}
            />
          );
        }}
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

  // Define gradient colors based on theme
  const gradientColors = isDarkMode
    ? ["#22c55e", "#16a34a"] // Dark mode green gradient
    : ["#bbf7d0", "#86efac"]; // Light mode green gradient

  const textColor = isDarkMode ? "#ffffff" : "#166534"; // White text for dark mode, dark green for light mode

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
      runOnJS(onDrop)(event.absoluteX, event.absoluteY);
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
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: 32,
              color: textColor,
              textAlign: "center",
            }}
          >
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
