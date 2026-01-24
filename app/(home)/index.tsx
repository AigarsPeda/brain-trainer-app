import AnimatedFlatList from "@/components/AnimatedFlatList";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { GemModal } from "@/components/GemModal";
import ListItem from "@/components/ListItem";
import { LivesModal } from "@/components/LivesModal";
import { UserStatistics } from "@/components/UserStatistics";
import { LevelBackgrounds } from "@/constants/Colors";
import { TaskInfoType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const { loaded, showAdForReward } = useGoogleAd();
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [isGemModalVisible, setIsGemModalVisible] = useState(false);
  const [isLivesModalVisible, setIsLivesModalVisible] = useState(false);
  const [gemAnimationStartValue, setGemAnimationStartValue] = useState<number | undefined>(undefined);

  const handleWatchAdForLife = () => {
    showAdForReward(
      () => {
        dispatch({ type: "RESTORE_LIFE_FROM_AD" });
      },
      () => {
        setIsLivesModalVisible(false);
      }
    );
  };

  const handleWatchAdForGems = () => {
    setGemAnimationStartValue(state.gems);
    let rewardEarned = false;

    showAdForReward(
      () => {
        rewardEarned = true;
      },
      () => {
        if (rewardEarned) {
          dispatch({ type: "ADD_GEMS_FROM_AD" });
          setShowGemAnimation(true);
        }
      }
    );
  };

  const handleOpenLivesModalClose = () => {
    setIsLivesModalVisible((state) => !state);
  };

  const handleOpenGemsModalClose = () => {
    setIsGemModalVisible((state) => !state);
    setShowGemAnimation(false);
    setGemAnimationStartValue(undefined);
  };

  // Memoize background colors based on theme
  const backgroundColors = useMemo(
    () => (state.theme === "dark" ? LevelBackgrounds.home.dark : LevelBackgrounds.home.light),
    [state.theme]
  );

  // Calculate position for zigzag pattern (0-3-0 pattern)
  const getPosition = useCallback((index: number) => {
    const isPositive = index % 6 <= 3;
    return isPositive ? index % 6 : 6 - (index % 6);
  }, []);

  // Memoize theme to avoid inline reference changes
  const theme = state.theme ?? "light";

  // Memoize renderItem to prevent unnecessary re-renders
  const renderItem = useCallback(
    ({ item, index, scrollY }: { item: TaskInfoType; index: number; scrollY: SharedValue<number> }) => {
      return (
        <ListItem
          item={item}
          index={index}
          theme={theme}
          scrollY={scrollY}
          position={getPosition(index)}
          handleClick={() => {
            router.push({ pathname: "/game/[level]", params: { level: index + 1 } });
          }}
        />
      );
    },
    [getPosition, theme]
  );

  return (
    <LinearGradient
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}
      colors={backgroundColors}
    >
      <BackgroundPattern />
      <LivesModal
        adLoaded={loaded}
        lives={state.lives}
        visible={isLivesModalVisible}
        onWatchAd={handleWatchAdForLife}
        onClose={handleOpenLivesModalClose}
        lastLifeLostAt={state.lastLifeLostAt}
      />
      <GemModal
        adLoaded={loaded}
        currentGems={state.gems}
        visible={isGemModalVisible}
        onWatchAd={handleWatchAdForGems}
        showAnimation={showGemAnimation}
        onClose={handleOpenGemsModalClose}
        animationStartValue={gemAnimationStartValue}
      />
      <SafeAreaView>
        <UserStatistics onLivesPress={handleOpenLivesModalClose} onGemsPress={handleOpenGemsModalClose} />

        <AnimatedFlatList paddingTop={0} paddingBottom={150} data={state.levels} renderItem={renderItem} />
      </SafeAreaView>
    </LinearGradient>
  );
}
