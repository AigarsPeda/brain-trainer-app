import React, { useState } from "react";
import { TouchableOpacity, Animated, StyleSheet, Dimensions, ViewStyle, TextStyle, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width - 32;

interface MainButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  textStyle?: TextStyle;
  onPress: () => void;
  children?: React.ReactNode;

  //   isAtLeastOneTaskAnswered?: boolean;
}

export function MainButton({
  onPress,
  disabled = false,
  style,
  textStyle,
  children,
  //   isAtLeastOneTaskAnswered = false,
}: MainButtonProps) {
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const gradientColors = (disabled ? ["#f3f4f9", "#e4e6f3"] : ["#fbe9f2", "#f6d5ec"]) as [string, string];

  const shadowColors = (disabled ? ["#c1c3cd", "#a3a4b1"] : ["#e4b8c8", "#c28ba3"]) as [string, string];

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {/* Shadow layer */}
      <View style={[styles.shadowLayer, { backgroundColor: shadowColors[1] }]} />

      {/* Actual button */}
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
  );
}

const styles = StyleSheet.create({
  shadowLayer: {
    position: "absolute",
    top: 6,
    left: 0,
    height: 60,
    width: BUTTON_WIDTH,
    borderRadius: 20,
    zIndex: -1,
  },
  buttonWrapper: {
    borderRadius: 20,
  },
  button: {
    height: 60,
    width: BUTTON_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d3cce3",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    color: "#6a4acb",
  },
});
