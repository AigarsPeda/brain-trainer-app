import { getLevel } from "@/data/levelLoader";
import useAppContext from "@/hooks/useAppContext";
import { BOSS_RETRY_COST, BOSS_RETRY_WAIT_MS } from "@/constants/GameSettings";
import { buildLevelFeedbackSummary, buildTaskFeedbackEntries } from "@/utils/levelFeedback";
import useGoogleAd from "@/hooks/useGoogleAd";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import { calculateTaskCorrectnessPercentage } from "@/utils/utils";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";

interface UseTaskLifecycleArgs {
  level: string;
  maxLevelStep: number;
  resetTaskState: () => void;
  isFinalTaskInLevel: boolean;
  checkIfCorrect: () => boolean;
  taskNumberInLevel: number;
  getLevelCompletionDurationMs?: () => number;
  isBossLevel?: boolean;
  onBossRetryRequest?: () => void;
  onBossFailure?: () => void;
}

export function useTaskLifecycle({
  level,
  maxLevelStep,
  checkIfCorrect,
  resetTaskState,
  isFinalTaskInLevel,
  taskNumberInLevel,
  getLevelCompletionDurationMs,
  isBossLevel = false,
  onBossRetryRequest,
  onBossFailure,
}: UseTaskLifecycleArgs) {
  const {
    dispatch,
    state: { availableLevels, currentTaskAttemptCount, gems, lives, results },
  } = useAppContext();

  const router = useRouter();
  const hasAppliedLifePenaltyRef = useRef(false);
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const [completionTimeMs, setCompletionTimeMs] = useState<number | null>(null);
  const [bossFailureState, setBossFailureState] = useState<{ title: string; description: string } | null>(null);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const finalizeTaskProgress = useCallback(() => {
    dispatch({
      type: "GET_NEXT_TASK",
      payload: { isCorrect: true, maxLevelStep },
    });

    resetTaskState();
    setDisplayTaskResults(false);
    setBossFailureState(null);
    hasAppliedLifePenaltyRef.current = false;
  }, [dispatch, maxLevelStep, resetTaskState]);

  const nextLevelValue = (levelNumber + 1).toString();
  const isCurrentTaskCorrect = checkIfCorrect();
  const levelCompletionSummary = useMemo(() => {
    if (!isFinalTaskInLevel || !isCurrentTaskCorrect) {
      return undefined;
    }

    const levelTasks = getLevel(levelNumber);

    if (!levelTasks) {
      return undefined;
    }

    const levelKey = levelNumber.toString();
    const currentCorrectnessPercentage = calculateTaskCorrectnessPercentage(
      true,
      currentTaskAttemptCount + 1,
      maxLevelStep
    );

    const provisionalTaskResults = [
      ...(results[levelKey]?.tasksResults ?? []).filter(
        (taskResult) => taskResult.taskNumber !== taskNumberInLevel.toString()
      ),
      {
        taskNumber: taskNumberInLevel.toString(),
        correctnessPercentage: currentCorrectnessPercentage,
      },
    ];

    return buildLevelFeedbackSummary(
      buildTaskFeedbackEntries(levelTasks, provisionalTaskResults),
      maxLevelStep,
      completionTimeMs ?? getLevelCompletionDurationMs?.() ?? 0
    );
  }, [
    completionTimeMs,
    currentTaskAttemptCount,
    getLevelCompletionDurationMs,
    isCurrentTaskCorrect,
    isFinalTaskInLevel,
    levelNumber,
    maxLevelStep,
    results,
    taskNumberInLevel,
  ]);

  const { goToNextTask, handleGoHome, handleNextLevel } = createLevelNavigationHandlers({
    router,
    hasNextLevel,
    nextLevelValue,
    isFinalTaskInLevel,
    canFinalizeTaskProgress: checkIfCorrect,
    finalizeTaskProgress,
  });

  const handleCheckAnswers = useCallback(() => {
    if (hasAppliedLifePenaltyRef.current) {
      setDisplayTaskResults(true);
      return;
    }

    const isCorrect = checkIfCorrect();

    if (!isCorrect) {
      hasAppliedLifePenaltyRef.current = true;
      dispatch({ type: "LOSE_LIFE" });
      if (isBossLevel) {
        onBossFailure?.();
        dispatch({ type: "SET_BOSS_RETRY_COOLDOWN", payload: Date.now() + BOSS_RETRY_WAIT_MS });
        setBossFailureState({
          title: "Boss neizdevās!",
          description: "Boss līmenī nedrīkst kļūdīties. Mēģini vēlreiz no sākuma.",
        });
      }
    } else if (isFinalTaskInLevel) {
      setCompletionTimeMs(getLevelCompletionDurationMs?.() ?? 0);
    }

    setDisplayTaskResults(true);
  }, [checkIfCorrect, dispatch, getLevelCompletionDurationMs, isBossLevel, isFinalTaskInLevel, onBossFailure]);

  const handleTryAgain = useCallback(() => {
    if (isBossLevel && bossFailureState) {
      resetTaskState();
      setDisplayTaskResults(false);
      setBossFailureState(null);
      hasAppliedLifePenaltyRef.current = false;
      onBossRetryRequest?.();
      return;
    }

    resetTaskState();
    setDisplayTaskResults(false);
    setBossFailureState(null);
    hasAppliedLifePenaltyRef.current = false;
  }, [bossFailureState, isBossLevel, onBossRetryRequest, resetTaskState]);

  const handleWatchAd = useCallback(() => {
    showAdForReward(
      () => {
        dispatch({ type: "RESTORE_LIFE_FROM_AD" });
        resetTaskState();
        hasAppliedLifePenaltyRef.current = false;
      },
      () => {
        setDisplayTaskResults(false);
      }
    );
  }, [showAdForReward, dispatch, resetTaskState]);

  const showResultsProps = {
    lives,
    adLoaded,
    onGoHomePress: handleGoHome,
    onWatchAdPress: handleWatchAd,
    onNextTaskPress: goToNextTask,
    onTryAgainPress: handleTryAgain,
    failureState: bossFailureState
      ? {
          ...bossFailureState,
          retryLabel: `Atkārtot bossu (${BOSS_RETRY_COST} 💎)`,
          currentGems: gems,
        }
      : undefined,
    levelCompletionState: isFinalTaskInLevel
      ? {
          hasNextLevel,
          isCompleted: true,
          summary: levelCompletionSummary,
          title: isBossLevel ? "Boss pabeigts!" : undefined,
          description: isBossLevel ? "Tu pārspēji boss līmeni. Turpini uz nākamo izaicinājumu." : undefined,
          onGoHomePress: handleGoHome,
          onNextLevelPress: handleNextLevel,
        }
      : undefined,
  };

  return {
    lives,
    adLoaded,
    hasNextLevel,
    handleTryAgain,
    showResultsProps,
    displayTaskResults,
    handleCheckAnswers,
  };
}
