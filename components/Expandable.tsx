import { ReactNode, useEffect } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

interface ExpandableProps {
  header: ReactNode;
  children: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  showChevron?: boolean;
  chevronColor?: string;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const AnimatedChevron = ({ color, isExpanded }: { color: string; isExpanded: boolean }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isExpanded ? 180 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isExpanded, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
      </Svg>
    </Animated.View>
  );
};

export function Expandable({
  header,
  children,
  isExpanded = false,
  onToggle,
  showChevron = true,
  chevronColor = "#000",
  headerStyle,
  contentStyle,
}: ExpandableProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isExpanded ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isExpanded, opacity]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Pressable style={[styles.header, headerStyle]} onPress={onToggle}>
        <View style={styles.headerContent}>{header}</View>
        {showChevron && <AnimatedChevron color={chevronColor} isExpanded={isExpanded} />}
      </Pressable>

      {isExpanded && (
        <Animated.View style={[styles.content, contentStyle, animatedContentStyle]}>{children}</Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
