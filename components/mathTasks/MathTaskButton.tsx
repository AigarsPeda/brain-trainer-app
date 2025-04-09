import React, { useState } from "react";
import { TouchableOpacity, Animated, StyleSheet, ViewStyle, TextStyle, View, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

// const { width } = Dimensions.get("window");
// const BUTTON_WIDTH = width - 32;

interface MathTaskButtonProps {
  style?: ViewStyle;
  disabled?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  gradientColor: {
    background: string[];
    shadow: string[];
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

  //   const gradientColors = (disabled ? ["#f3f4f9", "#e4e6f3"] : ["#fbe9f2", "#f6d5ec"]) as [string, string];
  //   const shadowColors = (disabled ? ["#c1c3cd", "#a3a4b1"] : ["#e4b8c8", "#c28ba3"]) as [string, string];
  const buttonWidth = width / 2 - 26; // Adjusted button width to fit within the screen

  return (
    <View style={{ ...styles.container, width: buttonWidth }}>
      {/* Shadow stays still underneath */}
      <View
        style={[
          styles.shadowLayer,
          {
            backgroundColor: gradientColor.shadow[1],
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
            colors={gradientColor.background as [string, string]}
            style={[styles.button, { width: buttonWidth }, disabled && { opacity: 1 }]}
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
    borderRadius: 20,
    zIndex: 0,
  },
  buttonWrapper: {
    borderRadius: 20,
    zIndex: 1, // ensure it's above the shadow
  },
  button: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    color: "#6a4acb",
  },
});
