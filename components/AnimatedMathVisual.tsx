import Refresh from "@/assets/images/refresh.png";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { MathExplanation, MathVisualItem } from "@/utils/mathExplanations";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  makeMutable,
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

interface AnimatedMathVisualProps {
  explanation: MathExplanation;
  isPlaying: boolean;
  onReplay: () => void;
}

/**
 * Animated visual component for math explanations
 * Shows animated items moving to illustrate math operations
 */
export function AnimatedMathVisual({ explanation, isPlaying, onReplay }: AnimatedMathVisualProps) {
  const colorScheme = useAppColorScheme();
  const isDark = colorScheme === "dark";

  const boxBackground = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.78)";
  const boxBorder = isDark ? "rgba(196, 181, 253, 0.12)" : "rgba(106, 74, 203, 0.08)";
  const groupBackground = isDark ? "rgba(196, 181, 253, 0.08)" : "rgba(255, 255, 255, 0.52)";

  const { visualItems, example } = explanation;
  const operation = visualItems.operationSymbol;

  return (
    <View style={styles.container}>
      {operation === "+" && (
        <AdditionAnimation
          leftItems={visualItems.leftItems}
          rightItems={visualItems.rightItems}
          isPlaying={isPlaying}
          boxBackground={boxBackground}
          boxBorder={boxBorder}
          isDark={isDark}
        />
      )}

      {operation === "-" && (
        <SubtractionAnimation
          leftItems={visualItems.leftItems}
          rightItems={visualItems.rightItems}
          result={example.result}
          isPlaying={isPlaying}
          boxBackground={boxBackground}
          boxBorder={boxBorder}
          isDark={isDark}
        />
      )}

      {operation === "×" && (
        <MultiplicationAnimation
          groups={visualItems.leftItems}
          isPlaying={isPlaying}
          boxBackground={boxBackground}
          boxBorder={boxBorder}
          groupBackground={groupBackground}
          isDark={isDark}
        />
      )}

      {operation === "÷" && (
        <DivisionAnimation
          groups={visualItems.leftItems}
          divisor={example.right}
          isPlaying={isPlaying}
          boxBackground={boxBackground}
          boxBorder={boxBorder}
          isDark={isDark}
        />
      )}

      <Pressable style={styles.replayButton} onPress={onReplay}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Image source={Refresh} style={{ width: 16, height: 16 }} />
          <ThemedText style={styles.replayText}>Atkārtot</ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

// ============================================
// ADDITION ANIMATION
// Items from right group fly over to join left group
// ============================================
interface AdditionAnimationProps {
  leftItems: MathVisualItem[];
  rightItems: MathVisualItem[];
  isPlaying: boolean;
  boxBackground: string;
  boxBorder: string;
  isDark: boolean;
}

function useSharedValueArray(length: number, initialValue: number): Array<SharedValue<number>> {
  const valuesRef = useRef<Array<SharedValue<number>>>([]);

  if (valuesRef.current.length < length) {
    for (let index = valuesRef.current.length; index < length; index++) {
      valuesRef.current.push(makeMutable(initialValue));
    }
  } else if (valuesRef.current.length > length) {
    valuesRef.current = valuesRef.current.slice(0, length);
  }

  return valuesRef.current;
}

interface AnimatedVisualTextProps {
  item: MathVisualItem;
  itemSize: number;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  textStyle?: object;
  imageStyle?: object;
  itemKey: string;
}

function AnimatedVisualItem({
  item,
  itemKey,
  itemSize,
  animatedStyle,
  textStyle,
  imageStyle,
}: AnimatedVisualTextProps) {
  if (typeof item === "string") {
    return (
      <Animated.Text key={itemKey} style={[styles.itemEmoji, { fontSize: itemSize }, textStyle, animatedStyle]}>
        {item}
      </Animated.Text>
    );
  }

  return (
    <Animated.Image
      key={itemKey}
      source={item}
      style={[{ width: itemSize, height: itemSize, marginHorizontal: 2 }, imageStyle, animatedStyle]}
    />
  );
}

interface AdditionAnimatedItemProps {
  item: MathVisualItem;
  itemSize: number;
  animation: SharedValue<number>;
  itemKey: string;
}

function AdditionIncomingItem({ item, itemKey, itemSize, animation }: AdditionAnimatedItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [{ translateX: (1 - animation.value) * 80 }, { scale: 0.5 + animation.value * 0.5 }],
  }));

  return <AnimatedVisualItem item={item} itemKey={itemKey} itemSize={itemSize} animatedStyle={animatedStyle} />;
}

