import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

type AnimationDirection = "up" | "down" | "auto" | "countdown" | "countup";

interface AnimatedDigitProps {
  digit: string;
  delay?: number;
  height?: number;
  style?: TextStyle;
  direction?: AnimationDirection;
}

function AnimatedDigit({ digit, style, height = 36, direction = "countdown", delay = 0 }: AnimatedDigitProps) {
  const { text: themeTextColor } = useThemeColor();
  const isAnimating = useRef(false);
  const previousDigitRef = useRef<string>(digit);
  const slideAnim = useRef(new Animated.Value(1)).current;
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState<string | null>(null);
  const [animDirection, setAnimDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (previousDigitRef.current !== digit) {
      const newNum = parseInt(digit, 10);
      const prevNum = parseInt(previousDigitRef.current, 10);

      // Determine animation direction
      const resolvedDirection: "up" | "down" = (() => {
        if (direction === "countdown") return "up";
        if (direction === "countup") return "down";
        if (direction === "auto") {
          if (!isNaN(prevNum) && !isNaN(newNum)) {
            return newNum < prevNum ? "up" : "down";
          }
          return "up";
        }
        return direction;
      })();

      // Stop any ongoing animation
      if (isAnimating.current) {
        slideAnim.stopAnimation();
      }

      setAnimDirection(resolvedDirection);
      setPreviousDigit(previousDigitRef.current);
      setDisplayDigit(digit);
      previousDigitRef.current = digit;
      slideAnim.setValue(0);
      isAnimating.current = true;

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
        delay,
      }).start(({ finished }) => {
        isAnimating.current = false;
        if (finished) {
          setPreviousDigit(null);
        }
      });
    }
  }, [digit, slideAnim, direction]);

  // Direction determines where old digit goes and where new digit comes from
  // "up": old slides up (negative Y), new comes from bottom (positive Y)
  // "down": old slides down (positive Y), new comes from top (negative Y)
  const oldExitY = animDirection === "up" ? -height : height;
  const newEnterY = animDirection === "up" ? height : -height;

  const oldTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, oldExitY],
  });

  const newTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [newEnterY, 0],
  });

  const oldOpacity = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const newOpacity = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View style={[styles.digitContainer, { height }]}>
      {previousDigit !== null && (
        <Animated.Text
          style={[
            { color: themeTextColor },
            style,
            styles.digitAbsolute,
            {
              transform: [{ translateY: oldTranslateY }],
              opacity: oldOpacity,
            },
          ]}
        >
          {previousDigit}
        </Animated.Text>
      )}
      <Animated.Text
        style={[
          { color: themeTextColor },
          style,
          previousDigit !== null && styles.digitAbsolute,
          previousDigit !== null && {
            transform: [{ translateY: newTranslateY }],
            opacity: newOpacity,
          },
        ]}
      >
        {displayDigit}
      </Animated.Text>
    </View>
  );
}

interface AnimatedTimerProps {
  time: string;
  style?: TextStyle;
  separatorStyle?: TextStyle;
  containerStyle?: ViewStyle;
  digitHeight?: number;
  /**
   * Animation direction:
   * - "countdown": all digits slide up consistently (recommended for countdown timers)
   * - "countup": all digits slide down consistently (for counting up)
   * - "up": old digit slides up, new comes from bottom
   * - "down": old digit slides down, new comes from top
   * - "auto": each digit animates based on its individual change
   */
  direction?: AnimationDirection;
}

export function AnimatedTimer({
  time,
  style,
  separatorStyle,
  containerStyle,
  digitHeight = 36,
  direction = "countdown",
}: AnimatedTimerProps) {
  const digits = time.split("");
  const previousDigitsRef = useRef<string[]>(digits);

  const changedDigitIndices = digits.reduce<number[]>((acc, char, index) => {
    if (char === ":") return acc;
    const previousChar = previousDigitsRef.current[index];
    if (previousChar !== char) acc.push(index);
    return acc;
  }, []);

  const hasSimultaneousChange = changedDigitIndices.length > 1;
  const cascadeOrder = hasSimultaneousChange ? [...changedDigitIndices].sort((a, b) => b - a) : changedDigitIndices;
  const baseDelayMs = 70;

  useEffect(() => {
    previousDigitsRef.current = digits;
  }, [digits]);

  const getDelayForIndex = (index: number) => {
    if (!hasSimultaneousChange) return 0;
    const order = cascadeOrder.indexOf(index);
    if (order === -1) return 0;
    return order * baseDelayMs;
  };

  return (
    <View style={[styles.timerContainer, containerStyle]}>
      {digits.map((char, index) =>
        char === ":" ? (
          <ThemedText key={`colon-${index}`} style={[style, separatorStyle]}>
            :
          </ThemedText>
        ) : (
          <AnimatedDigit
            key={`digit-${index}`}
            digit={char}
            style={style}
            height={digitHeight}
            direction={direction}
            delay={getDelayForIndex(index)}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  digitContainer: {
    width: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  digitAbsolute: {
    position: "absolute",
  },
});
