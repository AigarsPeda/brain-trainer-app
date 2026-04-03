import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { BossTimerBar } from "@/components/BossTimerBar";
import { BossTimerModal } from "@/components/BossTimerModal";
import { HelpModal } from "@/components/HelpModal";
import { HintModal } from "@/components/HintModal";
import { InfoModal } from "@/components/InfoModal";
import { LivesModal } from "@/components/LivesModal";
import { CreateMathTask } from "@/components/mathTasks/CreateMathTask";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import { TextTask } from "@/components/mathTasks/TextTask";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTaskBackground } from "@/constants/Colors";
import { BOSS_EXTRA_TIME_COST, BOSS_RETRY_COST } from "@/constants/GameSettings";
import {
  getLevelSelectionState,
  isCreateMathTask,
  isMultiAnswerMathTask,
  isTextTask,
} from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useBossLevelFlow } from "@/hooks/useBossLevelFlow";
import useGoogleAd from "@/hooks/useGoogleAd";
import { useLevelData } from "@/hooks/useLevelData";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { useTaskHelpActions } from "@/hooks/useTaskHelpActions";
import { formatBossTimer, isBossLevel } from "@/utils/bossLevel";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ADDITIONAL_TOP_PADDING = 12;

type ModalType = "help" | "hint" | "info" | "lives" | "bossTimer" | null;

