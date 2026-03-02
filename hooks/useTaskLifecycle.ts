import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";

interface UseTaskLifecycleArgs {
  level: string;
  maxLevelStep: number;
  resetTaskState: () => void;
  isFinalTaskInLevel: boolean;
  checkIfCorrect: () => boolean;
}

export function useTaskLifecycle({
  level,
  maxLevelStep,
  checkIfCorrect,
  resetTaskState,
  isFinalTaskInLevel,
}: UseTaskLifecycleArgs) {
  const {
    dispatch,
    state: { availableLevels, lives },
  } = useAppContext();

  const router = useRouter();
  const hasAppliedLifePenaltyRef = useRef(false);
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();
  const [displayTaskResults, setDisplayTaskResults] = useState(false);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const finalizeTaskProgress = useCallback(() => {
    const isCorrect = checkIfCorrect();

    dispatch({
      type: "GET_NEXT_TASK",
      payload: { isCorrect, maxLevelStep },
    });

    resetTaskState();
    setDisplayTaskResults(false);
    hasAppliedLifePenaltyRef.current = false;
  }, [checkIfCorrect, dispatch, maxLevelStep, resetTaskState]);

  const nextLevelValue = (levelNumber + 1).toString();

  const { goToNextTask, handleGoHome, handleNextLevel } = createLevelNavigationHandlers({
    router,
    hasNextLevel,
    nextLevelValue,
    isFinalTaskInLevel,
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
    }

    setDisplayTaskResults(true);
  }, [checkIfCorrect, dispatch]);

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
