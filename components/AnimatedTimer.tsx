import { ThemedText } from "@/components/ThemedText";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

interface AnimatedDigitProps {
  digit: string;
  style?: TextStyle;
  height?: number;
}

function AnimatedDigit({ digit, style, height = 36 }: AnimatedDigitProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState<string | null>(null);

  useEffect(() => {
    if (currentDigit !== digit) {
      setPreviousDigit(currentDigit);
      setCurrentDigit(digit);
      slideAnim.setValue(0);

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setPreviousDigit(null);
      });
    }
  }, [digit, currentDigit, slideAnim]);

  const oldTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height],
  });

  const newTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
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
          style,
          previousDigit !== null && styles.digitAbsolute,
          previousDigit !== null && {
            transform: [{ translateY: newTranslateY }],
            opacity: newOpacity,
          },
        ]}
      >
        {currentDigit}
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
}

export function AnimatedTimer({ time, style, separatorStyle, containerStyle, digitHeight = 36 }: AnimatedTimerProps) {
  return (
    <View style={[styles.timerContainer, containerStyle]}>
      {time.split("").map((char, index) =>
        char === ":" ? (
          <ThemedText key={`colon-${index}`} style={[style, separatorStyle]}>
            :
          </ThemedText>
        ) : (
          <AnimatedDigit key={`digit-${index}`} digit={char} style={style} height={digitHeight} />
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
    overflow: "hidden",
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  digitAbsolute: {
    position: "absolute",
  },
});
