import AnimatedFlatList from "@/components/AnimatedFlatList";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserStatistics } from "@/components/UserStatistics";
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

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView>
        <UserStatistics />
        <ThemedView
          style={{
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText type="subtitle">Is Ad loaded: {loaded ? "Yes" : "No"}</ThemedText>
          <Button title="Show ad" onPress={() => rewarded.show()} />
        </ThemedView>

        <AnimatedFlatList
          paddingTop={0}
          paddingBottom={150}
          data={state.levels}
          renderItem={({ item, index, viewableItems }) => {
            return renderItem({ item, index, viewableItems });
          }}
        />
      </SafeAreaView>
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

  return (
    <ListItem
      item={item}
      position={number}
      viewableItems={viewableItems}
      handleClick={() => {
        router.push({ pathname: "/game/[level]", params: { level: index + 1 } });
      }}
    />
  );
};
