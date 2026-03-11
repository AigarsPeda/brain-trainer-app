import CrownIcon from "@/components/icons/CrownIcon";
import StarIcon from "@/components/icons/StarIcon";
import { ThemedText } from "@/components/ThemedText";
import { GAME_CARD_COLORS_LIGHT } from "@/constants/Colors";
import { TaskInfoType } from "@/context/app.context.reducer";
import { SETTINGS } from "@/hardcoded";
import { isBossLevel } from "@/utils/bossLevel";
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
  if (isBossLevel(levelNumber) && !isLevelLocked) {
    return {
      bgColor: "#B45309",
      lightColor: "#FCD34D",
      darkColor: "#78350F",
    };
  }

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
  handleClick: () => void;
  isCurrentLevel?: boolean;
  scrollY: SharedValue<number>;
};

const ListItem: FC<ListItemProps> = memo(
  ({ item, index, bgColor, position, theme, isCurrentLevel, handleClick, scrollY }) => {
    const pressScale = useSharedValue(1);

    // Calculate item's vertical position (memoized constant per item)
    const itemOffset = index * ITEM_HEIGHT;

    // Calculate when item is truly centered in viewport (item center at screen center)
    const itemCenterOffset = itemOffset - VIEWPORT_HEIGHT / 2 + ITEM_HEIGHT / 2;

    // Optimized: narrower range for smoother performance
    const edgeDistance = VIEWPORT_HEIGHT * 0.45;
    const inputRange = [
      itemCenterOffset - edgeDistance, // Below center
      itemCenterOffset, // At center
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
        left: position * 72,
        position: "absolute" as const,
        alignItems: "center" as const,
        flexDirection: "column" as const,
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
          <View style={styles.ringWrapper}>
            <AnimatedRing
              isVisible={!!isCurrentLevel}
              color={theme === "dark" ? colorInfo.lightColor : colorInfo.darkColor}
            />
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
                  {isBossLevel(item.levelNumber) && !item.isLevelLocked ? (
                    <>
                      <CrownIcon width={36} height={36} stroke="#FFF7D6" fill="rgba(255, 247, 214, 0.18)" />
                      <ThemedText type="defaultSemiBold" style={styles.bossLevelText}>
                        {item.levelNumber}
                      </ThemedText>
                    </>
                  ) : (
                    <ThemedText type="subtitle" style={styles.levelText}>
                      {item.levelNumber}
                    </ThemedText>
                  )}
                </View>
              </LinearGradient>
            </Pressable>
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  outerSquare: {
    width: 110,
    height: 110,
    elevation: 10,
    shadowRadius: 8,
    borderRadius: 24,
    shadowOpacity: 0.3,
    alignItems: "center",
    shadowColor: "#000",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
  },
  innerSquare: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    fontSize: 32,
    color: "#fff",
  },
  bossLevelText: {
    fontSize: 22,
    color: "#FFF7D6",
    marginTop: 6,
  },
  starContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  ringWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListItem;

const AnimatedRing: FC<{ isVisible: boolean; color: string }> = memo(({ isVisible, color }) => {
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);

  useEffect(() => {
    if (isVisible) {
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.95, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      ringOpacity.value = 0;
      ringScale.value = 0.8;
    }
  }, [isVisible, ringOpacity, ringScale]);

  const ringStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      opacity: ringOpacity.value,
      transform: [{ scale: ringScale.value }],
    };
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 130,
          height: 130,
          borderRadius: 30,
          borderWidth: 3,
          borderColor: color,
          zIndex: -1,
        },
        ringStyle,
      ]}
    />
  );
});

AnimatedRing.displayName = "AnimatedRing";
