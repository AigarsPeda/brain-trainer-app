import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { FC, useEffect } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import { Colors } from "@/constants/Colors";

interface ScrollToTaskButtonProps {
  visible: boolean;
  onPress: () => void;
  direction: "up" | "down";
}

export const ScrollToTaskButton: FC<ScrollToTaskButtonProps> = ({ onPress, visible, direction }) => {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backgroundColor = Colors[colorScheme ?? "light"].tint;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={visible ? "auto" : "none"}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.button, { backgroundColor }]}>
        <Ionicons name={direction === "up" ? "arrow-up" : "arrow-down"} size={28} color="#fff" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
