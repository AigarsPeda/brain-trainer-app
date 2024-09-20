import type { TaskInfoType } from "@/data/common";
import * as Haptics from "expo-haptics";
import { type FC, memo } from "react";
import { Pressable, StyleSheet, ViewToken } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

type ListItemProps = {
  bgColor?: string;
  item: TaskInfoType;
  handleClick: () => void;
  viewableItems: SharedValue<ViewToken[]>;
};

const ListItem: FC<ListItemProps> = memo(
  ({ item, handleClick, viewableItems, bgColor }) => {
    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter((item) => item.isViewable)
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
    }, []);

    return (
      <Animated.View style={[styles.listItem, rStyle]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleClick();
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: 15,
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor || "#78CAD2",
          }}
        >
          <ThemedText type="title">{item?.title}</ThemedText>
          <ThemedText
            style={{
              right: -10,
              opacity: 0.5,
              fontSize: 125,
              lineHeight: 155,
              fontWeight: "bold",
              position: "absolute",
            }}
          >
            {item?.id + 1}
          </ThemedText>
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  listItem: {
    height: 80,
    width: "90%",
    marginTop: 20,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListItem;
