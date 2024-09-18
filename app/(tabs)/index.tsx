import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { AVAILABLE_LEVEL_COUNT, MATH_LEVEL_1_TASKS } from "@/data/math";
import createArray from "@/util/createArray";

import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);
  const array = createArray(AVAILABLE_LEVEL_COUNT);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <FlatList
          data={array}
          ref={flatListRef}
          contentContainerStyle={{
            gap: 8,
            padding: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                console.log("Refresh");
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <Link key={index} href="/adScreen" asChild>
                <Pressable>
                  <ThemedText type="link">Go to AdScreen</ThemedText>
                </Pressable>
              </Link>
            );
          }}
        />
      </ParallaxScrollView>
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
