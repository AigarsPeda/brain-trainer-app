import AnimatedFlatList from "@/components/AnimatedFlatList";
import HeartIcon from "@/components/icons/HeartIcon";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TaskInfoType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { router } from "expo-router";
import { Button, ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { state } = useAppContext();
  const { isRewarded, loaded, rewarded } = useGoogleAd();
  // state.completedLevels.reduce((acc, level) => Math.max(acc, level), 0);

  // find largest level number in state.completedLevels
  // const maxLevel = state.completedLevels.reduce(
  //   (acc, level) => Math.max(acc, level.level),
  //   0
  // );

  // console.log("maxLevel", maxLevel);

  return (
    <ThemedView>
      <SafeAreaView
        style={{
          gap: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title">{state.name}</ThemedText>
        <HeartIcon stroke={"#ff0000"} />
        <HeartIcon stroke={"#ff0000"} />
        <HeartIcon stroke={"#ff0000"} />
      </SafeAreaView>
      <ThemedView
        style={{
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="subtitle">
          Is Ad loaded: {loaded ? "Yes" : "No"}
        </ThemedText>
        <Button title="Show ad" onPress={() => rewarded.show()} />
      </ThemedView>
      <AnimatedFlatList
        paddingTop={0}
        paddingBottom={150}
        data={state.taskInfos}
        renderItem={({ item, index, viewableItems }) => {
          return renderItem({ item, index, viewableItems });
        }}
      />
    </ThemedView>
  );
}

const renderItem = ({
  item,
  index,
  viewableItems,
}: {
  index: number;
  item: TaskInfoType;
  viewableItems: SharedValue<ViewToken[]>;
}) => {
  const isPositive = index % 6 <= 3;
  // move position from 0 to 3 and then back from 3 to 0 and do it again and again
  const number = isPositive ? index % 6 : 6 - (index % 6);
  // skew angle for the item
  const skewAngle = isPositive ? number * 5 : -number * 5;

  return (
    <ListItem
      item={item}
      position={number}
      // isDisabled={isDisabled}
      skewAngle={number === 3 ? 0 : skewAngle}
      viewableItems={viewableItems}
      handleClick={() => {
        router.push({ pathname: "/GameScreen", params: { level: index + 1 } });
      }}
    />
  );
};
