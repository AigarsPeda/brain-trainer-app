import AnimatedFlatList, { AnimatedFlatListRef } from "@/components/AnimatedFlatList";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { GemModal } from "@/components/GemModal";
import ListItem from "@/components/ListItem";
import { LivesModal } from "@/components/LivesModal";
import { ScrollToTaskButton } from "@/components/ScrollToTaskButton";
import { StreakBonusModal } from "@/components/StreakBonusModal";
import { StreakBonusSheet } from "@/components/StreakBonusSheet";
import { TaskAchievementModal } from "@/components/TaskAchievementModal";
import { UserStatistics } from "@/components/UserStatistics";
import { LevelBackgrounds } from "@/constants/Colors";
import {
  ANDROID_TOP_PADDING,
  BONUS_MODAL_DELAY_MS,
  LIST_BOTTOM_PADDING,
  StreakBonusConfig,
  TaskAchievementConfig,
  ZIGZAG_CYCLE_LENGTH,
  ZIGZAG_PEAK,
} from "@/constants/GameSettings";
import { TaskInfoType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { findNextUnclaimedBonus, findNextUnclaimedTaskAchievement } from "@/utils/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const DEBOUNCE_DELAY_MS = 150;
const VISIBILITY_THRESHOLD = 3;

type ModalType = "gems" | "lives" | "streak" | null;

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const { loaded, showAdForReward } = useGoogleAd();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [arrowDirection, setArrowDirection] = useState<"up" | "down">("down");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingStreakBonus, setPendingStreakBonus] = useState<StreakBonusConfig | null>(null);
  const [pendingTaskAchievement, setPendingTaskAchievement] = useState<TaskAchievementConfig | null>(null);
  const [gemAnimationStartValue, setGemAnimationStartValue] = useState<number | undefined>(undefined);

  const flatListRef = useRef<AnimatedFlatListRef>(null);

  const totalCompletedLevels = useMemo(
    () => state.levels.filter((l) => l.isLevelCompleted).length,
    [state.levels]
  );

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

  const handleClaimTaskAchievement = () => {
    if (pendingTaskAchievement) {
      dispatch({ type: "CLAIM_TASK_ACHIEVEMENT", payload: pendingTaskAchievement.taskCount });
      setPendingTaskAchievement(null);
      const nextUnclaimed = findNextUnclaimedTaskAchievement(
        totalCompletedLevels,
        state.claimedTaskAchievements,
        pendingTaskAchievement.taskCount
      );
      if (nextUnclaimed) {
        setTimeout(() => setPendingTaskAchievement(nextUnclaimed), BONUS_MODAL_DELAY_MS);
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

  const lastAvailableTaskIndex = useMemo(() => {
    if (!state.levels) return -1;
    const firstLockedIndex = state.levels.findIndex((l) => l.isLevelLocked);
    if (firstLockedIndex <= 0) return state.levels.length - 1;
    return firstLockedIndex - 1;
  }, [state.levels]);

  const handleScrollToLastTask = useCallback(() => {
    if (lastAvailableTaskIndex >= 0) {
      flatListRef.current?.scrollToIndex(lastAvailableTaskIndex);
    }
  }, [lastAvailableTaskIndex]);

  const handleViewableItemsChanged = useCallback(
    (viewableItems: { index: number | null }[]) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (lastAvailableTaskIndex < 0 || viewableItems.length === 0) {
          setShowScrollButton(false);
          return;
        }

        const isLastTaskVisible = viewableItems.some((item) => item.index === lastAvailableTaskIndex);

        if (isLastTaskVisible) {
          setShowScrollButton(false);
          return;
        }

        const visibleIndices = viewableItems
          .map((item) => item.index)
          .filter((index): index is number => index !== null);

        if (visibleIndices.length === 0) {
          setShowScrollButton(false);
          return;
        }

        const firstVisibleIndex = Math.min(...visibleIndices);
        const lastVisibleIndex = Math.max(...visibleIndices);

        let shouldShowButton = false;
        let direction: "up" | "down" = "down";

        if (lastAvailableTaskIndex < firstVisibleIndex) {
          const distance = firstVisibleIndex - lastAvailableTaskIndex;
          if (distance >= VISIBILITY_THRESHOLD) {
            shouldShowButton = true;
            direction = "up";
          }
        } else if (lastAvailableTaskIndex > lastVisibleIndex) {
          const distance = lastAvailableTaskIndex - lastVisibleIndex;
          if (distance >= VISIBILITY_THRESHOLD) {
            shouldShowButton = true;
            direction = "down";
          }
        }

        setArrowDirection(direction);
        setShowScrollButton(shouldShowButton);
      }, DEBOUNCE_DELAY_MS);
    },
    [lastAvailableTaskIndex]
  );

  useEffect(() => {
    const unclaimed = findNextUnclaimedBonus(state.daysInARow, state.claimedStreakBonuses);
    if (unclaimed) {
      setPendingStreakBonus(unclaimed);
    }
  }, [state.daysInARow, state.claimedStreakBonuses]);

  useEffect(() => {
    const unclaimed = findNextUnclaimedTaskAchievement(totalCompletedLevels, state.claimedTaskAchievements);
    if (unclaimed) {
      setPendingTaskAchievement(unclaimed);
    }
  }, [totalCompletedLevels, state.claimedTaskAchievements]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
        onClaim={handleClaimStreakBonus}
        visible={pendingStreakBonus !== null}
      />
      <TaskAchievementModal
        achievement={pendingTaskAchievement}
        onClaim={handleClaimTaskAchievement}
        visible={pendingTaskAchievement !== null}
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
        onClose={() => setOpenModal(null)}
        claimedBonuses={state.claimedStreakBonuses}
        totalCompletedLevels={totalCompletedLevels}
        claimedTaskAchievements={state.claimedTaskAchievements}
        streakBonusClaimDates={state.streakBonusClaimDates}
        taskAchievementClaimDates={state.taskAchievementClaimDates}
      />
      <GemModal
        adLoaded={loaded}
        onClose={closeGemModal}
        currentGems={state.gems}
        visible={openModal === "gems"}
        onWatchAd={handleWatchAdForGems}
        showAnimation={showGemAnimation}
        animationStartValue={gemAnimationStartValue}
      />
      <SafeAreaView>
        <UserStatistics
          onGemsPress={() => setOpenModal("gems")}
          onLivesPress={() => setOpenModal("lives")}
          onStreakPress={() => setOpenModal("streak")}
        />

        <AnimatedFlatList
          ref={flatListRef}
          paddingTop={0}
          data={state.levels}
          renderItem={renderItem}
          paddingBottom={LIST_BOTTOM_PADDING}
          initialScrollIndex={initialScrollIndex}
          onViewableItemsChanged={handleViewableItemsChanged}
        />

        <ScrollToTaskButton visible={showScrollButton} direction={arrowDirection} onPress={handleScrollToLastTask} />
      </SafeAreaView>
    </LinearGradient>
  );
}
