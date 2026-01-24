import { useCallback, useMemo, useRef } from "react";
import { FlatList, FlatListProps, ListRenderItemInfo, Platform, ViewToken } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";

// Fixed item height for getItemLayout optimization
const ITEM_HEIGHT = 190; // 170 height + 20 marginTop from ListItem styles

interface AnimatedFlatListProps<T> extends Omit<FlatListProps<T>, "renderItem" | "onViewableItemsChanged"> {
  renderItem: (props: { item: T; index: number; viewableItems: SharedValue<ViewToken[]> }) => React.ReactElement | null;
  onViewableItemsChanged?: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void;
  paddingTop?: number;
  paddingBottom?: number;
  itemHeight?: number;
}

function AnimatedFlatList<T extends { levelNumber?: number }>(props: AnimatedFlatListProps<T>) {
  const {
    data,
    renderItem,
    paddingTop = 0,
    paddingBottom = 0,
    contentContainerStyle,
    onViewableItemsChanged,
    itemHeight = ITEM_HEIGHT,
    ...rest
  } = props;

  const viewableItems = useSharedValue<ViewToken[]>([]);

  // Memoize viewability config to prevent re-renders
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const handleViewableItemsChanged = useCallback(
    ({ changed, viewableItems: vItems }: { changed: ViewToken[]; viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
      onViewableItemsChanged?.({ viewableItems: vItems, changed });
    },
    [onViewableItemsChanged, viewableItems]
  );

  // Stable reference for viewability callback
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfig,
      onViewableItemsChanged: handleViewableItemsChanged,
    },
  ]);

  const renderAnimatedItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>): React.ReactElement | null => {
      return renderItem({ item, index, viewableItems });
    },
    [renderItem, viewableItems]
  );

  // Optimize scroll performance with known item layout
  const getItemLayout = useCallback(
    (_data: ArrayLike<T> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index + paddingTop,
      index,
    }),
    [itemHeight, paddingTop]
  );

  // Stable key extractor
  const keyExtractor = useCallback((item: T, index: number) => {
    return item.levelNumber?.toString() ?? index.toString();
  }, []);

  const containerStyle = useMemo(
    () => [{ paddingTop, paddingBottom }, contentContainerStyle],
    [paddingTop, paddingBottom, contentContainerStyle]
  );

  return (
    <FlatList
      data={data}
      renderItem={renderAnimatedItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={containerStyle}
      // Performance optimizations
      initialNumToRender={6}
      maxToRenderPerBatch={5}
      windowSize={7}
      removeClippedSubviews={Platform.OS === "android"}
      updateCellsBatchingPeriod={50}
      // Use stable viewability config to prevent warnings
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      // Improve scroll performance
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
}

export default AnimatedFlatList;
