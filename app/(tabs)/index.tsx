import AnimatedFlatList from "@/components/AnimatedFlatList";
import { HelloWave } from "@/components/HelloWave";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TaskInfoType } from "@/data/common";
import useAppContext from "@/hooks/useAppContext";
import { router } from "expo-router";
import { ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { state } = useAppContext();

  return (
    <ThemedView>
      <SafeAreaView
        style={{
          gap: 8,
          paddingBottom: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title">{state.name}</ThemedText>
        <HelloWave />
      </SafeAreaView>
      <AnimatedFlatList
        paddingTop={0}
        data={state.taskInfos}
        renderItem={renderItem}
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
