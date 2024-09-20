import AnimatedFlatList from "@/components/AnimatedFlatList";
import ListItem from "@/components/ListItem";
import { AVAILABLE_LEVEL_COUNT } from "@/data/math";
import { StyleSheet, ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";

interface DataItem {
  id: number;
}

const data: DataItem[] = Array.from(
  { length: AVAILABLE_LEVEL_COUNT },
  (_, index) => ({
    id: index,
  })
);

export default function HomeScreen() {
  return <AnimatedFlatList data={data} renderItem={renderItem} />;
}

const renderItem = ({
  item,
  index,
  viewableItems,
}: {
  item: DataItem;
  index: number;
  viewableItems: SharedValue<ViewToken[]>;
}) => {
  return <ListItem item={item} viewableItems={viewableItems} />;
};