function AdditionRightItem({ item, itemKey, itemSize, animation }: AdditionAnimatedItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - animation.value,
    transform: [{ scale: 1 - animation.value * 0.5 }],
  }));

  return <AnimatedVisualItem item={item} itemKey={itemKey} itemSize={itemSize} animatedStyle={animatedStyle} />;
}

interface SubtractionMovingItemProps {
  item: MathVisualItem;
  itemKey: string;
  itemSize: number;
  moveAnimation: SharedValue<number>;
  itemOpacity: SharedValue<number>;
  slideDistance: number;
  verticalOffset: number;
}

function SubtractionMovingItem({
  item,
  itemKey,
  itemSize,
  moveAnimation,
  itemOpacity,
  slideDistance,
  verticalOffset,
}: SubtractionMovingItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const moveProgress = moveAnimation.value;
    return {
      opacity: moveProgress > 0.01 ? 1 : itemOpacity.value,
      transform: [{ translateX: moveProgress * slideDistance }, { translateY: moveProgress * verticalOffset }],
    };
  });

  return <AnimatedVisualItem item={item} itemKey={itemKey} itemSize={itemSize} animatedStyle={animatedStyle} />;
}

interface SubtractionStaticItemProps {
  item: MathVisualItem;
  itemKey: string;
  itemSize: number;
  opacityValue: SharedValue<number>;
}

function SubtractionStaticItem({ item, itemKey, itemSize, opacityValue }: SubtractionStaticItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  return <AnimatedVisualItem item={item} itemKey={itemKey} itemSize={itemSize} animatedStyle={animatedStyle} />;
}

interface MultiplicationGroupItemProps {
  group: MathVisualItem;
  animation: SharedValue<number>;
  boxBorder: string;
  groupBackground: string;
  itemKey: string;
}

function MultiplicationGroupItem({
  group,
  animation,
  boxBorder,
  groupBackground,
  itemKey,
}: MultiplicationGroupItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [{ scale: animation.value }, { translateY: (1 - animation.value) * 20 }],
  }));

  return (
    <Animated.View
      key={itemKey}
      style={[styles.groupBox, { backgroundColor: groupBackground, borderColor: boxBorder }, animatedStyle]}
    >
      {typeof group === "string" ? (
        <ThemedText style={styles.groupEmoji}>{group}</ThemedText>
      ) : (
        <Animated.Image source={group} style={{ width: 28, height: 28, marginHorizontal: 2 }} />
      )}
    </Animated.View>
  );
}

interface DivisionInitialItemProps {
  item: MathVisualItem;
  itemKey: string;
  animation: SharedValue<number>;
}

function DivisionInitialItem({ item, itemKey, animation }: DivisionInitialItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - animation.value,
    transform: [{ scale: 1 - animation.value * 0.3 }],
  }));

  return <AnimatedVisualItem item={item} itemKey={itemKey} itemSize={28} animatedStyle={animatedStyle} />;
}

interface DivisionGroupItemProps {
  item: MathVisualItem;
  itemKey: string;
  animation: SharedValue<number>;
  horizontalOffset: number;
}

