import { useEffect, useRef } from "react";
import { cancelAnimation, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

type PulseOptions = {
  peakScale?: number;
  settleScale?: number;
  peakDuration?: number;
  initialScale?: number;
  settleDuration?: number;
};

export function usePulseOnChange<T>(value: T, options: PulseOptions = {}) {
  const { initialScale = 1, peakScale = 1.1, settleScale = 1.05, peakDuration = 160, settleDuration = 140 } = options;

  const scale = useSharedValue(initialScale);
  const previousValue = useRef(value);

  useEffect(() => {
    if (Object.is(previousValue.current, value)) {
      return;
    }

    previousValue.current = value;

    cancelAnimation(scale);
    scale.value = initialScale;

    scale.value = withSequence(
      withTiming(peakScale, { duration: peakDuration }),
      withTiming(initialScale, { duration: peakDuration }),
      withTiming(settleScale, { duration: settleDuration }),
      withTiming(initialScale, { duration: settleDuration })
    );
  }, [initialScale, peakDuration, peakScale, scale, settleDuration, settleScale, value]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
}
