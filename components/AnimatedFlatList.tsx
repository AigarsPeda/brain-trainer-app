import { useCallback, useMemo } from "react";
import { Dimensions, ListRenderItemInfo, Platform, StyleProp, ViewStyle } from "react-native";
import Animated, { SharedValue, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

// Fixed item height for getItemLayout optimization
const ITEM_HEIGHT = 190; // 170 height + 20 marginTop from ListItem styles

interface AnimatedFlatListProps<T> {
  itemHeight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  initialScrollIndex?: number;
  data: T[] | null | undefined;
  contentContainerStyle?: StyleProp<ViewStyle>;
  renderItem: (props: { item: T; index: number; scrollY: SharedValue<number> }) => React.ReactElement | null;
}

function AnimatedFlatList<T extends { levelNumber?: number }>(props: AnimatedFlatListProps<T>) {
  const {
    data,
    renderItem,
    paddingTop = 0,
    paddingBottom = 0,
    initialScrollIndex,
    contentContainerStyle,
    itemHeight = ITEM_HEIGHT,
  } = props;

  const initialContentOffset = useMemo(() => {
    if (initialScrollIndex === undefined || initialScrollIndex <= 0) return undefined;
    const screenHeight = Dimensions.get("window").height;
    const y = Math.max(0, itemHeight * initialScrollIndex + paddingTop - screenHeight / 3 + itemHeight / 2);
    return { x: 0, y };
  }, [initialScrollIndex, itemHeight, paddingTop]);

  const scrollY = useSharedValue(initialContentOffset?.y ?? 0);

  // Scroll handler runs entirely on UI thread
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderAnimatedItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>): React.ReactElement | null => {
      return renderItem({ item, index, scrollY });
    },
    [renderItem, scrollY]
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
    <Animated.FlatList
      data={data}
      renderItem={renderAnimatedItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={containerStyle}
      onScroll={scrollHandler}
      scrollEventThrottle={1}
      // Performance optimizations
      initialNumToRender={6}
      maxToRenderPerBatch={5}
      windowSize={7}
      removeClippedSubviews={Platform.OS === "android"}
      updateCellsBatchingPeriod={50}
      showsVerticalScrollIndicator={false}
      {...(initialContentOffset && { contentOffset: initialContentOffset })}
    />
  );
}

export default AnimatedFlatList;
