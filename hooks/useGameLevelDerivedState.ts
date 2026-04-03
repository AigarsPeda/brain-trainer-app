import { type GradientColors, getTaskBackground } from "@/constants/Colors";
import type { TaskType, ThemeType } from "@/context/app.context.reducer";
import type { MathExplanation } from "@/utils/mathExplanations";
import { useMemo } from "react";

import type { TaskSession } from "@/components/mathTasks/taskSession";

type DeriveGameLevelDerivedStateArgs = {
  bossLevel: boolean;
  currentTask?: TaskType;
  getLevelCompletionDurationMs: () => number;
  getTaskExplanation: (task: TaskType) => MathExplanation;
  levelParam: string;
  maxLevelStep: number;
  onBossFailure: () => void;
  onBossInteraction: () => void;
  onBossRetryRequest: () => void;
  theme: ThemeType;
};

type GameLevelDerivedState = {
  backgroundColors: GradientColors;
  currentTaskExplanation: MathExplanation | null;
  isFinalTaskInLevel: boolean;
  taskKey: string;
  taskSession: TaskSession;
};

export function deriveGameLevelDerivedState({
  bossLevel,
  currentTask,
  getLevelCompletionDurationMs,
  getTaskExplanation,
  levelParam,
  maxLevelStep,
  onBossFailure,
  onBossInteraction,
  onBossRetryRequest,
  theme,
}: DeriveGameLevelDerivedStateArgs): GameLevelDerivedState {
  const backgroundColors = bossLevel
    ? getTaskBackground("boss", theme)
    : getTaskBackground(currentTask?.taskType ?? "home", theme);

  return {
    backgroundColors,
    currentTaskExplanation: currentTask ? getTaskExplanation(currentTask) : null,
    isFinalTaskInLevel: currentTask?.taskNumberInLevel === maxLevelStep,
    taskKey: currentTask
      ? `${levelParam}-${currentTask.id}-${currentTask.taskNumberInLevel}`
      : `${levelParam}-missing-task`,
    taskSession: {
      getLevelCompletionDurationMs,
      isBossLevel: bossLevel,
      onBossFailure,
      onBossInteraction,
      onBossRetryRequest,
    },
  };
}

export function useGameLevelDerivedState(args: DeriveGameLevelDerivedStateArgs): GameLevelDerivedState {
  const {
    bossLevel,
    currentTask,
    getLevelCompletionDurationMs,
    getTaskExplanation,
    levelParam,
    maxLevelStep,
    onBossFailure,
    onBossInteraction,
    onBossRetryRequest,
    theme,
  } = args;

  return useMemo(
    () =>
      deriveGameLevelDerivedState({
        bossLevel,
        currentTask,
        getLevelCompletionDurationMs,
        getTaskExplanation,
        levelParam,
        maxLevelStep,
        onBossFailure,
        onBossInteraction,
        onBossRetryRequest,
        theme,
      }),
    [
      bossLevel,
      currentTask,
      getLevelCompletionDurationMs,
      getTaskExplanation,
      levelParam,
      maxLevelStep,
      onBossFailure,
      onBossInteraction,
      onBossRetryRequest,
      theme,
    ]
  );
}
