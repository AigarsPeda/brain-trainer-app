import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { AVAILABLE_LEVEL_COUNT } from "@/data/math";
import createArray from "@/util/createArray";
import { Link } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet } from "react-native";

import { useRef } from "react";
import ParallaxScrollFlatView from "../../components/ParallaxScrollFlatView";

export default function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);
  const array = createArray(AVAILABLE_LEVEL_COUNT);
  return (
    <>
      {/* <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        {array.map((_, index) => (
          <Link key={index} href="/adScreen" asChild>
            <Pressable>
              <ThemedText type="link">Go to AdScreen</ThemedText>
            </Pressable>
          </Link>
        ))}
      </ParallaxScrollView> */}
      <ParallaxScrollFlatView
        data={array}
        renderItem={({ item }) => (
          <Link href="/adScreen" asChild>
            <Pressable>
              <ThemedText type="link">Go to AdScreen</ThemedText>
            </Pressable>
          </Link>
        )}
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
