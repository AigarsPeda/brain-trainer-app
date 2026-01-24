import { useCallback, useMemo } from "react";
import { ListRenderItemInfo, Platform, StyleProp, ViewStyle } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

// Fixed item height for getItemLayout optimization
const ITEM_HEIGHT = 190; // 170 height + 20 marginTop from ListItem styles

interface AnimatedFlatListProps<T> {
  data: T[] | null | undefined;
  renderItem: (props: {
    item: T;
    index: number;
    scrollY: SharedValue<number>;
  }) => React.ReactElement | null;
  paddingTop?: number;
  paddingBottom?: number;
  itemHeight?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

function AnimatedFlatList<T extends { levelNumber?: number }>(props: AnimatedFlatListProps<T>) {
  const {
    data,
    renderItem,
    paddingTop = 0,
    paddingBottom = 0,
    contentContainerStyle,
    itemHeight = ITEM_HEIGHT,
  } = props;

  const scrollY = useSharedValue(0);

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
      scrollEventThrottle={16}
      // Performance optimizations
      initialNumToRender={6}
      maxToRenderPerBatch={5}
      windowSize={7}
      removeClippedSubviews={Platform.OS === "android"}
      updateCellsBatchingPeriod={50}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default AnimatedFlatList;
