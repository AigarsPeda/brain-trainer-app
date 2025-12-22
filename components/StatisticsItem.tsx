import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
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

export function StatisticsItem({ src, stat, size, width, onPress, animation }: StatisticsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{
        width,
        gap: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={animation}>
        <View style={{ ...styles.container, ...size }}>
          <Image style={styles.image} source={src} contentFit="cover" transition={1000} />
        </View>
      </Animated.View>
      {stat !== undefined && <ThemedText type="subtitle">{stat}</ThemedText>}
    </Pressable>
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
