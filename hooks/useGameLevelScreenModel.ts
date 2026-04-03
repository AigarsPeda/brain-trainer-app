import { TaskSession } from "@/components/mathTasks/taskSession";
import useAppContext from "@/hooks/useAppContext";
import type { BossModalMode } from "@/hooks/useBossLevelFlow";
import { useBossLevelFlow } from "@/hooks/useBossLevelFlow";
import { useGameLevelDerivedState } from "@/hooks/useGameLevelDerivedState";
import { useGameLevelRewardActions } from "@/hooks/useGameLevelRewardActions";
import { useGameLevelRouteState } from "@/hooks/useGameLevelRouteState";
import { useGameLevelCompletionTiming, useGameLevelSessionLifecycle } from "@/hooks/useGameLevelSessionLifecycle";
import { useGameLevelUiState } from "@/hooks/useGameLevelUiState";
import useGoogleAd from "@/hooks/useGoogleAd";
import { useLevelData } from "@/hooks/useLevelData";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { useTaskHelpActions } from "@/hooks/useTaskHelpActions";
import {
  type GameLevelScreenUnavailableState,
  getGameLevelScreenUnavailableState,
  useGameLevelScreenShellState,
} from "./useGameLevelScreenShellState";

export type GameLevelScreenReadyModel = {
  status: "ready";
  backgroundColors: readonly [string, string, ...string[]] | readonly string[];
  bossLevel: boolean;
  bossModalMode: BossModalMode;
  bossRetryWaitRemainingMs: number;
  bossTimeLeftMs: number;
  bossTimerExpired: boolean;
  bossTimerProgress: number;
  bossTimerStarted: boolean;
  canRemoveAnswer: boolean;
  canRetryBossForFree: boolean;
  currentGems: number;
  currentTask: NonNullable<ReturnType<typeof useLevelData>["currentTask"]>;
  currentTaskExplanation: ReturnType<typeof useAppContext>["getTaskExplanation"] extends (
    ...args: never[]
  ) => infer TResult
    ? TResult | null
    : null;
  effectiveTaskInLevel: number;
  gemAnimationStartValue?: number;
  getLevelCompletionDurationMs: () => number;
  handleBossFailure: () => void;
  handleBossInteraction: () => void;
  handleBossRetryRequest: () => void;
  handleBuyBossExtraTime: () => void;
  handleBuyBossRetry: () => void;
  handleGoBack: () => void;
  handleGoHome: () => void;
  handlePurchaseHint: () => void;
  handleRemoveWrongAnswer: () => void;
  handleWatchAd: () => void;
  handleWatchAdForGems: () => void;
  hideAllModals: () => void;
  hideHelpModal: () => void;
  isBossTimerModalOpen: boolean;
  isFinalTaskInLevel: boolean;
  itemsWrapPaddingBottom: number;
  itemsWrapPaddingTop: number;
  levelParam: string;
  lives: number;
  livesAnimation: ReturnType<typeof usePulseOnChange<number>>;
  livesModalVisible: boolean;
  helpVisible: boolean;
  hintVisible: boolean;
  infoVisible: boolean;
  lastLifeLostAt: number | null;
  loaded: boolean;
  maxLevelStep: number;
  onOpenHelp: () => void;
  onOpenLives: () => void;
  onOpenInfo: () => void;
  onOpenBossModal: () => void;
  removedAnswerIds: number[];
  taskSession: TaskSession;
  retryBoss: () => void;
  showGemAnimation: boolean;
  showHintModal: () => void;
  showTextTaskAsMultipleChoice: boolean;
  taskKey: string;
  theme: ReturnType<typeof useAppContext>["state"]["theme"];
};

export type GameLevelScreenModel = GameLevelScreenUnavailableState | GameLevelScreenReadyModel;

type BuildGameLevelScreenReadyModelArgs = Omit<GameLevelScreenReadyModel, "status">;

function buildGameLevelScreenReadyModel(args: BuildGameLevelScreenReadyModelArgs): GameLevelScreenReadyModel {
  return {
    status: "ready",
    ...args,
  };
}

