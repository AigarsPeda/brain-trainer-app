import StarIcon from "@/components/icons/StarIcon";
import { ThemedText } from "@/components/ThemedText";
import type { TaskInfoType } from "@/data/common";
import { useThemeColor } from "@/hooks/useThemeColor";
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
  shColor?: string;
  position: number;
  item: TaskInfoType;
  handleClick: () => void;
  viewableItems: SharedValue<ViewToken[]>;
};

const ListItem: FC<ListItemProps> = memo(
  ({ item, bgColor, shColor, position, viewableItems, handleClick }) => {
    const color = useThemeColor({}, "cardBgColor");
    const shadColor = useThemeColor({}, "cardShadowColors");

    const theme = useColorScheme() ?? "light";

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
    }, [viewableItems.value, item.id]);

    const getBgColor = (index: number) => {
      return {
        bgColor: color[index % color.length],
        shadowColor: shadColor[index % shadColor.length],
      };
    };

    const scale = useSharedValue(1);

    const pressableStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withSpring(scale.value) }],
      };
    });

    // Get the background color (from props or dynamically)
    const shadowColor = shColor ?? getBgColor(item.id).shadowColor;
    const backgroundColor = bgColor ?? getBgColor(item.id).bgColor;

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
                scale.value = 0.85;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              onPressOut={() => {
                scale.value = 1;
                handleClick();
              }}
              style={[
                styles.pressable,
                {
                  shadowColor: shadowColor,
                  backgroundColor: backgroundColor,
                },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 20,
                  color: theme === "light" ? "#1C274C" : "#1C274C",
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
              {createArray(item.stars).map((_, index) => {
                return (
                  <StarIcon
                    key={index}
                    fill={theme === "light" ? "#1C274C" : "#e8ae4a"}
                    style={{
                      width: 20,
                      height: 20,
                      marginHorizontal: 2,
                    }}
                  />
                );
              })}
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
    width: 85,
    height: 85,
    display: "flex",
    borderRadius: 15,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Adjusting shadow properties to make it more visible
    shadowOffset: {
      width: 4,
      height: 10, // Increase the vertical shadow offset
    },
    shadowOpacity: 0.5, // Increased opacity to make the shadow darker and more visible
    shadowRadius: 8, // Increased blur radius for a softer but more noticeable shadow
    elevation: 7, // Increased elevation for Android to enhance shadow visibility
  },
});

export default ListItem;
