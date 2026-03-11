import { AnimatedTimer } from "@/components/AnimatedTimer";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

interface BossTimerBarProps {
  timeLabel: string;
  progress: number;
  onPress?: () => void;
}

export function BossTimerBar({ timeLabel, progress, onPress }: BossTimerBarProps) {
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, progress]);

  const animatedWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.shell}>
        <View style={styles.content}>
          <ThemedText style={styles.label}>Boss</ThemedText>
          <AnimatedTimer
            time={timeLabel}
            direction="countdown"
            style={styles.timerText}
            digitHeight={32}
            containerStyle={styles.timerWrap}
          />
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: animatedWidth }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 0,
  },
  shell: {
    height: 42,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  track: {
    height: 6,
    marginTop: 4,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "rgba(28, 25, 23, 0.45)",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F59E0B",
  },
  label: {
    color: "#FFF7D6",
    fontSize: 13,
    opacity: 0.85,
  },
  timerWrap: {
    minWidth: 58,
    justifyContent: "flex-end",
  },
  timerText: {
    color: "#FFF7D6",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
});
