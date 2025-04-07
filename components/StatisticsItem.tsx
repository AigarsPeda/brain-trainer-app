import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

interface StatisticsItemProps {
  src: string;
  stat?: number;
  width?: number;
  size?: {
    width: number;
    height: number;
  };
  onPress?: () => void;
}

export function StatisticsItem({ src, stat, size, width, onPress }: StatisticsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width,
        gap: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedView style={{ ...styles.container, ...size }}>
        <Image style={styles.image} source={src} contentFit="cover" transition={1000} />
      </ThemedView>
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
