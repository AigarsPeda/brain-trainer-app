import { useEffect, useRef, type FC } from "react";
import { Animated, View } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const WIDTH = width - 125;
const INITIAL_PROGRESSBAR_WIDTH = WIDTH * 0.05; // 5% of total width

interface ProgressbarProps {
  maxLevelStep: number;
  currentLevelStep: number;
}

const Progressbar: FC<ProgressbarProps> = ({ maxLevelStep, currentLevelStep }) => {
  //   const { colors } = useColors();
  const progressBarWidth = useRef(new Animated.Value(INITIAL_PROGRESSBAR_WIDTH)).current;

  useEffect(() => {
    if (currentLevelStep === 0) {
      return;
    }

    const newWidth = (WIDTH / maxLevelStep) * currentLevelStep;

    // Animate to the new width
    Animated.timing(progressBarWidth, {
      duration: 500,
      toValue: newWidth,
      useNativeDriver: false,
    }).start();
  }, [currentLevelStep, maxLevelStep, progressBarWidth]);

  return (
    <View
      style={{
        height: 10,
        width: WIDTH,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Animated.View
        style={{
          height: 10,
          borderRadius: 8,
          width: progressBarWidth,
          backgroundColor: "#88C4C1",
        }}
      />
    </View>
  );
};

export default Progressbar;
