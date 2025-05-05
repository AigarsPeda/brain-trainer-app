import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateMathTaskType } from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRef, useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
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
    }
  };

  return (
    <ThemedView>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View
          ref={leftZoneRef}
          onLayout={() => {
            leftZoneRef.current?.measure((x, y, width, height, pageX, pageY) => {
              setLeftZoneLayout({ x: pageX, y: pageY, width, height });
            });
          }}
          style={{ ...styles.button, borderColor: theme.border }}
        >
          <ThemedText type="defaultSemiBold" style={{ fontSize: 60 }}>
            {leftValue !== null ? leftValue : "?"}
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 60 }}>
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
          <ThemedText type="defaultSemiBold" style={{ fontSize: 60 }}>
            {rightValue !== null ? rightValue : "?"}
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={{ fontSize: 60 }}>
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
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      runOnJS(onDrop)(event.absoluteX, event.absoluteY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, { marginRight: 10 }]}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            padding: 12,
            borderRadius: 8,
            fontSize: 30,
            height: 80,
            width: 80,
            textAlign: "center",
            backgroundColor: "#ddd",
            justifyContent: "center",
            alignItems: "center",
            textAlignVertical: "center",
            lineHeight: 56,
          }}
        >
          {number}
        </ThemedText>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 3,
    paddingHorizontal: 32,
  },
});
