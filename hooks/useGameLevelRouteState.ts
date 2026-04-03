import { type AppContextStateType, getLevelSelectionState } from "@/context/app.context.reducer";
import { isBossLevel } from "@/utils/bossLevel";
import { getBossRetryState, parseLevelParam } from "@/utils/gameLevelScreen.helpers";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

type GameLevelRouteStateArgs = {
  bossRetryAvailableAt: AppContextStateType["bossRetryAvailableAt"];
  currentLevel: AppContextStateType["game"]["currentLevel"];
  currentTaskInLevel: AppContextStateType["game"]["currentTaskInLevel"];
  lastAttemptedBossLevel: AppContextStateType["lastAttemptedBossLevel"];
  level?: string | string[];
  levels: AppContextStateType["levels"];
  results: AppContextStateType["results"];
};

export function deriveGameLevelRouteState({
  bossRetryAvailableAt,
  currentLevel,
  currentTaskInLevel,
  lastAttemptedBossLevel,
  level,
  levels,
  results,
}: GameLevelRouteStateArgs) {
  const { hasValidLevelNumber, levelNumber, levelParam } = parseLevelParam(level);
  const levelSelection = hasValidLevelNumber
    ? getLevelSelectionState(
        {
          levels,
          results,
          game: { currentLevel, currentTaskInLevel },
        },
        levelNumber
      )
    : null;
  const effectiveTaskInLevel = levelSelection?.currentTaskInLevel ?? currentTaskInLevel;
  const bossLevel = hasValidLevelNumber && isBossLevel(levelNumber);
  const currentLevelResultsCount = levelSelection?.levelResultsCount ?? 0;
  const isCurrentBossCompleted = levelSelection?.isLevelCompleted ?? false;

  return {
    bossLevel,
    currentLevelResultsCount,
    effectiveTaskInLevel,
    hasValidLevelNumber,
    isCurrentBossCompleted,
    levelNumber,
    levelParam,
    levelSelection,
    ...getBossRetryState({
      bossLevel,
      levelNumber,
      lastAttemptedBossLevel,
      bossRetryAvailableAt,
    }),
  };
}

type UseGameLevelRouteStateArgs = Omit<GameLevelRouteStateArgs, "level">;

export function useGameLevelRouteState(args: UseGameLevelRouteStateArgs) {
  const { bossRetryAvailableAt, currentLevel, currentTaskInLevel, lastAttemptedBossLevel, levels, results } = args;
  const { level } = useLocalSearchParams<{ level?: string | string[] }>();

  return useMemo(
    () =>
      deriveGameLevelRouteState({
        bossRetryAvailableAt,
        currentLevel,
        currentTaskInLevel,
        lastAttemptedBossLevel,
        level,
        levels,
        results,
      }),
    [bossRetryAvailableAt, currentLevel, currentTaskInLevel, lastAttemptedBossLevel, level, levels, results]
  );
}
