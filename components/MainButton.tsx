import { ThemedText } from "@/components/ThemedText";
import { ButtonColors } from "@/constants/Colors";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { interpolateColor } from "@/utils/utils";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

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
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = isDarkMode ? "dark" : "light";
  const [translateY] = useState(new Animated.Value(0));
  const [animProgress, setAnimProgress] = useState(disabled ? 1 : 0);
  const colorAnim = useRef(new Animated.Value(disabled ? 1 : 0)).current;

  // Get colors from centralized ButtonColors
  const variantColors = ButtonColors[variant][theme];
  const disabledColors = ButtonColors.disabled[theme];

  useEffect(() => {
    const animation = Animated.timing(colorAnim, {
      toValue: disabled ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    });

    animation.start();

    // Update animProgress during animation
    const listener = colorAnim.addListener(({ value }) => {
      setAnimProgress(value);
    });

    return () => {
      colorAnim.removeListener(listener);
    };
  }, [disabled, colorAnim]);

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

  // Interpolate colors based on animation progress
  const gradientColors: [string, string] = [
    interpolateColor(variantColors.background[0], disabledColors.background[0], animProgress),
    interpolateColor(variantColors.background[1], disabledColors.background[1], animProgress),
  ];
  const shadowColors: [string, string] = [
    interpolateColor(variantColors.shadow[0], disabledColors.shadow[0], animProgress),
    interpolateColor(variantColors.shadow[1], disabledColors.shadow[1], animProgress),
  ];
  const textColor = disabled ? disabledColors.text : variantColors.text;

  return (
    <View style={[styles.container, style]}>
      {/* Shadow stays still underneath */}
      <View
        style={[
          styles.shadowLayer,
          {
            backgroundColor: shadowColors[1],
          },
          style?.width ? { width: style.width } : null,
        ]}
      />

      {/* Button animates on press */}
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          disabled={disabled}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            end={{ x: 0.5, y: 1 }}
            colors={gradientColors}
            start={{ x: 0.5, y: 0 }}
            style={[
              styles.button,
              disabled && { opacity: 1 },
              style?.width ? { width: (style.width as number) - 5 } : null,
            ]}
          >
            {children || <ThemedText style={[styles.text, { color: textColor }, textStyle]}>Continue</ThemedText>}
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
  },
});
