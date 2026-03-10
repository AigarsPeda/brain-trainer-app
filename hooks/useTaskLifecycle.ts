import { getLevel } from "@/data/levelLoader";
import useAppContext from "@/hooks/useAppContext";
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
}

export function useTaskLifecycle({
  level,
  maxLevelStep,
  checkIfCorrect,
  resetTaskState,
  isFinalTaskInLevel,
  taskNumberInLevel,
  getLevelCompletionDurationMs,
}: UseTaskLifecycleArgs) {
  const {
    dispatch,
    state: { availableLevels, currentTaskAttemptCount, lives, results },
  } = useAppContext();

  const router = useRouter();
  const hasAppliedLifePenaltyRef = useRef(false);
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const [completionTimeMs, setCompletionTimeMs] = useState<number | null>(null);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const finalizeTaskProgress = useCallback(() => {
    dispatch({
      type: "GET_NEXT_TASK",
      payload: { isCorrect: true, maxLevelStep },
    });

    resetTaskState();
    setDisplayTaskResults(false);
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
    } else if (isFinalTaskInLevel) {
      setCompletionTimeMs(getLevelCompletionDurationMs?.() ?? 0);
    }

    setDisplayTaskResults(true);
  }, [checkIfCorrect, dispatch, getLevelCompletionDurationMs, isFinalTaskInLevel]);

  const handleTryAgain = useCallback(() => {
    resetTaskState();
    setDisplayTaskResults(false);
    hasAppliedLifePenaltyRef.current = false;
  }, [resetTaskState]);

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
    levelCompletionState: isFinalTaskInLevel
      ? {
          hasNextLevel,
          isCompleted: true,
          summary: levelCompletionSummary,
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
