import { getLevel } from "@/data/levelLoader";
import useAppContext from "@/hooks/useAppContext";
import { BOSS_RETRY_COST, BOSS_RETRY_WAIT_MS } from "@/constants/GameSettings";
import { buildLevelFeedbackSummary, buildTaskFeedbackEntries } from "@/utils/levelFeedback";
import useGoogleAd from "@/hooks/useGoogleAd";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import { calculateTaskCorrectnessPercentage } from "@/utils/utils";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";

type BossFailureState = {
  title: string;
  description: string;
};

type TaskAttemptOutcome = {
  bossFailureState: BossFailureState | null;
  completionTimeMs: number | null;
  isCorrect: boolean;
};

const getBossFailureState = (): BossFailureState => {
  return {
    title: "Boss neizdevās!",
    description: "Boss līmenī nedrīkst kļūdīties. Mēģini vēlreiz no sākuma.",
  };
};

const buildProvisionalTaskResults = (
  taskResults: { taskNumber: string; correctnessPercentage: number }[],
  taskNumberInLevel: number,
  correctnessPercentage: number
) => {
  const taskNumber = taskNumberInLevel.toString();

  return [
    ...taskResults.filter((taskResult) => taskResult.taskNumber !== taskNumber),
    {
      taskNumber,
      correctnessPercentage,
    },
  ];
};

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
  const [bossFailureState, setBossFailureState] = useState<BossFailureState | null>(null);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const resetAttemptState = useCallback(
    (shouldResetTask = false) => {
      if (shouldResetTask) {
        resetTaskState();
      }

      setDisplayTaskResults(false);
      setBossFailureState(null);
      hasAppliedLifePenaltyRef.current = false;
    },
    [resetTaskState]
  );

  const finalizeTaskProgress = useCallback(() => {
    dispatch({
      type: "GET_NEXT_TASK",
      payload: { isCorrect: true, maxLevelStep },
    });

    resetAttemptState(true);
  }, [dispatch, maxLevelStep, resetAttemptState]);

  const nextLevelValue = (levelNumber + 1).toString();
  const isCurrentTaskCorrect = checkIfCorrect();

  const getTaskAttemptOutcome = useCallback((): TaskAttemptOutcome => {
    const isCorrect = checkIfCorrect();

    if (!isCorrect) {
      return {
        bossFailureState: isBossLevel ? getBossFailureState() : null,
        completionTimeMs: null,
        isCorrect: false,
      };
    }

    return {
      bossFailureState: null,
      completionTimeMs: isFinalTaskInLevel ? (getLevelCompletionDurationMs?.() ?? 0) : null,
      isCorrect: true,
    };
  }, [checkIfCorrect, getLevelCompletionDurationMs, isBossLevel, isFinalTaskInLevel]);

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

    const provisionalTaskResults = buildProvisionalTaskResults(
      results[levelKey]?.tasksResults ?? [],
      taskNumberInLevel,
      currentCorrectnessPercentage
    );

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

    const taskOutcome = getTaskAttemptOutcome();

    if (!taskOutcome.isCorrect) {
      hasAppliedLifePenaltyRef.current = true;
      dispatch({ type: "LOSE_LIFE" });
      if (taskOutcome.bossFailureState) {
        onBossFailure?.();
        dispatch({ type: "SET_BOSS_RETRY_COOLDOWN", payload: Date.now() + BOSS_RETRY_WAIT_MS });
        setBossFailureState(taskOutcome.bossFailureState);
      }
    }

    if (taskOutcome.completionTimeMs !== null) {
      setCompletionTimeMs(taskOutcome.completionTimeMs);
    }

    setDisplayTaskResults(true);
  }, [dispatch, getTaskAttemptOutcome, onBossFailure]);

  const handleTryAgain = useCallback(() => {
    if (isBossLevel && bossFailureState) {
      resetAttemptState(true);
      onBossRetryRequest?.();
      return;
    }

    resetAttemptState(true);
  }, [bossFailureState, isBossLevel, onBossRetryRequest, resetAttemptState]);

  const handleWatchAd = useCallback(() => {
    showAdForReward(
      () => {
        dispatch({ type: "RESTORE_LIFE_FROM_AD" });
        resetAttemptState(true);
      },
      () => {
        setDisplayTaskResults(false);
      }
    );
  }, [showAdForReward, dispatch, resetAttemptState]);

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
