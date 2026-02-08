import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Dimensions, FlatList, ListRenderItemInfo, StyleProp, ViewStyle, ViewToken } from "react-native";
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
  onViewableItemsChanged?: (viewableItems: ViewToken[]) => void;
  renderItem: (props: { item: T; index: number; scrollY: SharedValue<number> }) => React.ReactElement | null;
}

export interface AnimatedFlatListRef {
  scrollToIndex: (index: number) => void;
}

function AnimatedFlatListInner<T extends { levelNumber?: number }>(
  props: AnimatedFlatListProps<T>,
  ref: React.Ref<AnimatedFlatListRef>
) {
  const {
    data,
    renderItem,
    paddingTop = 0,
    paddingBottom = 0,
    initialScrollIndex,
    contentContainerStyle,
    itemHeight = ITEM_HEIGHT,
    onViewableItemsChanged,
  } = props;

  const flatListRef = useRef<FlatList<T>>(null);

  const initialContentOffset = useMemo(() => {
    if (initialScrollIndex === undefined || initialScrollIndex <= 0) return undefined;
    const screenHeight = Dimensions.get("window").height;
    // Center the item in viewport - item center at screen center
    const y = Math.max(0, itemHeight * initialScrollIndex + paddingTop - screenHeight / 2 + itemHeight / 2);
    return { x: 0, y };
  }, [initialScrollIndex, itemHeight, paddingTop]);

  const scrollY = useSharedValue(initialContentOffset?.y ?? 0);

  // Expose scrollToIndex method to parent
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      const screenHeight = Dimensions.get("window").height;
      // Center the item in viewport - same calculation as initial offset
      const offset = Math.max(0, itemHeight * index + paddingTop - screenHeight / 2 + itemHeight / 2);
      flatListRef.current?.scrollToOffset({ offset, animated: true });
    },
  }));

  // Scroll handler runs entirely on UI thread
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollY.value = event.contentOffset.y;
    },
  });

  // Handle viewable items changed
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (onViewableItemsChanged) {
        onViewableItemsChanged(viewableItems);
      }
    },
    [onViewableItemsChanged]
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 100, // Balanced sensitivity - item needs 35% visible to count
      waitForInteraction: false,
      minimumViewTime: 100,
    }),
    []
  );

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
      ref={flatListRef}
      data={data}
      renderItem={renderAnimatedItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={containerStyle}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      // Performance optimizations
      initialNumToRender={8}
      maxToRenderPerBatch={4}
      windowSize={5}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={100}
      showsVerticalScrollIndicator={false}
      {...(initialContentOffset && { contentOffset: initialContentOffset })}
    />
  );
}

const AnimatedFlatList = forwardRef(AnimatedFlatListInner) as <T extends { levelNumber?: number }>(
  props: AnimatedFlatListProps<T> & { ref?: React.Ref<AnimatedFlatListRef> }
) => React.ReactElement;

export default AnimatedFlatList;
