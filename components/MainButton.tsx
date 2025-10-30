import { ThemedText } from "@/components/ThemedText";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width - 32;

type MainButtonVariant = "primary" | "secondary";

interface MainButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  variant?: MainButtonVariant;
}

export function MainButton({
  style,
  onPress,
  children,
  textStyle,
  disabled = false,
  variant = "primary",
}: MainButtonProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [translateY] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 6, // slight downward movement
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const disabledBgColor = isDarkMode ? ["#6b7280", "#4b5563"] : ["#f3f4f9", "#e4e6f3"];
  const disabledShadowColor = isDarkMode ? ["#1e1e1e", "#374151"] : ["#e4e6f3", "#f3f4f6"];

  const primaryBgColor = isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"];
  const primaryShadowColor = isDarkMode ? ["#15803d", "#166534"] : ["#4ade80", "#22c55e"];

  const secondaryBgColor = isDarkMode ? ["#374151", "#1f2937"] : ["#f9fafb", "#e5e7eb"];
  const secondaryShadowColor = isDarkMode ? ["#111827", "#111827"] : ["#d1d5db", "#d1d5db"];

  const enabledBgColor = variant === "secondary" ? secondaryBgColor : primaryBgColor;
  const enabledShadowColor = variant === "secondary" ? secondaryShadowColor : primaryShadowColor;

  const gradientColors = (disabled ? disabledBgColor : enabledBgColor) as [string, string];
  const shadowColors = (disabled ? disabledShadowColor : enabledShadowColor) as [string, string];

  return (
    <View style={styles.container}>
      {/* Shadow stays still underneath */}
      <View
        style={[
          styles.shadowLayer,
          {
            backgroundColor: shadowColors[1],
          },
        ]}
      />

      {/* Button animates on press */}
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={disabled}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.buttonWrapper, style]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.button, disabled && { opacity: 1 }]}
          >
            {children || <ThemedText style={[styles.text, textStyle]}>Continue</ThemedText>}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: 70, // slightly taller than button to allow for shadow offset
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
  shadowLayer: {
    position: "absolute",
    top: 6,
    left: 0,
    height: 60,
    width: BUTTON_WIDTH,
    borderRadius: 12,
    zIndex: 0,
  },
  buttonWrapper: {
    borderRadius: 12,
    zIndex: 1, // ensure it's above the shadow
  },
  button: {
    height: 60,
    width: BUTTON_WIDTH - 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    color: "#6a4acb",
  },
});