function DivisionGroupItem({ item, itemKey, animation, horizontalOffset }: DivisionGroupItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [
      { translateY: (1 - animation.value) * -50 },
      { translateX: (1 - animation.value) * -horizontalOffset },
      { scale: 0.5 + animation.value * 0.5 },
    ],
  }));

  if (typeof item === "string") {
    return (
      <Animated.Text key={itemKey} style={[styles.groupItemEmoji, animatedStyle]}>
        {item}
      </Animated.Text>
    );
  }

  return (
    <Animated.Image
      key={itemKey}
      source={item}
      style={[{ width: 24, height: 24, marginHorizontal: 2 }, animatedStyle]}
    />
  );
}

function AdditionAnimation({ leftItems, rightItems, isPlaying, boxBackground, boxBorder }: AdditionAnimationProps) {
  const itemAnimations = useSharedValueArray(rightItems.length, 0);
  const rightBoxOpacity = useSharedValue(1);
  const leftBoxCenterX = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const leftBoxRef = useRef<View>(null);

  // Calculate item size based on total number of items
  const totalItems = leftItems.length + rightItems.length;
  const itemSize = totalItems > 6 ? 20 : 28;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isPlaying) {
      itemAnimations.forEach((anim) => (anim.value = 0));
      rightBoxOpacity.value = 1;
      leftBoxCenterX.value = 0;

      // Animate each item flying over with staggered delay
      itemAnimations.forEach((anim, index) => {
        anim.value = withDelay(index * 400 + 500, withSpring(1, { damping: 12, stiffness: 100 }));
      });

      // Hide the right box after all items have moved
      rightBoxOpacity.value = withDelay(rightItems.length * 400 + 600, withTiming(0, { duration: 300 }));

      // Measure and center the left box after right box disappears
      timeoutId = setTimeout(
        () => {
          if (leftBoxRef.current && containerWidth > 0) {
            leftBoxRef.current.measure((x, y, width) => {
              if (width > 0) {
                // Calculate offset to center the box
                const currentX = x;
                const targetX = (containerWidth - width) / 2;
                const translateAmount = targetX - currentX;
                leftBoxCenterX.value = withSpring(translateAmount, { damping: 15, stiffness: 100 });
              }
            });
          }
        },
        rightItems.length * 400 + 900
      );
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [containerWidth, isPlaying, itemAnimations, leftBoxCenterX, rightBoxOpacity, rightItems.length]);

  const rightBoxStyle = useAnimatedStyle(() => ({
    opacity: rightBoxOpacity.value,
    transform: [{ scale: 0.8 + rightBoxOpacity.value * 0.2 }],
  }));

  const leftBoxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftBoxCenterX.value }],
  }));

  return (
    <View style={styles.animationRow} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {/* Left group - items join here */}
      <Animated.View
        ref={leftBoxRef}
        style={[styles.itemBox, { backgroundColor: boxBackground, borderColor: boxBorder }, leftBoxStyle]}
      >
        {leftItems.map((item, index) =>
          typeof item === "string" ? (
            <Animated.Text
              key={`left-${index}`}
              entering={FadeIn.delay(index * 100)}
              style={[styles.itemEmoji, { fontSize: itemSize }]}
            >
              {item}
            </Animated.Text>
          ) : (
            <Animated.Image
              key={`left-img-${index}`}
              entering={FadeIn.delay(index * 100)}
              source={item}
              style={{ width: itemSize, height: itemSize, marginHorizontal: 2 }}
            />
          )
        )}
        {/* Items that fly in */}
        {rightItems.map((item, index) => {
          return (
            <AdditionIncomingItem
              key={`flying-${index}`}
              item={item}
              itemKey={`flying-${index}`}
              itemSize={itemSize}
              animation={itemAnimations[index]}
            />
          );
        })}
      </Animated.View>

      {/* Right group - disappears after items fly away */}
      <Animated.View
        style={[
          styles.itemBox,
          styles.itemBoxSmall,
          { backgroundColor: boxBackground, borderColor: boxBorder },
          rightBoxStyle,
        ]}
      >
        {rightItems.map((item, index) => {
          return (
            <AdditionRightItem
              key={`right-${index}`}
              item={item}
              itemKey={`right-${index}`}
              itemSize={itemSize}
              animation={itemAnimations[index]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}

// ============================================
// SUBTRACTION ANIMATION
// Items fade out and fly away
// ============================================
interface SubtractionAnimationProps {
  leftItems: MathVisualItem[];
  rightItems: MathVisualItem[];
  result: number;
  isPlaying: boolean;
  boxBackground: string;
  boxBorder: string;
  isDark: boolean;
}

function SubtractionAnimation({
  leftItems,
  rightItems,
  isPlaying,
  boxBackground,
  boxBorder,
}: SubtractionAnimationProps) {
  const itemsToRemove = rightItems.length;
  const itemsRemaining = leftItems.length - itemsToRemove;

  // Animation values for items being moved (last N items)
  const moveAnimations = useSharedValueArray(itemsToRemove, 0);
  const rightBoxOpacity = useSharedValue(0);

  // Animation values for initial box fade in and slide
  const leftBoxOpacity = useSharedValue(0);
  const leftBoxTranslateX = useSharedValue(50); // Start from right (center position)
  const itemOpacities = useSharedValueArray(leftItems.length, 0);

  // Calculate item size based on total number of items
  const totalItems = leftItems.length;
  const itemSize = totalItems > 8 ? 16 : totalItems > 6 ? 18 : totalItems > 4 ? 22 : 28;

  // Calculate box dimensions
  const maxItemsPerRow = 3;
  const itemsPerRow = Math.min(maxItemsPerRow, totalItems);
  const numRows = Math.ceil(totalItems / maxItemsPerRow);
  const boxWidth = itemsPerRow * (itemSize + 6) + 24;
  const boxHeight = numRows * itemSize + 25;

  // Gap between boxes
  const boxGap = 1;

  // Timing constants
  const boxFadeInDuration = 400;
  const boxSlideDelay = 300;
  const boxSlideDuration = 500;
  const itemFadeInDelay = 150;
  const itemFadeInStart = boxFadeInDuration + boxSlideDelay + boxSlideDuration;
  const totalFadeInTime = itemFadeInStart + totalItems * itemFadeInDelay + 400;

  useEffect(() => {
    if (isPlaying) {
      // Reset all animations
      moveAnimations.forEach((anim) => (anim.value = 0));
      rightBoxOpacity.value = 0;
      leftBoxOpacity.value = 0;
      leftBoxTranslateX.value = 50;
      itemOpacities.forEach((anim) => (anim.value = 0));

      // Step 1: Fade in the left box (starts from center)
      leftBoxOpacity.value = withTiming(1, { duration: boxFadeInDuration });

      // Step 2: Slide the box to the left
      leftBoxTranslateX.value = withDelay(boxSlideDelay, withSpring(0, { damping: 15, stiffness: 100 }));

      // Step 3: Fade in items one by one
      itemOpacities.forEach((anim, index) => {
        anim.value = withDelay(itemFadeInStart + index * itemFadeInDelay, withTiming(1, { duration: 300 }));
      });

      // Step 4: Show right box after items fade in
      rightBoxOpacity.value = withDelay(totalFadeInTime, withTiming(1, { duration: 300 }));

      // Step 5: Animate each item sliding to the right box one by one with spring effect
      moveAnimations.forEach((anim, index) => {
        anim.value = withDelay(index * 500 + totalFadeInTime + 400, withSpring(1, { damping: 12, stiffness: 100 }));
      });
    }
  }, [
    isPlaying,
    itemFadeInStart,
    itemOpacities,
    leftBoxOpacity,
    leftBoxTranslateX,
    moveAnimations,
    rightBoxOpacity,
    totalFadeInTime,
  ]);

  const leftBoxStyle = useAnimatedStyle(() => ({
    opacity: leftBoxOpacity.value,
    transform: [{ translateX: leftBoxTranslateX.value }],
  }));

  const rightBoxStyle = useAnimatedStyle(() => ({
    opacity: rightBoxOpacity.value,
  }));

  // Distance items need to travel (from left box to right box)
  const slideDistance = boxWidth + boxGap + 10;

  return (
    <View
      style={[styles.animationRow, { justifyContent: "center", gap: boxGap, minHeight: Math.max(80, boxHeight + 10) }]}
    >
      {/* Left box - items start here */}
      <Animated.View
        style={[
          styles.itemBox,
          {
            backgroundColor: boxBackground,
            borderColor: boxBorder,
            width: boxWidth,
            minHeight: boxHeight,
            height: boxHeight,
            zIndex: 2,
          },
          leftBoxStyle,
        ]}
      >
        {leftItems.map((item, index) => {
          const isBeingMoved = index >= itemsRemaining;

          if (isBeingMoved) {
            const moveIndex = index - itemsRemaining;
            // Calculate vertical offset - items need to move up to their new position in right box
            const verticalOffset = -itemsRemaining * (itemSize - 14);
            return (
              <SubtractionMovingItem
                key={`item-${index}`}
                item={item}
                itemKey={`item-${index}`}
                itemSize={itemSize}
                moveAnimation={moveAnimations[moveIndex]}
                itemOpacity={itemOpacities[index]}
                slideDistance={slideDistance}
                verticalOffset={verticalOffset}
              />
            );
          }

          return (
            <SubtractionStaticItem
              key={`item-${index}`}
              item={item}
              itemKey={`item-${index}`}
              itemSize={itemSize}
              opacityValue={itemOpacities[index]}
            />
          );
        })}
      </Animated.View>

      {/* Right box - background box (items render on top from left box) */}
      <Animated.View
        style={[
          styles.itemBox,
          {
            backgroundColor: boxBackground,
            borderColor: boxBorder,
            width: boxWidth,
            minHeight: boxHeight,
            height: boxHeight,
            zIndex: 1,
          },
          rightBoxStyle,
        ]}
      />
    </View>
  );
}

// ============================================
// MULTIPLICATION ANIMATION
// Groups appear one by one
// ============================================
interface MultiplicationAnimationProps {
  groups: MathVisualItem[];
  isPlaying: boolean;
  boxBackground: string;
  boxBorder: string;
  groupBackground: string;
  isDark: boolean;
}

function MultiplicationAnimation({ groups, isPlaying, boxBorder, groupBackground }: MultiplicationAnimationProps) {
  const groupAnimations = useSharedValueArray(groups.length, 0);

  useEffect(() => {
    if (isPlaying) {
      groupAnimations.forEach((anim) => (anim.value = 0));

      // Animate each group appearing
      groupAnimations.forEach((anim, index) => {
        anim.value = withDelay(index * 500 + 300, withSpring(1, { damping: 8, stiffness: 100 }));
      });
    }
  }, [groupAnimations, isPlaying]);

  return (
    <View style={styles.groupsRow}>
      {groups.map((group, index) => {
        return (
          <MultiplicationGroupItem
            key={`group-${index}`}
            itemKey={`group-${index}`}
            group={group}
            animation={groupAnimations[index]}
            boxBorder={boxBorder}
            groupBackground={groupBackground}
          />
        );
      })}
    </View>
  );
}

// ============================================
// DIVISION ANIMATION
// Items split into equal groups
// ============================================
interface DivisionAnimationProps {
  groups: MathVisualItem[];
  divisor: number;
  isPlaying: boolean;
  boxBackground: string;
  boxBorder: string;
  isDark: boolean;
}

function DivisionAnimation({ groups, divisor, isPlaying, boxBackground, boxBorder }: DivisionAnimationProps) {
  const totalItems = groups.length;
  const itemsPerGroup = totalItems / divisor;

  // Create animation values for each item moving to its group
  const itemAnimations = useSharedValueArray(groups.length, 0);
  const initialBoxOpacity = useSharedValue(1);
  const smallBoxesOpacity = useSharedValue(0);
  const smallBoxesTranslateY = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      itemAnimations.forEach((anim) => (anim.value = 0));
      initialBoxOpacity.value = 1;
      smallBoxesOpacity.value = 0;
      smallBoxesTranslateY.value = 30;

      // Fade in small boxes at the beginning
      smallBoxesOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

      // Animate items moving to their groups with stagger
      itemAnimations.forEach((anim, index) => {
        anim.value = withDelay(1200 + index * 200, withSpring(1, { damping: 12, stiffness: 100 }));
      });

      // Hide initial box after items have moved
      initialBoxOpacity.value = withDelay(1200 + totalItems * 200 + 300, withTiming(0, { duration: 300 }));

      // Move small boxes up to where the large box was
      smallBoxesTranslateY.value = withDelay(
        1200 + totalItems * 200 + 400,
        withSpring(-30, { damping: 15, stiffness: 100 })
      );
    }
  }, [initialBoxOpacity, isPlaying, itemAnimations, smallBoxesOpacity, smallBoxesTranslateY, totalItems]);

  const initialBoxStyle = useAnimatedStyle(() => ({
    opacity: initialBoxOpacity.value,
    transform: [{ scale: 0.8 + initialBoxOpacity.value * 0.2 }],
  }));

  const smallBoxesStyle = useAnimatedStyle(() => ({
    opacity: smallBoxesOpacity.value,
    transform: [{ translateY: smallBoxesTranslateY.value }],
  }));

  // Split items into groups
  const itemGroups: number[][] = [];
  for (let i = 0; i < divisor; i++) {
    const groupItems = [];
    for (let j = 0; j < itemsPerGroup; j++) {
      groupItems.push(i * itemsPerGroup + j);
    }
    itemGroups.push(groupItems);
  }

  return (
    <View style={styles.divisionContainer}>
      {/* Initial box with all items together */}
      <Animated.View
        style={[
          styles.itemBox,
          { backgroundColor: boxBackground, borderColor: boxBorder, position: "absolute", top: 0 },
          initialBoxStyle,
        ]}
      >
        {groups.map((item, index) => {
          return (
            <DivisionInitialItem
              key={`initial-${index}`}
              item={item}
              itemKey={`initial-${index}`}
              animation={itemAnimations[index]}
            />
          );
        })}
      </Animated.View>

      {/* Groups after division - positioned below initially */}
      <Animated.View style={[styles.divisionRow, smallBoxesStyle]}>
        {itemGroups.map((groupIndices, groupIndex) => {
          const horizontalOffset = (groupIndex - (itemGroups.length - 1) / 2) * 80;
          return (
            <View
              key={`group-${groupIndex}`}
              style={[styles.divisionBox, { backgroundColor: boxBackground, borderColor: boxBorder }]}
            >
              {groupIndices.map((itemIndex) => {
                return (
                  <DivisionGroupItem
                    key={`group-item-${itemIndex}`}
                    item={groups[itemIndex]}
                    itemKey={`group-item-${itemIndex}`}
                    animation={itemAnimations[itemIndex]}
                    horizontalOffset={horizontalOffset}
                  />
                );
              })}
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  animationRow: {
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  itemBox: {
    gap: 2,
    padding: 10,
    minWidth: 50,
    maxWidth: "45%",
    minHeight: 44,
    borderWidth: 0,
    borderRadius: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  itemBoxSmall: {
    opacity: 0.6,
  },
  itemEmoji: {
    fontSize: 24,
    textAlignVertical: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  groupsRow: {
    gap: 8,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  groupBox: {
    minWidth: 46,
    minHeight: 46,
    padding: 8,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  groupEmoji: {
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  divisionContainer: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  divisionRow: {
    gap: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  divisionBox: {
    gap: 2,
    padding: 8,
    borderWidth: 0,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  divisionGroupItems: {
    gap: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 60,
  },
  groupItemEmoji: {
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  personEmoji: {
    fontSize: 16,
  },
  replayButton: {
    marginTop: 4,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(106, 74, 203, 0.12)",
  },
  replayText: {
    fontSize: 13,
  },
});
