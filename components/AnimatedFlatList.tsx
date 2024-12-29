import { FlatList, FlatListProps, ListRenderItemInfo, ViewToken } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface AnimatedFlatListProps<T> extends Omit<FlatListProps<T>, "renderItem" | "onViewableItemsChanged"> {
  renderItem: (props: { item: T; index: number; viewableItems: SharedValue<ViewToken[]> }) => React.ReactElement | null;
  onViewableItemsChanged?: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void;
  paddingTop?: number;
  paddingBottom?: number;
}

function AnimatedFlatList<T>(props: AnimatedFlatListProps<T>) {
  const { data, renderItem, paddingTop, paddingBottom, contentContainerStyle, onViewableItemsChanged, ...rest } = props;

  const viewableItems = useSharedValue<ViewToken[]>([]);

  const handleViewableItemsChanged = ({
    changed,
    viewableItems: vItems,
  }: {
    changed: ViewToken[];
    viewableItems: ViewToken[];
  }) => {
    viewableItems.value = vItems;
    if (onViewableItemsChanged) {
      onViewableItemsChanged({ viewableItems: vItems, changed });
    }
  };

  const renderAnimatedItem = ({ item, index }: ListRenderItemInfo<T>): React.ReactElement | null => {
    return renderItem({ item, index, viewableItems });
  };

  return (
    <FlatList
      data={data}
      renderItem={renderAnimatedItem}
      onViewableItemsChanged={handleViewableItemsChanged}
      contentContainerStyle={[
        { paddingTop: paddingTop ?? 0, paddingBottom: paddingBottom ?? 0 },
        contentContainerStyle,
      ]}
      {...rest}
    />
  );
}

export default AnimatedFlatList;
