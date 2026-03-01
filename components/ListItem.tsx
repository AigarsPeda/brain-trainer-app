import StarIcon from "@/components/icons/StarIcon";
import { ThemedText } from "@/components/ThemedText";
import { GAME_CARD_COLORS_LIGHT } from "@/constants/Colors";
import { TaskInfoType } from "@/context/app.context.reducer";
import { SETTINGS } from "@/hardcoded";
import createArray from "@/utils/createArray";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { type FC, memo, useMemo, useCallback, useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
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
// Use actual screen height for adaptive animations across different devices
const VIEWPORT_HEIGHT = Dimensions.get("window").height;

type ListItemProps = {
  index: number;
  bgColor?: string;
  position: number;
  item: TaskInfoType;
  theme: "light" | "dark";
  isCurrentLevel?: boolean;
  handleClick: () => void;
  scrollY: SharedValue<number>;
};

const ListItem: FC<ListItemProps> = memo(
  ({ item, index, bgColor, position, theme, isCurrentLevel, handleClick, scrollY }) => {
    const pressScale = useSharedValue(1);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
      if (isCurrentLevel) {
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      } else {
        pulseScale.value = 1;
      }
    }, [isCurrentLevel, pulseScale]);

    // Calculate item's vertical position (memoized constant per item)
    const itemOffset = index * ITEM_HEIGHT;

    // Calculate when item is truly centered in viewport (item center at screen center)
    const itemCenterOffset = itemOffset - VIEWPORT_HEIGHT / 2 + ITEM_HEIGHT / 2;

    // Optimized: narrower range for smoother performance
    const edgeDistance = VIEWPORT_HEIGHT * 0.45;
    const inputRange = [
      itemCenterOffset - edgeDistance, // Below center
      itemCenterOffset,                 // At center
    ];

    // Asymmetric scale animation: scales up from below, stays at 1.0 above center
    const scrollScale = useDerivedValue(() => {
      "worklet";
      return interpolate(
        scrollY.value,
        inputRange,
        [0.5, 1], // Very dramatic: scales from 50% to 100% size
        Extrapolation.CLAMP
      );
    }, [scrollY]);

    const rStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        transform: [{ scale: scrollScale.value * pressScale.value }],
      };
    });

    const pulseStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        transform: [{ scale: pulseScale.value }],
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
          <Animated.View style={pulseStyle}>
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
          </Animated.View>
          {!item.isLevelLocked && (
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
          )}
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
      prevProps.isCurrentLevel === nextProps.isCurrentLevel &&
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
