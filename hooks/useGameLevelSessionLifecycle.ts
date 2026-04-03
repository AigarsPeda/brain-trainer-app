import type { AppContextActionType } from "@/context/app.context.reducer";
import { useCallback, useEffect, useRef } from "react";

type UseGameLevelCompletionTimingResult = {
  getLevelCompletionDurationMs: () => number;
  markLevelStarted: () => void;
};

type UseGameLevelSessionLifecycleArgs = {
  bossLevel: boolean;
  currentLevelResultsCount: number;
  currentTaskId: number | null;
  dispatch: React.Dispatch<AppContextActionType>;
  effectiveTaskInLevel: number;
  hasValidLevelNumber: boolean;
  levelNumber: number;
  markLevelStarted: () => void;
  resetBossRunState: (shouldHideBossTimerModal?: boolean) => void;
  resetTaskUiState: () => void;
};

type ShouldInitializeGameLevelSessionArgs = {
  currentLevelResultsCount: number;
  currentTaskId: number | null;
  effectiveTaskInLevel: number;
  hasValidLevelNumber: boolean;
};

export function shouldInitializeGameLevelSession({
  currentLevelResultsCount,
  currentTaskId,
  effectiveTaskInLevel,
  hasValidLevelNumber,
}: ShouldInitializeGameLevelSessionArgs) {
  return currentTaskId !== null && hasValidLevelNumber && effectiveTaskInLevel === 1 && currentLevelResultsCount === 0;
}

export function useGameLevelCompletionTiming(): UseGameLevelCompletionTimingResult {
  const levelStartedAtRef = useRef<number | null>(null);

  const markLevelStarted = useCallback(() => {
    levelStartedAtRef.current = Date.now();
  }, []);

  const getLevelCompletionDurationMs = useCallback(() => {
    if (!levelStartedAtRef.current) {
      return 0;
    }

    return Date.now() - levelStartedAtRef.current;
  }, []);

  return {
    getLevelCompletionDurationMs,
    markLevelStarted,
  };
}

export function useGameLevelSessionLifecycle({
  bossLevel,
  currentLevelResultsCount,
  currentTaskId,
  dispatch,
  effectiveTaskInLevel,
  hasValidLevelNumber,
  levelNumber,
  markLevelStarted,
  resetBossRunState,
  resetTaskUiState,
}: UseGameLevelSessionLifecycleArgs) {
  useEffect(() => {
    if (!hasValidLevelNumber) {
      return;
    }

    dispatch({
      type: "SELECT_LEVEL",
      payload: { level: levelNumber },
    });
  }, [dispatch, hasValidLevelNumber, levelNumber]);

  useEffect(() => {
    if (currentTaskId === null) {
      return;
    }

    resetTaskUiState();
  }, [currentTaskId, levelNumber, resetTaskUiState]);

  useEffect(() => {
    if (
      !shouldInitializeGameLevelSession({
        currentLevelResultsCount,
        currentTaskId,
        effectiveTaskInLevel,
        hasValidLevelNumber,
      })
    ) {
      return;
    }

    markLevelStarted();

    if (bossLevel) {
      resetBossRunState(true);
    }
  }, [
    bossLevel,
    currentLevelResultsCount,
    currentTaskId,
    effectiveTaskInLevel,
    hasValidLevelNumber,
    markLevelStarted,
    resetBossRunState,
  ]);
}
