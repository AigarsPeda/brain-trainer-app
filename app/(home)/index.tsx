import AnimatedFlatList from "@/components/AnimatedFlatList";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { GemModal } from "@/components/GemModal";
import ListItem from "@/components/ListItem";
import { LivesModal } from "@/components/LivesModal";
import { StreakBonusModal } from "@/components/StreakBonusModal";
import { StreakBonusSheet } from "@/components/StreakBonusSheet";
import { UserStatistics } from "@/components/UserStatistics";
import { LevelBackgrounds } from "@/constants/Colors";
import {
  ANDROID_TOP_PADDING,
  BONUS_MODAL_DELAY_MS,
  LIST_BOTTOM_PADDING,
  StreakBonusConfig,
  ZIGZAG_CYCLE_LENGTH,
  ZIGZAG_PEAK,
} from "@/constants/GameSettings";
import { TaskInfoType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { findNextUnclaimedBonus } from "@/utils/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ModalType = "gems" | "lives" | "streak" | null;

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const { loaded, showAdForReward } = useGoogleAd();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [pendingStreakBonus, setPendingStreakBonus] = useState<StreakBonusConfig | null>(null);
  const [gemAnimationStartValue, setGemAnimationStartValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    const unclaimed = findNextUnclaimedBonus(state.daysInARow, state.claimedStreakBonuses);
    if (unclaimed) {
      setPendingStreakBonus(unclaimed);
    }
  }, [state.daysInARow, state.claimedStreakBonuses]);

  const handleClaimStreakBonus = () => {
    if (pendingStreakBonus) {
      dispatch({ type: "CLAIM_STREAK_BONUS", payload: pendingStreakBonus.day });
      setPendingStreakBonus(null);
      const nextUnclaimed = findNextUnclaimedBonus(
        state.daysInARow,
        state.claimedStreakBonuses,
        pendingStreakBonus.day
      );
      if (nextUnclaimed) {
        setTimeout(() => setPendingStreakBonus(nextUnclaimed), BONUS_MODAL_DELAY_MS);
      }
    }
  };

  const handleWatchAdForLife = () => {
    showAdForReward(
      () => {
        dispatch({ type: "RESTORE_LIFE_FROM_AD" });
      },
      () => {
        setOpenModal(null);
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

  const closeGemModal = () => {
    setOpenModal(null);
    setShowGemAnimation(false);
    setGemAnimationStartValue(undefined);
  };

  const backgroundColors = useMemo(
    () => (state.theme === "dark" ? LevelBackgrounds.home.dark : LevelBackgrounds.home.light),
    [state.theme]
  );

  const getPosition = useCallback((index: number) => {
    const isPositive = index % ZIGZAG_CYCLE_LENGTH <= ZIGZAG_PEAK;
    return isPositive ? index % ZIGZAG_CYCLE_LENGTH : ZIGZAG_CYCLE_LENGTH - (index % ZIGZAG_CYCLE_LENGTH);
  }, []);

  const theme = state.theme ?? "light";

  const initialScrollIndex = useMemo(() => {
    if (!state.levels) return 0;
    const firstLockedIndex = state.levels.findIndex((l) => l.isLevelLocked);
    if (firstLockedIndex <= 0) return 0;
    return firstLockedIndex - 1;
  }, [state.levels]);

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
      colors={backgroundColors}
      style={{ flex: 1, paddingTop: Platform.OS === "android" ? ANDROID_TOP_PADDING : 0 }}
    >
      <BackgroundPattern />
      <StreakBonusModal
        bonus={pendingStreakBonus}
        visible={pendingStreakBonus !== null}
        onClaim={handleClaimStreakBonus}
      />
      <LivesModal
        adLoaded={loaded}
        lives={state.lives}
        visible={openModal === "lives"}
        onWatchAd={handleWatchAdForLife}
        onClose={() => setOpenModal(null)}
        lastLifeLostAt={state.lastLifeLostAt}
      />
      <StreakBonusSheet
        daysInARow={state.daysInARow}
        visible={openModal === "streak"}
        claimedBonuses={state.claimedStreakBonuses}
        onClose={() => setOpenModal(null)}
      />
      <GemModal
        adLoaded={loaded}
        currentGems={state.gems}
        visible={openModal === "gems"}
        onWatchAd={handleWatchAdForGems}
        showAnimation={showGemAnimation}
        onClose={closeGemModal}
        animationStartValue={gemAnimationStartValue}
      />
      <SafeAreaView>
        <UserStatistics
          onLivesPress={() => setOpenModal("lives")}
          onGemsPress={() => setOpenModal("gems")}
          onStreakPress={() => setOpenModal("streak")}
        />

        <AnimatedFlatList
          paddingTop={0}
          data={state.levels}
          renderItem={renderItem}
          paddingBottom={LIST_BOTTOM_PADDING}
          initialScrollIndex={initialScrollIndex}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
