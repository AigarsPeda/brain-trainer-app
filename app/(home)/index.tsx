import AnimatedFlatList from "@/components/AnimatedFlatList";
import ListItem from "@/components/ListItem";
import { LivesModal } from "@/components/LivesModal";
import { ThemedView } from "@/components/ThemedView";
import { UserStatistics } from "@/components/UserStatistics";
import { TaskInfoType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const { loaded, showAdForReward } = useGoogleAd();
  const [isLivesModalVisible, setIsLivesModalVisible] = useState(false);

  const handleWatchAd = () => {
    showAdForReward(() => {
      dispatch({ type: "RESTORE_LIFE_FROM_AD" });
      setIsLivesModalVisible(false);
    });
  };

  const handleOpenLivesModalClose = () => {
    setIsLivesModalVisible((state) => !state);
  };

  return (
    <ThemedView style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}>
      <LivesModal
        adLoaded={loaded}
        lives={state.lives}
        onWatchAd={handleWatchAd}
        visible={isLivesModalVisible}
        lastLifeLostAt={state.lastLifeLostAt}
        onClose={handleOpenLivesModalClose}
      />
      <SafeAreaView>
        <UserStatistics onLivesPress={handleOpenLivesModalClose} />

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
