import { type FC, memo } from "react";
import { Button, Pressable, StyleSheet, ViewToken } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import * as Haptics from "expo-haptics";
import { TaskInfoType } from "../data/common";

type LastListItemProps = {
  bgColor?: string;
  item: TaskInfoType;
  handleClick: () => void;
  viewableItems: SharedValue<ViewToken[]>;
};

const LastListItem: FC<LastListItemProps> = memo(
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
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor || "#78CAD2",
          }}
        >
          <ThemedText type="link">{item?.title}</ThemedText>
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

export default LastListItem;
