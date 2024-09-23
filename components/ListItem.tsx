import StarIcon from "@/components/icons/Star";
import { ThemedText } from "@/components/ThemedText";
import type { TaskInfoType } from "@/data/common";
import { useThemeColor } from "@/hooks/useThemeColor";
import createArray from "@/util/createArray";
import * as Haptics from "expo-haptics";
import { type FC, memo } from "react";
import { Pressable, StyleSheet, View, ViewToken } from "react-native";
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
  item: TaskInfoType;
  handleClick: () => void;
  viewableItems: SharedValue<ViewToken[]>;
};

const ListItem: FC<ListItemProps> = memo(
  ({ item, handleClick, viewableItems, bgColor, shColor }) => {
    const color = useThemeColor({}, "cardBgColor");
    const shadColor = useThemeColor({}, "cardShadowColors");

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
      //   return color[index % color.length];
      return {
        bgColor: color[index % color.length],
        shadowColor: shadColor[index % shadColor.length],
      };
    };

    // Adding press animation for scaling and shadow effect
    const scale = useSharedValue(1);
    // const shadowOpacity = useSharedValue(0.2);

    const pressableStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withSpring(scale.value) }],
        // shadowOpacity: shadowOpacity.value,
      };
    });

    // Get the background color (from props or dynamically)
    const shadowColor = shColor ?? getBgColor(item.id).shadowColor;
    const backgroundColor = bgColor ?? getBgColor(item.id).bgColor;

    return (
      <Animated.View style={[styles.listItem, rStyle]}>
        <Animated.View style={[pressableStyle]}>
          <View
            style={{
              flexDirection: "column",
              // justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: "100%",
              display: "flex",
              padding: 10,
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
              <ThemedText>{item?.id}</ThemedText>
            </Pressable>
            {/* <Ionicons name="star" size={22} color="green" /> */}
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
                    fill="#1C274C"
                    // stroke="#1C274C"
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
    height: 120,
    width: "90%",
    marginTop: 20,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
  },
  pressable: {
    width: 68,
    height: 68,
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
