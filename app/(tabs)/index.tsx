import AnimatedFlatList from "@/components/AnimatedFlatList";
import { HelloWave } from "@/components/HelloWave";
import LastListItem from "@/components/LastListItem";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { TaskInfoType } from "@/data/common";
import useAppContext from "@/hooks/useAppContext";
import { router } from "expo-router";
import { Button, ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useGoogleAd from "../../hooks/useGoogleAd";

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();

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
        <HelloWave />
      </SafeAreaView>
      <ThemedText type="subtitle">
        Is Ad loaded: {loaded ? "Yes" : "No"}
      </ThemedText>
      <Button title="Show ad" onPress={() => rewarded.show()} />
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
  return (
    <ListItem
      item={item}
      viewableItems={viewableItems}
      handleClick={() => {
        router.push("/adScreen");
      }}
    />
  );
};
