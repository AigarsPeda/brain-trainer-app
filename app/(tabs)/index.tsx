import AnimatedFlatList from "@/components/AnimatedFlatList";
import ListItem from "@/components/ListItem";
import { AVAILABLE_LEVEL_COUNT } from "@/data/math";
import { ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { router } from "expo-router";

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
  return <AnimatedFlatList data={data} renderItem={renderItem} />;
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
