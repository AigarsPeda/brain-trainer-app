import { ThemedText } from "@/components/ThemedText";
import { interpolateColor } from "@/utils/utils";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from "react-native";

// const { width } = Dimensions.get("window");
// const BUTTON_WIDTH = width - 32;

interface MathTaskButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  gradientColor: {
    background: readonly string[] | string[];
    shadow: readonly string[] | string[];
  };
}

export function MathTaskButton({
  onPress,
  style,
  children,
  textStyle,
  gradientColor,
  disabled = false,
}: MathTaskButtonProps) {
  const { width } = useWindowDimensions();
  const [translateY] = useState(new Animated.Value(0));
  const [animProgress, setAnimProgress] = useState(0);
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Store previous colors for interpolation
  const prevColorsRef = useRef(gradientColor);
  const targetColorsRef = useRef(gradientColor);

  useEffect(() => {
    // Store previous colors before updating target
    prevColorsRef.current = targetColorsRef.current;
    targetColorsRef.current = gradientColor;

    // Reset animation and animate to new colors
    colorAnim.setValue(0);
    const animation = Animated.timing(colorAnim, {
      toValue: 1,
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
  }, [
    gradientColor.background[0],
    gradientColor.background[1],
    gradientColor.shadow[0],
    gradientColor.shadow[1],
    colorAnim,
  ]);

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

  const buttonWidth = width / 2 - 26; // Adjusted button width to fit within the screen

  // Interpolate colors based on animation progress
  const animatedGradientColors: [string, string] = [
    interpolateColor(prevColorsRef.current.background[0], targetColorsRef.current.background[0], animProgress),
    interpolateColor(prevColorsRef.current.background[1], targetColorsRef.current.background[1], animProgress),
  ];
  const animatedShadowColor = interpolateColor(
    prevColorsRef.current.shadow[1],
    targetColorsRef.current.shadow[1],
    animProgress
  );

  return (
    <View style={{ ...styles.container, width: buttonWidth }}>
      {/* Shadow stays still underneath */}
      <View
        style={[
          styles.shadowLayer,
          {
            backgroundColor: animatedShadowColor,
            width: buttonWidth,
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
            end={{ x: 0.5, y: 1 }}
            start={{ x: 0.5, y: 0 }}
            colors={animatedGradientColors}
            style={[styles.button, { width: buttonWidth - 5 }, disabled && { opacity: 1 }]}
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
    // height: 70, // slightly taller than button to allow for shadow offset
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
  shadowLayer: {
    position: "absolute",
    top: 6,
    left: 0,
    height: 100,
    borderRadius: 12,
    zIndex: 0,
  },
  buttonWrapper: {
    borderRadius: 12,
    zIndex: 1, // ensure it's above the shadow
  },
  button: {
    height: 100,
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
