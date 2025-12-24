import StarIcon from "@/components/icons/StarIcon";
import { ThemedText } from "@/components/ThemedText";
import { GAME_CARD_COLORS_LIGHT } from "@/constants/Colors";
import { TaskInfoType } from "@/context/app.context.reducer";
import { SETTINGS } from "@/hardcoded";
import useAppContext from "@/hooks/useAppContext";
import createArray from "@/utils/createArray";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { type FC, memo } from "react";
import { Pressable, StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const DARK_STAR_COLOR = "#e8ae4a";
const LIGHT_STAR_COLOR = "#1C274C";
const { STATS_PER_LEVEL } = SETTINGS;

type ListItemProps = {
  bgColor?: string;
  position: number;
  item: TaskInfoType;
  handleClick: () => void;
  viewableItems: SharedValue<ViewToken[]>;
};

const ListItem: FC<ListItemProps> = memo(({ item, bgColor, position, handleClick, viewableItems }) => {
  const scale = useSharedValue(1);
  const { state } = useAppContext();
  const theme = state.theme ?? "light";

  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((viewable) => viewable.isViewable)
        .find((viewableItem) => viewableItem.item.levelNumber === item.levelNumber)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.6),
        },
      ],
    };
  });

  const pressableStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  const getBgColor = (index: number, isDisabled: boolean) => {
    if (isDisabled) {
      return {
        bgColor: "gray",
        lightColor: "#bbbbbb",
        darkColor: "#666666",
      };
    }

    // Get the base color from your array
    const baseColor = GAME_CARD_COLORS_LIGHT[index % GAME_CARD_COLORS_LIGHT.length];

    // Create lighter and darker variants for the gradient
    // This is a simple implementation - for production you'd want a proper color manipulation library
    return {
      bgColor: baseColor,
      lightColor: adjustColorBrightness(baseColor, 30), // Lighter variant
      darkColor: adjustColorBrightness(baseColor, -30), // Darker variant
    };
  };

  // Helper function to lighten or darken a hex color
  const adjustColorBrightness = (hex: string, percent: number): string => {
    // Remove the # if present
    hex = hex.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Adjust brightness
    const adjustR = Math.max(0, Math.min(255, r + percent));
    const adjustG = Math.max(0, Math.min(255, g + percent));
    const adjustB = Math.max(0, Math.min(255, b + percent));

    // Convert back to hex
    return (
      "#" +
      ((1 << 24) + (Math.round(adjustR) << 16) + (Math.round(adjustG) << 8) + Math.round(adjustB)).toString(16).slice(1)
    );
  };

  const colorInfo = bgColor
    ? {
        bgColor,
        lightColor: adjustColorBrightness(bgColor, 30),
        darkColor: adjustColorBrightness(bgColor, -30),
      }
    : getBgColor(item.levelNumber, item.isLevelLocked);

  return (
    <Animated.View style={[styles.listItem, rStyle]}>
      <View
        style={{
          position: "absolute",
          left: position * 72,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View style={pressableStyle}>
          <Pressable
            disabled={item.isLevelLocked}
            onPressIn={() => {
              scale.value = 0.95;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onPressOut={() => {
              scale.value = 1;
              handleClick();
            }}
            style={styles.cardContainer}
          >
            {/* Outer square with gradient */}
            <LinearGradient
              colors={[colorInfo.lightColor, colorInfo.darkColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.outerSquare}
            >
              {/* Inner square */}
              <View style={[styles.innerSquare, { backgroundColor: colorInfo.bgColor }]}>
                <ThemedText type="subtitle" style={styles.levelText}>
                  {item?.levelNumber}
                </ThemedText>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
        <View style={styles.starContainer}>
          {createArray(STATS_PER_LEVEL).map((_, index) => {
            const color = theme === "light" ? LIGHT_STAR_COLOR : DARK_STAR_COLOR;
            const isFilled = index < item.stars && item.stars > 0;

            return (
              <StarIcon key={index} stroke={color} fill={isFilled ? color : "transparent"} style={styles.starIcon} />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
});

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
