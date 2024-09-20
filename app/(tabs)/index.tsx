import AnimatedFlatList from "@/components/AnimatedFlatList";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AVAILABLE_LEVEL_COUNT } from "@/data/math";
import useAppContext from "@/hooks/useAppContext";
import { router } from "expo-router";
import { ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface DataItem {
  id: number;
}

const data: DataItem[] = Array.from(
  { length: AVAILABLE_LEVEL_COUNT },
  (_, index) => ({
    id: index + 1,
  })
);

export default function HomeScreen() {
  const { state } = useAppContext();

  return (
    <ThemedView>
      <SafeAreaView
        style={{
          paddingBottom: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title">{state.name}</ThemedText>
      </SafeAreaView>
      <AnimatedFlatList paddingTop={0} data={data} renderItem={renderItem} />
    </ThemedView>
  );
}

const renderItem = ({
  item,
  index,
  viewableItems,
}: {
  index: number;
  item: DataItem;
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
