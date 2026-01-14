import Refresh from "@/assets/images/refresh.png";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { MathExplanation } from "@/utils/mathExplanations";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
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

  const boxBackground = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.6)";
  const boxBorder = isDark ? "rgba(196, 181, 253, 0.3)" : "rgba(106, 74, 203, 0.2)";

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
  leftItems: string[];
  rightItems: string[];
  isPlaying: boolean;
  boxBackground: string;
  boxBorder: string;
  isDark: boolean;
}

function AdditionAnimation({ leftItems, rightItems, isPlaying, boxBackground, boxBorder }: AdditionAnimationProps) {
  const itemAnimations = rightItems.map(() => useSharedValue(0));
  const rightBoxOpacity = useSharedValue(1);
  const leftBoxCenterX = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const leftBoxRef = useRef<View>(null);

  // Calculate item size based on total number of items
  const totalItems = leftItems.length + rightItems.length;
  const itemSize = totalItems > 6 ? 20 : 28;

  useEffect(() => {
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
      setTimeout(
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
  }, [isPlaying, containerWidth]);

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
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: itemAnimations[index].value,
            transform: [
              { translateX: (1 - itemAnimations[index].value) * 80 },
              { scale: 0.5 + itemAnimations[index].value * 0.5 },
            ],
          }));
          return typeof item === "string" ? (
            <Animated.Text key={`flying-${index}`} style={[styles.itemEmoji, { fontSize: itemSize }, animatedStyle]}>
              {item}
            </Animated.Text>
          ) : (
            <Animated.Image
              key={`flying-img-${index}`}
              source={item}
              style={[{ width: itemSize, height: itemSize, marginHorizontal: 2 }, animatedStyle]}
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
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: 1 - itemAnimations[index].value,
            transform: [{ scale: 1 - itemAnimations[index].value * 0.5 }],
          }));
          return typeof item === "string" ? (
            <Animated.Text key={`right-${index}`} style={[styles.itemEmoji, { fontSize: itemSize }, animatedStyle]}>
              {item}
            </Animated.Text>
          ) : (
            <Animated.Image
              key={`right-img-${index}`}
              source={item}
              style={[{ width: itemSize, height: itemSize, marginHorizontal: 2 }, animatedStyle]}
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
  leftItems: string[];
  rightItems: string[];
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
  const removeAnimations = leftItems.slice(0, itemsToRemove).map(() => useSharedValue(0));
  const remainingAnimations = leftItems.slice(itemsToRemove).map(() => useSharedValue(0));
  const rightBoxOpacity = useSharedValue(0);
  const leftBoxTranslateX = useSharedValue(0);
  const rightBoxTranslateX = useSharedValue(150);

  // Calculate item size based on total number of items - smaller for more items
  const totalItems = leftItems.length;
  const itemSize = totalItems > 8 ? 16 : totalItems > 6 ? 18 : totalItems > 4 ? 22 : 28;

  // Calculate box dimensions to fit items in a grid (max 3 items per row)
  const maxItemsPerRow = 3;
  const itemsPerRow = Math.min(maxItemsPerRow, totalItems);
  const numRows = Math.ceil(totalItems / maxItemsPerRow);
  const boxWidth = itemsPerRow * (itemSize + 6) + 24; // item size + margins + padding
  const boxHeight = numRows * (itemSize + 6) + 20; // rows + padding

  // Calculate delay for main animation based on number of items fading in
  const itemFadeInDelay = 150; // ms between each item fade in
  const totalFadeInTime = totalItems * itemFadeInDelay + 600; // time for all items to fade in + pause

  useEffect(() => {
    if (isPlaying) {
      removeAnimations.forEach((anim) => (anim.value = 0));
      remainingAnimations.forEach((anim) => (anim.value = 0));
      rightBoxOpacity.value = 0;
      leftBoxTranslateX.value = 0;
      rightBoxTranslateX.value = 150;

      // Move left box to the left and fade in right box (after all items have faded in)
      leftBoxTranslateX.value = withDelay(totalFadeInTime, withSpring(-70, { damping: 15, stiffness: 100 }));
      rightBoxTranslateX.value = withDelay(totalFadeInTime, withSpring(70, { damping: 15, stiffness: 100 }));
      rightBoxOpacity.value = withDelay(totalFadeInTime, withTiming(1, { duration: 400 }));

      // Animate items being moved to the right box with staggered delay
      removeAnimations.forEach((anim, index) => {
        anim.value = withDelay(index * 400 + totalFadeInTime + 500, withSpring(1, { damping: 12, stiffness: 100 }));
      });

      // Animate remaining items (fade in with the initial items)
      remainingAnimations.forEach((anim, index) => {
        anim.value = withDelay((index + itemsToRemove) * itemFadeInDelay + 200, withTiming(1, { duration: 300 }));
      });
    }
  }, [isPlaying]);

  const rightBoxStyle = useAnimatedStyle(() => ({
    opacity: rightBoxOpacity.value,
    transform: [{ translateX: rightBoxTranslateX.value }, { scale: 0.8 + rightBoxOpacity.value * 0.2 }],
  }));

  const leftBoxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftBoxTranslateX.value }],
  }));

  return (
    <View style={[styles.animationRow, { justifyContent: "center", position: "relative", minHeight: Math.max(80, boxHeight + 10) }]}>
      {/* Left box - items leave from here */}
      <Animated.View
        style={[
          styles.itemBox,
          { backgroundColor: boxBackground, borderColor: boxBorder, position: "absolute", width: boxWidth, minHeight: boxHeight },
          leftBoxStyle,
        ]}
      >
        {leftItems.map((item, index) => {
          const isBeingRemoved = index < itemsToRemove;
          if (isBeingRemoved) {
            const animatedStyle = useAnimatedStyle(() => ({
              opacity: 1 - removeAnimations[index].value,
              transform: [
                { translateX: removeAnimations[index].value * 140 },
                { scale: 1 - removeAnimations[index].value * 0.5 },
              ],
            }));
            return typeof item === "string" ? (
              <Animated.Text
                key={`left-${index}`}
                entering={FadeIn.delay(index * itemFadeInDelay + 200).duration(300)}
                style={[styles.itemEmoji, { fontSize: itemSize }, animatedStyle]}
              >
                {item}
              </Animated.Text>
            ) : (
              <Animated.Image
                key={`left-img-${index}`}
                entering={FadeIn.delay(index * itemFadeInDelay + 200).duration(300)}
                source={item}
                style={[{ width: itemSize, height: itemSize, marginHorizontal: 2 }, animatedStyle]}
              />
            );
          }
          const remainingIndex = index - itemsToRemove;
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: remainingAnimations[remainingIndex].value,
          }));
          return typeof item === "string" ? (
            <Animated.Text key={`left-${index}`} style={[styles.itemEmoji, { fontSize: itemSize }, animatedStyle]}>
              {item}
            </Animated.Text>
          ) : (
            <Animated.Image
              key={`left-img-${index}`}
              source={item}
              style={[{ width: itemSize, height: itemSize, marginHorizontal: 2 }, animatedStyle]}
            />
          );
        })}
      </Animated.View>

      {/* Right box - items fly here (appears and collects items) */}
      <Animated.View
        style={[
          styles.itemBox,
          { backgroundColor: boxBackground, borderColor: boxBorder, position: "absolute", width: boxWidth, minHeight: boxHeight },
          rightBoxStyle,
        ]}
      >
        {leftItems.slice(0, itemsToRemove).map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: removeAnimations[index].value,
            transform: [
              { translateX: (1 - removeAnimations[index].value) * -140 },
              { scale: 0.5 + removeAnimations[index].value * 0.5 },
            ],
          }));
          return typeof item === "string" ? (
            <Animated.Text key={`right-${index}`} style={[styles.itemEmoji, { fontSize: itemSize }, animatedStyle]}>
              {item}
            </Animated.Text>
          ) : (
            <Animated.Image
              key={`right-img-${index}`}
              source={item}
              style={[{ width: itemSize, height: itemSize, marginHorizontal: 2 }, animatedStyle]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}

// ============================================
// MULTIPLICATION ANIMATION
// Groups appear one by one
// ============================================
interface MultiplicationAnimationProps {
  groups: string[];
  isPlaying: boolean;
  boxBackground: string;
  boxBorder: string;
  isDark: boolean;
}

function MultiplicationAnimation({
  groups,
  isPlaying,
  boxBackground,
  boxBorder,
  isDark,
}: MultiplicationAnimationProps) {
  const groupAnimations = groups.map(() => useSharedValue(0));

  useEffect(() => {
    if (isPlaying) {
      groupAnimations.forEach((anim) => (anim.value = 0));

      // Animate each group appearing
      groupAnimations.forEach((anim, index) => {
        anim.value = withDelay(index * 500 + 300, withSpring(1, { damping: 8, stiffness: 100 }));
      });
    }
  }, [isPlaying]);

  return (
    <View style={styles.groupsRow}>
      {groups.map((group, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          opacity: groupAnimations[index].value,
          transform: [{ scale: groupAnimations[index].value }, { translateY: (1 - groupAnimations[index].value) * 20 }],
        }));
        return (
          <Animated.View
            key={`group-${index}`}
            style={[
              styles.groupBox,
              { backgroundColor: boxBackground, borderColor: isDark ? "#c4b5fd" : "#6a4acb" },
              animatedStyle,
            ]}
          >
            {typeof group === "string" ? (
              <ThemedText style={styles.groupEmoji}>{group}</ThemedText>
            ) : (
              <Animated.Image source={group} style={{ width: 28, height: 28, marginHorizontal: 2 }} />
            )}
          </Animated.View>
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
  groups: string[];
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
  const itemAnimations = groups.map(() => useSharedValue(0));
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
  }, [isPlaying]);

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
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: 1 - itemAnimations[index].value,
            transform: [{ scale: 1 - itemAnimations[index].value * 0.3 }],
          }));
          return typeof item === "string" ? (
            <Animated.Text
              key={`initial-${index}`}
              entering={FadeIn.delay(index * 80)}
              style={[styles.itemEmoji, animatedStyle]}
            >
              {item}
            </Animated.Text>
          ) : (
            <Animated.Image
              key={`initial-img-${index}`}
              source={item}
              style={[{ width: 28, height: 28, marginHorizontal: 2 }, animatedStyle]}
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
                const animatedStyle = useAnimatedStyle(() => ({
                  opacity: itemAnimations[itemIndex].value,
                  transform: [
                    { translateY: (1 - itemAnimations[itemIndex].value) * -50 },
                    { translateX: (1 - itemAnimations[itemIndex].value) * -horizontalOffset },
                    { scale: 0.5 + itemAnimations[itemIndex].value * 0.5 },
                  ],
                }));
                return typeof groups[itemIndex] === "string" ? (
                  <Animated.Text key={`group-item-${itemIndex}`} style={[styles.groupItemEmoji, animatedStyle]}>
                    {groups[itemIndex]}
                  </Animated.Text>
                ) : (
                  <Animated.Image
                    key={`group-item-img-${itemIndex}`}
                    source={groups[itemIndex]}
                    style={[{ width: 24, height: 24, marginHorizontal: 2 }, animatedStyle]}
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
    borderWidth: 1,
    borderRadius: 10,
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
    padding: 8,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    borderStyle: "dashed",
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
    borderWidth: 2,
    borderRadius: 10,
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
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "rgba(106, 74, 203, 0.15)",
  },
  replayText: {
    fontSize: 13,
  },
});