export function useGameLevelScreenModel(): GameLevelScreenModel {
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
  const livesAnimation = usePulseOnChange(lives);
  const { loaded, showAdForReward } = useGoogleAd();
  const { getLevelCompletionDurationMs, markLevelStarted } = useGameLevelCompletionTiming();
  const {
    bossLevel,
    canRetryBossForFree,
    currentLevelResultsCount,
    effectiveTaskInLevel,
    hasActiveBossRetryCooldown,
    hasBossRetryState,
    hasValidLevelNumber,
    isCurrentBossCompleted,
    levelNumber,
    levelParam,
    levelSelection,
  } = useGameLevelRouteState({
    bossRetryAvailableAt,
    currentLevel,
    currentTaskInLevel,
    lastAttemptedBossLevel,
    levels,
    results,
  });
  const {
    gemAnimationStartValue,
    helpVisible,
    hideAllModals,
    hideBossTimerModal,
    hideHelpModal,
    hintVisible,
    infoVisible,
    isBossTimerModalOpen,
    livesModalVisible,
    onOpenHelp,
    onOpenInfo,
    onOpenLives,
    openHintModal,
    prepareGemRewardAnimation,
    removedAnswerIds,
    resetTaskUiState,
    setRemovedAnswerIds,
    setShowTextTaskAsMultipleChoice,
    showBossTimerModal,
    showGemAnimation,
    showGemRewardAnimation,
    showTextTaskAsMultipleChoice,
  } = useGameLevelUiState();
  const { handleGoBack, handleGoHome, itemsWrapPaddingBottom, itemsWrapPaddingTop } = useGameLevelScreenShellState({
    hideAllModals,
  });
  const { levelTasks, currentTask, maxLevelStep } = useLevelData(
    hasValidLevelNumber ? levelNumber : null,
    effectiveTaskInLevel
  );

  const {
    bossActions: {
      handleBossFailure,
      handleBossInteraction,
      handleBossRetryRequest,
      handleBuyBossExtraTime,
      handleBuyBossRetry,
      handleRestartBoss,
      openBossModal,
      setBossModalMode,
    },
    bossState: {
      bossModalMode,
      bossRetryWaitRemainingMs,
      bossTimerExpired,
      bossTimerProgress,
      bossTimerStarted,
      bossTimeLeftMs,
    },
    resetBossRunState,
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

  useGameLevelSessionLifecycle({
    bossLevel,
    currentLevelResultsCount,
    currentTaskId: currentTask?.id ?? null,
    dispatch,
    effectiveTaskInLevel,
    hasValidLevelNumber,
    levelNumber,
    markLevelStarted,
    resetBossRunState,
    resetTaskUiState,
  });

  const { canRemoveAnswer, handlePurchaseHint, handleRemoveWrongAnswer } = useTaskHelpActions({
    bossLevel,
    currentTask,
    dispatch,
    removedAnswerIds,
    setRemovedAnswerIds,
    setShowTextTaskAsMultipleChoice,
    showTextTaskAsMultipleChoice,
    openHintModal,
  });
  const { backgroundColors, currentTaskExplanation, isFinalTaskInLevel, taskKey, taskSession } =
    useGameLevelDerivedState({
      bossLevel,
      currentTask,
      getLevelCompletionDurationMs,
      getTaskExplanation,
      levelParam: levelParam ?? "",
      maxLevelStep,
      onBossFailure: handleBossFailure,
      onBossInteraction: handleBossInteraction,
      onBossRetryRequest: handleBossRetryRequest,
      theme,
    });

  const { handleWatchAd, handleWatchAdForGems } = useGameLevelRewardActions({
    dispatch,
    gems,
    prepareGemRewardAnimation,
    setBossModalMode,
    showAdForReward,
    showGemRewardAnimation,
  });

  const unavailableState = getGameLevelScreenUnavailableState({
    currentTaskExists: Boolean(currentTask),
    hasLevelTasks: Boolean(levelTasks?.length),
    hasValidLevelNumber,
    levelParam,
  });

  if (unavailableState) {
    return unavailableState;
  }

  const readyCurrentTask = currentTask;
  const readyLevelParam = levelParam;

  if (!readyCurrentTask || !readyLevelParam) {
    return {
      status: "invalidLevel",
      message: "Nav atrasts līmenis",
    };
  }

  const bossState = {
    bossModalMode,
    bossRetryWaitRemainingMs,
    bossTimeLeftMs,
    bossTimerExpired,
    bossTimerProgress,
    bossTimerStarted,
    canRetryBossForFree,
    handleBossFailure,
    handleBossInteraction,
    handleBossRetryRequest,
    handleBuyBossExtraTime,
    handleBuyBossRetry,
    onOpenBossModal: openBossModal,
    retryBoss: handleRestartBoss,
  };

  const helpState = {
    canRemoveAnswer,
    gemAnimationStartValue,
    helpVisible,
    hideAllModals,
    hideHelpModal,
    hintVisible,
    infoVisible,
    isBossTimerModalOpen,
    livesModalVisible,
    onOpenHelp,
    onOpenInfo,
    onOpenLives,
    removedAnswerIds,
    showGemAnimation,
    showHintModal: openHintModal,
    showTextTaskAsMultipleChoice,
  };

  const taskState = {
    backgroundColors,
    currentTask: readyCurrentTask,
    currentTaskExplanation,
    effectiveTaskInLevel,
    getLevelCompletionDurationMs,
    isFinalTaskInLevel,
    levelParam: readyLevelParam,
    maxLevelStep,
    taskKey,
    taskSession,
  };

  const shellState = {
    handleGoBack,
    handleGoHome,
    itemsWrapPaddingBottom,
    itemsWrapPaddingTop,
    lastLifeLostAt,
    lives,
    livesAnimation,
    loaded,
    theme,
  };

  const actionState = {
    handlePurchaseHint,
    handleRemoveWrongAnswer,
    handleWatchAd,
    handleWatchAdForGems,
  };

  return buildGameLevelScreenReadyModel({
    bossLevel,
    currentGems: gems,
    ...bossState,
    ...helpState,
    ...taskState,
    ...shellState,
    ...actionState,
  });
}
