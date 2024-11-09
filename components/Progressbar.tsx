import { LEVEL_SETTINGS } from "@/hardcoded";
import { useEffect, useRef, type FC } from "react";
import { Animated, View } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const WIDTH = width - 25;
const INITIAL_PROGRESSBAR_WIDTH = WIDTH * 0.05; // 5% of total width

interface ProgressbarProps {
  currentLevelStep: number;
}

const Progressbar: FC<ProgressbarProps> = ({ currentLevelStep }) => {
  //   const { colors } = useColors();
  const progressBarWidth = useRef(
    new Animated.Value(INITIAL_PROGRESSBAR_WIDTH)
  ).current;

  useEffect(() => {
    if (currentLevelStep === 0) {
      return;
    }

    const newWidth = (WIDTH / LEVEL_SETTINGS.levelParts) * currentLevelStep;

    // Animate to the new width
    Animated.timing(progressBarWidth, {
      duration: 500,
      toValue: newWidth,
      useNativeDriver: false,
    }).start();
  }, [currentLevelStep]);

  return (
    <View
      style={{
        width: WIDTH,
        overflow: "hidden",
        height: 8,
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
      }}
    >
      <Animated.View
        style={{
          width: progressBarWidth,
          backgroundColor: "green",
          height: 8,
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default Progressbar;
