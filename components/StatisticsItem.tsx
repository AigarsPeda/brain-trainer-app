import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

interface StatisticsItemProps {
  src: string;
  stat?: number;
  width?: number;
  size?: {
    width: number;
    height: number;
  };
  onPress?: () => void;
  animation?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StatisticsItem({ src, stat, size, width, onPress, animation }: StatisticsItemProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        {
          width,
          gap: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        animation,
      ]}
    >
      <ThemedView style={{ ...styles.container, ...size }}>
        <Image style={styles.image} source={src} contentFit="cover" transition={1000} />
      </ThemedView>
      {stat !== undefined && <ThemedText type="subtitle">{stat}</ThemedText>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
