import * as Haptics from "expo-haptics";
import { ReactNode, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

export const ScaleButton = ({
  style,
  onPress,
  children,
  disabled,
}: {
  style?: any;
  disabled?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateScale = (value: number) => {
    Animated.spring(scaleAnim, {
      toValue: value,
      useNativeDriver: true,
      speed: 100,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        style,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={styles.button}
        onPressOut={() => {
          animateScale(1);
        }}
        onPressIn={() => {
          animateScale(0.95);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
