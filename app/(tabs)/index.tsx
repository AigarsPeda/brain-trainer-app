import AnimatedFlatList from "@/components/AnimatedFlatList";
import { HelloWave } from "@/components/HelloWave";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { TaskInfoType } from "@/data/common";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { router } from "expo-router";
import { Button, View, ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import HeartIcon from "../../components/icons/HeartIcon";

export default function HomeScreen() {
  const { state } = useAppContext();
  const { isRewarded, loaded, rewarded } = useGoogleAd();

  return (
    <ThemedView>
      <SafeAreaView
        style={{
          gap: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title">{state.name}</ThemedText>
        <HeartIcon stroke={"#ff0000"} />
        <HeartIcon stroke={"#ff0000"} />
        <HeartIcon stroke={"#ff0000"} />
      </SafeAreaView>
      <ThemedView
        style={{
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="subtitle">
          Is Ad loaded: {loaded ? "Yes" : "No"}
        </ThemedText>
        <Button title="Show ad" onPress={() => rewarded.show()} />
      </ThemedView>
      <AnimatedFlatList
        paddingTop={0}
        paddingBottom={150}
        data={state.taskInfos}
        renderItem={({ item, index, viewableItems }) =>
          renderItem({ item, index, viewableItems })
        }
      />
    </ThemedView>
  );
}

const renderItem = ({
  item,
  index,
  viewableItems,
}: {
  index: number;
  item: TaskInfoType;
  viewableItems: SharedValue<ViewToken[]>;
}) => {
  // move position from 0 to 3 and then back from 3 to 0 and do it again and again
  const number = index % 6 <= 3 ? index % 6 : 6 - (index % 6);

  return (
    <ListItem
      item={item}
      position={number}
      viewableItems={viewableItems}
      handleClick={() => {
        router.push("/adScreen");
      }}
    />
  );
};
