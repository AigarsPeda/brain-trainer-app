import React from "react";
import { StyleSheet, ViewToken } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

type ListItemProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  item: {
    id: number;
  };
};

const ListItem: React.FC<ListItemProps> = React.memo(
  ({ item, viewableItems }) => {
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
        <ThemedText type="link">{item?.id}</ThemedText>
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
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#78CAD2",
  },
});

export default ListItem;
