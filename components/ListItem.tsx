import StarIcon from "@/components/icons/StarIcon";
import { ThemedText } from "@/components/ThemedText";
import { GAME_CARD_COLORS_LIGHT } from "@/constants/Colors";
import { TaskInfoType } from "@/context/app.context.reducer";
import { SETTINGS } from "@/hardcoded";
import createArray from "@/utils/createArray";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { type FC, memo, useMemo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const DARK_STAR_COLOR = "#e8ae4a";
const LIGHT_STAR_COLOR = "#1C274C";
const { STATS_PER_LEVEL } = SETTINGS;

// Move helper functions outside component to prevent recreation
const adjustColorBrightness = (hex: string, percent: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const adjustR = Math.max(0, Math.min(255, r + percent));
  const adjustG = Math.max(0, Math.min(255, g + percent));
  const adjustB = Math.max(0, Math.min(255, b + percent));
  return (
    "#" +
    ((1 << 24) + (Math.round(adjustR) << 16) + (Math.round(adjustG) << 8) + Math.round(adjustB)).toString(16).slice(1)
  );
};

const getColorInfo = (levelNumber: number, isLevelLocked: boolean, bgColor?: string) => {
  if (bgColor) {
    return {
      bgColor,
      lightColor: adjustColorBrightness(bgColor, 30),
      darkColor: adjustColorBrightness(bgColor, -30),
    };
  }

  if (isLevelLocked) {
    return {
      bgColor: "gray",
      lightColor: "#bbbbbb",
      darkColor: "#666666",
    };
  }

  const baseColor = GAME_CARD_COLORS_LIGHT[levelNumber % GAME_CARD_COLORS_LIGHT.length];
  return {
    bgColor: baseColor,
    lightColor: adjustColorBrightness(baseColor, 30),
    darkColor: adjustColorBrightness(baseColor, -30),
  };
};

// Pre-create star array to avoid recreation
const STAR_ARRAY = createArray(STATS_PER_LEVEL);

// Item height must match AnimatedFlatList's ITEM_HEIGHT
const ITEM_HEIGHT = 190;
const VIEWPORT_HEIGHT = 800; // Approximate viewport height

type ListItemProps = {
  index: number;
  bgColor?: string;
  position: number;
  item: TaskInfoType;
  theme: "light" | "dark";
  handleClick: () => void;
  scrollY: SharedValue<number>;
};

const ListItem: FC<ListItemProps> = memo(
  ({ item, index, bgColor, position, theme, handleClick, scrollY }) => {
    const pressScale = useSharedValue(1);

    // Calculate item's vertical position
    const itemOffset = index * ITEM_HEIGHT;

    const rStyle = useAnimatedStyle(() => {
      "worklet";
      // Calculate how far this item is from being centered in viewport
      const inputRange = [
        itemOffset - VIEWPORT_HEIGHT,
        itemOffset - VIEWPORT_HEIGHT / 2,
        itemOffset,
        itemOffset + VIEWPORT_HEIGHT / 2,
        itemOffset + VIEWPORT_HEIGHT,
      ];

      const opacity = interpolate(scrollY.value, inputRange, [0, 1, 1, 1, 0], Extrapolation.CLAMP);

      const scrollScale = interpolate(scrollY.value, inputRange, [0.6, 1, 1, 1, 0.6], Extrapolation.CLAMP);

      return {
        opacity,
        transform: [{ scale: scrollScale * pressScale.value }],
      };
    });

    // Memoize color info since it only depends on item properties
    const colorInfo = useMemo(
      () => getColorInfo(item.levelNumber, item.isLevelLocked, bgColor),
      [item.levelNumber, item.isLevelLocked, bgColor]
    );

    // Memoize star color
    const starColor = useMemo(() => (theme === "light" ? LIGHT_STAR_COLOR : DARK_STAR_COLOR), [theme]);

    // Memoize position style
    const positionStyle = useMemo(
      () => ({
        position: "absolute" as const,
        left: position * 72,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      }),
      [position]
    );

    const handlePressIn = useCallback(() => {
      pressScale.value = withSpring(0.95);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [pressScale]);

    const handlePressOut = useCallback(() => {
      pressScale.value = withSpring(1);
      handleClick();
    }, [pressScale, handleClick]);

    return (
      <Animated.View style={[styles.listItem, rStyle]}>
        <View style={positionStyle}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.cardContainer}
            disabled={item.isLevelLocked}
          >
            <LinearGradient
              colors={[colorInfo.lightColor, colorInfo.darkColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.outerSquare}
            >
              <View style={[styles.innerSquare, { backgroundColor: colorInfo.bgColor }]}>
                <ThemedText type="subtitle" style={styles.levelText}>
                  {item.levelNumber}
                </ThemedText>
              </View>
            </LinearGradient>
          </Pressable>
          <View style={styles.starContainer}>
            {STAR_ARRAY.map((_, index) => {
              const isFilled = index < item.stars && item.stars > 0;
              return (
                <StarIcon
                  key={index}
                  stroke={starColor}
                  fill={isFilled ? starColor : "transparent"}
                  style={styles.starIcon}
                />
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  },
  // Custom comparison function for memo - only re-render when these props change
  (prevProps, nextProps) => {
    return (
      prevProps.item.levelNumber === nextProps.item.levelNumber &&
      prevProps.item.stars === nextProps.item.stars &&
      prevProps.item.isLevelLocked === nextProps.item.isLevelLocked &&
      prevProps.position === nextProps.position &&
      prevProps.index === nextProps.index &&
      prevProps.theme === nextProps.theme &&
      prevProps.bgColor === nextProps.bgColor
      // Note: scrollY is a SharedValue and handled by Reanimated
    );
  }
);

ListItem.displayName = "ListItem";

const styles = StyleSheet.create({
  listItem: {
    height: 170,
    width: "90%",
    marginTop: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  outerSquare: {
    width: 110,
    height: 110,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  innerSquare: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    fontSize: 32,
    color: "#fff",
  },
  starContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
});

export default ListItem;
