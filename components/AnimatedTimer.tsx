import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

type AnimationDirection = "up" | "down" | "auto" | "countdown" | "countup";
const PLACEHOLDER_DIGIT = " ";

interface DigitRenderItem {
  char: string;
  key: string;
  animateOnMount?: boolean;
  mountPreviousDigit?: string;
  compareIndex: number;
}

interface AlignedCharactersResult {
  currentChars: string[];
  previousChars: string[];
  renderItems: DigitRenderItem[];
}

const isNumericString = (value: string) => /^\d+$/.test(value);

const getInsertedDigitPreviousValue = (direction: AnimationDirection, digit: string) => {
  if (direction === "countup" && digit !== PLACEHOLDER_DIGIT) {
    return "0";
  }

  return PLACEHOLDER_DIGIT;
};

const buildNumericRenderItems = (
  previousValue: string,
  currentValue: string,
  direction: AnimationDirection
): DigitRenderItem[] => {
  const slotCount = Math.max(previousValue.length, currentValue.length);
  const currentChars = currentValue.split("");
  const insertedSlots = Math.max(0, currentValue.length - previousValue.length);
  const leadingOffset = slotCount - currentValue.length;

  return currentChars.map((char, index) => ({
    char,
    key: `digit-place-${currentValue.length - index - 1}`,
    animateOnMount: index < insertedSlots && char !== PLACEHOLDER_DIGIT,
    mountPreviousDigit: index < insertedSlots ? getInsertedDigitPreviousValue(direction, char) : undefined,
    compareIndex: leadingOffset + index,
  }));
};

const getAlignedCharacters = (
  previousValue: string,
  currentValue: string,
  direction: AnimationDirection
): AlignedCharactersResult => {
  if (isNumericString(previousValue) && isNumericString(currentValue)) {
    const slotCount = Math.max(previousValue.length, currentValue.length);

    return {
      currentChars: currentValue.padStart(slotCount, PLACEHOLDER_DIGIT).split(""),
      previousChars: previousValue.padStart(slotCount, PLACEHOLDER_DIGIT).split(""),
      renderItems: buildNumericRenderItems(previousValue, currentValue, direction),
    };
  }

  return {
    currentChars: currentValue.split(""),
    previousChars: previousValue.split(""),
    renderItems: currentValue.split("").map((char, index) => ({
      char,
      key: char === ":" ? `colon-${index}` : `digit-${index}`,
      compareIndex: index,
    })),
  };
};

interface AnimatedDigitProps {
  digit: string;
  delay?: number;
  height?: number;
  style?: TextStyle;
  direction?: AnimationDirection;
  animateOnMount?: boolean;
  mountPreviousDigit?: string;
}

function AnimatedDigit({
  digit,
  style,
  height = 36,
  direction = "countdown",
  delay = 0,
  animateOnMount = false,
  mountPreviousDigit,
}: AnimatedDigitProps) {
  const { text: themeTextColor } = useThemeColor();
  const isAnimating = useRef(false);
  const previousDigitRef = useRef<string>(digit);
  const hasMountedRef = useRef(false);
  const slideAnim = useRef(new Animated.Value(1)).current;
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState<string | null>(null);
  const [animDirection, setAnimDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    const shouldAnimateMount = !hasMountedRef.current && animateOnMount && digit !== PLACEHOLDER_DIGIT;

    if (previousDigitRef.current !== digit || shouldAnimateMount) {
      const fromDigit = shouldAnimateMount ? (mountPreviousDigit ?? PLACEHOLDER_DIGIT) : previousDigitRef.current;
      const newNum = parseInt(digit, 10);
      const prevNum = parseInt(fromDigit, 10);

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

      if (isAnimating.current) {
        slideAnim.stopAnimation();
      }

      setAnimDirection(resolvedDirection);
      setPreviousDigit(fromDigit);
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
    hasMountedRef.current = true;
  }, [animateOnMount, delay, digit, direction, mountPreviousDigit, slideAnim]);

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

  const renderDigit = (value: string) => (value === PLACEHOLDER_DIGIT ? "" : value);

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
          {renderDigit(previousDigit)}
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
        {renderDigit(displayDigit)}
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
  const previousTimeRef = useRef(time);
  const { currentChars, previousChars, renderItems } = getAlignedCharacters(previousTimeRef.current, time, direction);
  const isNumericTransition = isNumericString(previousTimeRef.current) && isNumericString(time);

  const changedDigitIndices = renderItems.reduce<number[]>((acc, item, index) => {
    const { char, compareIndex } = item;
    if (char === ":") return acc;
    const previousChar = previousChars[compareIndex];
    if (previousChar !== char) acc.push(index);
    return acc;
  }, []);

  const hasSimultaneousChange = changedDigitIndices.length > 1;
  const cascadeOrder = hasSimultaneousChange ? [...changedDigitIndices].sort((a, b) => b - a) : changedDigitIndices;
  const baseDelayMs = 70;

  useEffect(() => {
    previousTimeRef.current = time;
  }, [time]);

  const getDelayForIndex = (index: number) => {
    if (isNumericTransition) return 0;
    if (!hasSimultaneousChange) return 0;
    const order = cascadeOrder.indexOf(index);
    if (order === -1) return 0;
    return order * baseDelayMs;
  };

  return (
    <View style={[styles.timerContainer, containerStyle]}>
      {renderItems.map(({ char, key, animateOnMount, mountPreviousDigit }, index) =>
        char === ":" ? (
          <ThemedText key={key} style={[style, separatorStyle]}>
            :
          </ThemedText>
        ) : (
          <AnimatedDigit
            key={key}
            digit={char}
            style={style}
            height={digitHeight}
            direction={direction}
            delay={getDelayForIndex(index)}
            animateOnMount={animateOnMount}
            mountPreviousDigit={mountPreviousDigit}
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
