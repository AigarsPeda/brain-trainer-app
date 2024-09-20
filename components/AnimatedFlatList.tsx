import {
  View,
  FlatList,
  StyleSheet,
  FlatListProps,
  ViewToken,
  ListRenderItemInfo,
} from "react-native";
import { useSharedValue, SharedValue } from "react-native-reanimated";

interface AnimatedFlatListProps<T>
  extends Omit<FlatListProps<T>, "renderItem" | "onViewableItemsChanged"> {
  renderItem: (props: {
    item: T;
    index: number;
    viewableItems: SharedValue<ViewToken[]>;
  }) => React.ReactElement | null;
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => void;
}

function AnimatedFlatList<T>(props: AnimatedFlatListProps<T>) {
  const {
    data,
    renderItem,
    contentContainerStyle,
    onViewableItemsChanged,
    ...rest
  } = props;

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

  const renderAnimatedItem = ({
    item,
    index,
  }: ListRenderItemInfo<T>): React.ReactElement | null => {
    return renderItem({ item, index, viewableItems });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderAnimatedItem}
        onViewableItemsChanged={handleViewableItemsChanged}
        contentContainerStyle={[{ paddingTop: 40 }, contentContainerStyle]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default AnimatedFlatList;
