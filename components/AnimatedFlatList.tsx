// import { FlatList, StyleSheet, View, ViewToken } from "react-native";
// import { useSharedValue } from "react-native-reanimated";
// import ListItem from "@/components/ListItem";
// import type { FC } from "react";

// const data = new Array(50).fill(0).map((_, index) => ({ id: index }));

// const AnimatedFlatList = () => {
//   const viewableItems = useSharedValue<ViewToken[]>([]);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         contentContainerStyle={{ paddingTop: 40 }}
//         onViewableItemsChanged={({ viewableItems: vItems }) => {
//           viewableItems.value = vItems;
//         }}
//         renderItem={({ item }) => {
//           return <ListItem item={item} viewableItems={viewableItems} />;
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });

// export default AnimatedFlatList;

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
    viewableItems: vItems,
    changed,
  }: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
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
        contentContainerStyle={[{ paddingTop: 40 }, contentContainerStyle]}
        onViewableItemsChanged={handleViewableItemsChanged}
        renderItem={renderAnimatedItem}
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
