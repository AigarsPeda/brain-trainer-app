import { useEffect, useRef, type FC } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

const INITIAL_PROGRESS = 0.05;

interface ProgressbarProps {
  maxLevelStep: number;
  currentLevelStep: number;
  style?: StyleProp<ViewStyle>;
}

const Progressbar: FC<ProgressbarProps> = ({ maxLevelStep, currentLevelStep, style }) => {
  const progress = useRef(new Animated.Value(INITIAL_PROGRESS)).current;

  useEffect(() => {
    if (maxLevelStep === 0) {
      return;
    }

    const ratio = currentLevelStep / maxLevelStep;
    const targetValue = currentLevelStep === 0 ? INITIAL_PROGRESS : Math.max(ratio, INITIAL_PROGRESS);

    // Animate to the new width
    Animated.timing(progress, {
      duration: 500,
      toValue: targetValue,
      useNativeDriver: false,
    }).start();
  }, [currentLevelStep, maxLevelStep, progress]);

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.progress, { width: animatedWidth }]} />
    </View>
  );
};

export default Progressbar;

const styles = StyleSheet.create({
  container: {
    height: 10,
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  progress: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#88C4C1",
  },
});
