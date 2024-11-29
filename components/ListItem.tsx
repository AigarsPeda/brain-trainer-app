import StarIcon from "@/components/icons/StarIcon";
import { ThemedText } from "@/components/ThemedText";
import { GAME_CARD_COLORS_LIGHT } from "@/constants/Colors";
import type { TaskInfoType } from "@/data/common";
import createArray from "@/util/createArray";
import * as Haptics from "expo-haptics";
import { type FC, memo } from "react";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ListItemProps = {
  bgColor?: string;
  position: number;
  skewAngle: number;
  item: TaskInfoType;
  isDisabled: boolean;
  handleClick: () => void;
  viewableItems: SharedValue<ViewToken[]>;
};

const ListItem: FC<ListItemProps> = memo(
  ({
    item,
    bgColor,
    skewAngle,
    position,
    isDisabled,
    viewableItems,
    handleClick,
  }) => {
    const theme = useColorScheme();
    const scale = useSharedValue(1);

    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter((viewable) => viewable.isViewable)
          .find((viewableItem) => viewableItem.item.id === item.id)
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
        transform: [
          { scale: withSpring(scale.value) },
          { skewX: `${skewAngle}deg` },
        ],
      };
    });

    const getBgColor = (index: number, isDisabled: boolean) => {
      if (isDisabled) {
        return {
          bgColor: "gray",
        };
      }

      return {
        bgColor: GAME_CARD_COLORS_LIGHT[index % GAME_CARD_COLORS_LIGHT.length],
      };
    };

    const backgroundColor = bgColor ?? getBgColor(item.id, isDisabled).bgColor;

    return (
      <Animated.View
        style={[
          styles.listItem,
          rStyle,
          {
            position: "relative",
          },
        ]}
      >
        <Animated.View
          style={[
            pressableStyle,
            {
              position: "absolute",
              left: position * 72,
            },
          ]}
        >
          <View
            style={{
              padding: 10,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Pressable
              onPressIn={() => {
                scale.value = 0.9;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              onPressOut={() => {
                scale.value = 1;
                handleClick();
              }}
              style={[
                styles.pressable,
                {
                  backgroundColor: backgroundColor,
                },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {item?.id}
              </ThemedText>
            </Pressable>
            <View
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {createArray(item.stars).map((_, index) => (
                <StarIcon
                  key={index}
                  fill={theme === "light" ? "#1C274C" : "#e8ae4a"}
                  style={{
                    width: 20,
                    height: 20,
                    marginHorizontal: 2,
                  }}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  listItem: {
    height: 170,
    width: "90%",
    marginTop: 20,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    width: 95,
    height: 95,
    display: "flex",
    borderRadius: 15,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 4,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 7,
  },
});

export default ListItem;