export default function GameLevelScreen() {
  const {
    state: {
      gems,
      lives,
      theme,
      levels,
      results,
      lastAttemptedBossLevel,
      bossRetryAvailableAt,
      lastLifeLostAt,
      game: { currentLevel, currentTaskInLevel },
    },
    dispatch,
    getTaskExplanation,
  } = useAppContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const livesAnimation = usePulseOnChange(lives);
  const { loaded, showAdForReward } = useGoogleAd();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [removedAnswerIds, setRemovedAnswerIds] = useState<number[]>([]);
  const { level } = useLocalSearchParams<{ level?: string | string[] }>();
  const levelParam = Array.isArray(level) ? level[0] : level;
  const levelNumber = Number(levelParam);
  const hasValidLevelNumber = Boolean(levelParam) && Number.isInteger(levelNumber) && levelNumber > 0;
  const [showTextTaskAsMultipleChoice, setShowTextTaskAsMultipleChoice] = useState(false);
  const hasRenderedInitialTaskRef = useRef(false);
  const levelStartedAtRef = useRef<number | null>(null);
  const levelSelection = useMemo(() => {
    if (!hasValidLevelNumber) {
      return null;
    }

    return getLevelSelectionState(
      {
        levels,
        results,
        game: { currentLevel, currentTaskInLevel },
      },
      levelNumber
    );
  }, [currentLevel, currentTaskInLevel, hasValidLevelNumber, levelNumber, levels, results]);
  const effectiveTaskInLevel = levelSelection?.currentTaskInLevel ?? currentTaskInLevel;
  const { levelTasks, currentTask, maxLevelStep } = useLevelData(
    hasValidLevelNumber ? levelNumber : null,
    effectiveTaskInLevel
  );
  const [gemAnimationStartValue, setGemAnimationStartValue] = useState<number | undefined>(undefined);
  const bossLevel = hasValidLevelNumber && isBossLevel(levelNumber);
  const currentLevelResultsCount = levelSelection?.levelResultsCount ?? 0;
  const isCurrentBossRetryLevel = bossLevel && lastAttemptedBossLevel === levelNumber;
  const hasBossRetryState = isCurrentBossRetryLevel && bossRetryAvailableAt !== null;
  const hasActiveBossRetryCooldown = hasBossRetryState && bossRetryAvailableAt > Date.now();
  const canRetryBossForFree = hasBossRetryState && bossRetryAvailableAt <= Date.now();
  const isCurrentBossCompleted = levelSelection?.isLevelCompleted ?? false;
  const isBossTimerModalOpen = openModal === "bossTimer";

  const resetTaskUiState = useCallback(() => {
    setRemovedAnswerIds([]);
    setShowTextTaskAsMultipleChoice(false);
  }, []);

  const showBossTimerModal = useCallback(() => {
    setOpenModal("bossTimer");
  }, []);

  const hideBossTimerModal = useCallback(() => {
    setOpenModal((currentOpenModal) => (currentOpenModal === "bossTimer" ? null : currentOpenModal));
  }, []);

  const markLevelStarted = useCallback(() => {
    levelStartedAtRef.current = Date.now();
  }, []);

  const {
    bossModalMode,
    bossRetryWaitRemainingMs,
    bossTimerExpired,
    bossTimerProgress,
    bossTimerStarted,
    bossTimeLeftMs,
    handleBossFailure,
    handleBossInteraction,
    handleBossRetryRequest,
    handleBuyBossExtraTime,
    handleBuyBossRetry,
    handleRestartBoss,
    openBossModal,
    resetBossRunState,
    setBossModalMode,
  } = useBossLevelFlow({
    bossLevel,
    levelNumber,
    gems,
    currentTaskExists: Boolean(currentTask),
    bossRetryAvailableAt,
    hasBossRetryState,
    hasActiveBossRetryCooldown,
    canRetryBossForFree,
    isCurrentBossCompleted,
    isCurrentLevel: levelSelection?.isCurrentLevel ?? false,
    isBossTimerModalOpen,
    dispatch,
    resetTaskUiState,
    onLevelRestarted: markLevelStarted,
    showBossTimerModal,
    hideBossTimerModal,
  });

  useEffect(() => {
    if (!hasValidLevelNumber) {
      return;
    }

    dispatch({
      type: "SELECT_LEVEL",
      payload: { level: levelNumber },
    });
  }, [dispatch, hasValidLevelNumber, levelNumber]);

  const isFinalTaskInLevel = currentTask?.taskNumberInLevel === maxLevelStep;

  useEffect(() => {
    if (!currentTask) {
      return;
    }

    resetTaskUiState();
  }, [currentTask, levelNumber, resetTaskUiState]);

  useEffect(() => {
    hasRenderedInitialTaskRef.current = true;
  }, []);

  useEffect(() => {
    if (!currentTask || !hasValidLevelNumber) {
      return;
    }

    if (effectiveTaskInLevel === 1 && currentLevelResultsCount === 0) {
      markLevelStarted();
      if (bossLevel) {
        resetBossRunState(true);
      }
    }
  }, [
    bossLevel,
    currentLevelResultsCount,
    currentTask,
    effectiveTaskInLevel,
    hasValidLevelNumber,
    markLevelStarted,
    resetBossRunState,
  ]);

  const getLevelCompletionDurationMs = useCallback(() => {
    if (!levelStartedAtRef.current) {
      return 0;
    }

    return Date.now() - levelStartedAtRef.current;
  }, []);

  const { canRemoveAnswer, handlePurchaseHint, handleRemoveWrongAnswer } = useTaskHelpActions({
    bossLevel,
    currentTask,
    dispatch,
    removedAnswerIds,
    setRemovedAnswerIds,
    setShowTextTaskAsMultipleChoice,
    showTextTaskAsMultipleChoice,
    openHintModal: () => setOpenModal("hint"),
  });

  const backgroundColors = useMemo(() => {
    if (bossLevel) {
      return getTaskBackground("boss", theme);
    }

    const taskType = currentTask?.taskType ?? "home";
    return getTaskBackground(taskType as "mathTaskWithResult" | "createMathTask" | "textTask", theme);
  }, [bossLevel, currentTask?.taskType, theme]);

  const currentTaskExplanation = useMemo(() => {
    if (!currentTask) {
      return null;
    }
    return getTaskExplanation(currentTask);
  }, [currentTask, getTaskExplanation]);

  const enteringTaskAnimation = hasRenderedInitialTaskRef.current
    ? SlideInRight.duration(250).withInitialValues({ transform: [{ translateX: 250 }] })
    : undefined;

  const closeHelpModal = () => {
    setOpenModal(null);
    setShowGemAnimation(false);
    setGemAnimationStartValue(undefined);
  };

  const handleWatchAd = () => {
    showAdForReward(() => {
      dispatch({ type: "RESTORE_LIFE_FROM_AD" });
    });
  };

  const handleWatchAdForGems = () => {
    setGemAnimationStartValue(gems);
    let rewardEarned = false;

    showAdForReward(
      () => {
        rewardEarned = true;
      },
      () => {
        if (rewardEarned) {
          dispatch({ type: "ADD_GEMS_FROM_AD" });
          setShowGemAnimation(true);
          setBossModalMode((currentMode) =>
            currentMode === "expired" || currentMode === "retry" ? "retry" : currentMode
          );
        }
      }
    );
  };

  const handleGoHome = useCallback(() => {
    setOpenModal(null);
    router.replace("/");
  }, [router]);

  if (!levelParam || !hasValidLevelNumber) {
    return (
      <ThemedView>
        <ThemedText>Nav atrasts līmenis</ThemedText>
      </ThemedView>
    );
  }

  if (!levelTasks || levelTasks.length === 0) {
    return (
      <ThemedView>
        <ThemedText>Nav uzdevumu</ThemedText>
      </ThemedView>
    );
  }

  if (!currentTask) {
    return (
      <ThemedView>
        <ThemedText>Nav atrasts uzdevums</ThemedText>
      </ThemedView>
    );
  }

  return (
    <LinearGradient end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} colors={[...backgroundColors]} style={styles.gradient}>
      <BackgroundPattern />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <InfoModal visible={openModal === "info"} onClose={() => setOpenModal(null)} />
      <LivesModal
        lives={lives}
        adLoaded={loaded}
        onWatchAd={handleWatchAd}
        visible={openModal === "lives"}
        lastLifeLostAt={lastLifeLostAt}
        onClose={() => setOpenModal(null)}
      />
      <HelpModal
        adLoaded={loaded}
        currentGems={gems}
        onClose={closeHelpModal}
        visible={!bossLevel && openModal === "help"}
        showAnimation={showGemAnimation}
        canRemoveAnswer={canRemoveAnswer}
        onPurchaseHint={handlePurchaseHint}
        onWatchAdForGems={handleWatchAdForGems}
        animationStartValue={gemAnimationStartValue}
        onRemoveWrongAnswer={handleRemoveWrongAnswer}
      />
      <HintModal
        visible={!bossLevel && openModal === "hint"}
        onClose={() => setOpenModal(null)}
        explanation={currentTaskExplanation}
      />
      <BossTimerModal
        visible={bossLevel && openModal === "bossTimer"}
        adLoaded={loaded}
        currentGems={gems}
        timeLeftMs={bossTimeLeftMs}
        extraTimeCost={BOSS_EXTRA_TIME_COST}
        retryCost={BOSS_RETRY_COST}
        mode={bossModalMode}
        hasStarted={bossTimerStarted}
        hasExpired={bossTimerExpired}
        canRetryForFree={canRetryBossForFree}
        retryWaitRemainingMs={bossRetryWaitRemainingMs}
        onBuyTime={handleBuyBossExtraTime}
        onBuyRetry={handleBuyBossRetry}
        onWatchAdForGems={handleWatchAdForGems}
        onRetry={handleRestartBoss}
        onGoHome={handleGoHome}
        onClose={() => setOpenModal(null)}
      />
      <View
        style={{
          ...styles.itemsWrap,
          paddingTop: styles.itemsWrap.paddingTop + insets.top + ADDITIONAL_TOP_PADDING,
          paddingBottom: styles.itemsWrap.paddingBottom + insets.bottom,
        }}
      >
        <View style={[styles.view, bossLevel && styles.bossHeaderRow]}>
          <StatisticsItem
            src={Close}
            onPress={() => {
              router.back();
            }}
          />
          {bossLevel ? (
            <BossTimerBar
              timeLabel={formatBossTimer(bossTimeLeftMs)}
              progress={bossTimerProgress}
              onPress={openBossModal}
            />
          ) : (
            <Progressbar maxLevelStep={maxLevelStep} currentLevelStep={effectiveTaskInLevel} />
          )}
          {!bossLevel && (
            <StatisticsItem
              src={Heart}
              stat={lives}
              animation={livesAnimation}
              size={styles.statisticsItem}
              onPress={() => setOpenModal("lives")}
            />
          )}
        </View>
        {bossLevel ? (
          <View style={styles.bossNoticeRow}>
            <ThemedText style={styles.bossNoticeText} type="subtitle">
              {bossTimerStarted
                ? "Boss līmenis: laiks iet, kļūdīties nedrīkst"
                : "Boss līmenis: taimeris sāksies pēc pirmās atbildes"}
            </ThemedText>
          </View>
        ) : (
          <Pressable style={styles.hintRow} onPress={() => setOpenModal("help")}>
            <ThemedText style={styles.hintEmoji}>💎</ThemedText>
            <ThemedText style={styles.hintText} type="subtitle">
              Palīdzība
            </ThemedText>
          </Pressable>
        )}
        <View style={styles.levelView}>
          <Animated.View
            key={`${level}-${currentTask.id}-${currentTask.taskNumberInLevel}`}
            style={styles.taskContainer}
            entering={enteringTaskAnimation}
            exiting={SlideOutLeft.duration(200).withInitialValues({
              transform: [{ translateX: 0 }],
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            })}
          >
            {isMultiAnswerMathTask(currentTask) && (
              <MathTaskWithResult
                level={levelParam}
                task={currentTask}
                maxLevelStep={maxLevelStep}
                removedAnswerIds={removedAnswerIds}
                isFinalTaskInLevel={isFinalTaskInLevel}
                getLevelCompletionDurationMs={getLevelCompletionDurationMs}
                isBossLevel={bossLevel}
                onBossInteraction={handleBossInteraction}
                onBossFailure={handleBossFailure}
                onBossRetryRequest={handleBossRetryRequest}
              />
            )}
            {isCreateMathTask(currentTask) && (
              <CreateMathTask
                level={levelParam}
                task={currentTask}
                maxLevelStep={maxLevelStep}
                removedAnswerIds={removedAnswerIds}
                isFinalTaskInLevel={isFinalTaskInLevel}
                getLevelCompletionDurationMs={getLevelCompletionDurationMs}
                isBossLevel={bossLevel}
                onBossInteraction={handleBossInteraction}
                onBossFailure={handleBossFailure}
                onBossRetryRequest={handleBossRetryRequest}
              />
            )}
            {isTextTask(currentTask) && (
              <TextTask
                level={levelParam}
                task={currentTask}
                maxLevelStep={maxLevelStep}
                removedAnswerIds={removedAnswerIds}
                isFinalTaskInLevel={isFinalTaskInLevel}
                showAsMultipleChoice={showTextTaskAsMultipleChoice}
                getLevelCompletionDurationMs={getLevelCompletionDurationMs}
                isBossLevel={bossLevel}
                onBossInteraction={handleBossInteraction}
                onBossFailure={handleBossFailure}
                onBossRetryRequest={handleBossRetryRequest}
              />
            )}
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  itemsWrap: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 25,
  },
  view: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  bossHeaderRow: {
    gap: 2,
    justifyContent: "flex-start",
  },
  statisticsItem: {
    width: 36,
    height: 36,
  },
  levelView: {
    flex: 1,
    paddingTop: 10,
  },
  taskContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  hintEmoji: {
    fontSize: 18,
  },
  hintText: {
    fontSize: 14,
    opacity: 0.8,
  },
  bossNoticeRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  bossNoticeText: {
    fontSize: 14,
    opacity: 0.9,
    color: "#FFF7D6",
  },
});
