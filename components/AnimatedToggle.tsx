import { ThemedText } from "@/components/ThemedText";
import { ToggleColors } from "@/constants/Colors";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface ToggleItem {
  key: string;
  label: string;
}

interface AnimatedToggleProps {
  style?: ViewStyle;
  items: ToggleItem[];
  selectedKey: string;
  animationDuration?: number;
  onSelect: (key: string) => void;
}

export function AnimatedToggle({ items, selectedKey, onSelect, style, animationDuration = 250 }: AnimatedToggleProps) {
  const colorScheme = useAppColorScheme();
  const colors = ToggleColors[colorScheme ?? "light"];
  const [containerWidth, setContainerWidth] = useState(0);

  // Find current index based on selected key
  const selectedIndex = items.findIndex((item) => item.key === selectedKey);
  const initialIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const slidePosition = useSharedValue(initialIndex);

  const TOGGLE_PADDING = 3;
  const itemCount = items.length;
  const indicatorWidth = itemCount > 0 ? (containerWidth - TOGGLE_PADDING * 2) / itemCount : 0;

  useEffect(() => {
    if (selectedIndex >= 0) {
      slidePosition.value = withTiming(selectedIndex, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [selectedIndex, animationDuration]);

  const handleSelect = (key: string, index: number) => {
    if (key === selectedKey) return;
    onSelect(key);
  };

  const sliderIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slidePosition.value * indicatorWidth }],
    width: indicatorWidth,
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: colors.containerBackground }, style]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[styles.sliderIndicator, { backgroundColor: colors.indicatorBackground }, sliderIndicatorStyle]}
      />
      {items.map((item, index) => {
        const isSelected = item.key === selectedKey;
        return (
          <Pressable key={item.key} style={styles.toggleButton} onPress={() => handleSelect(item.key, index)}>
            <ThemedText style={[styles.toggleText, isSelected && { color: colors.activeText }]}>
              {item.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
    borderRadius: 16,
    position: "relative",
    flexDirection: "row",
  },
  sliderIndicator: {
    top: 3,
    left: 3,
    bottom: 3,
    borderRadius: 12,
    position: "absolute",
  },
  toggleButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
