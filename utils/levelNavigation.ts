import type { Router } from "expo-router";

type LevelNavigationArgs = {
  router: Router;
  hasNextLevel: boolean;
  nextLevelValue?: string;
  isFinalTaskInLevel: boolean;
  finalizeTaskProgress: () => void;
};

type LevelNavigationHandlers = {
  goToNextTask: () => void;
  handleGoHome: () => void;
  handleNextLevel?: () => void;
};

export const createLevelNavigationHandlers = ({
  router,
  hasNextLevel,
  nextLevelValue,
  isFinalTaskInLevel,
  finalizeTaskProgress,
}: LevelNavigationArgs): LevelNavigationHandlers => {
  const goToNextTask = () => {
    if (isFinalTaskInLevel) {
      return;
    }

    finalizeTaskProgress();
  };

  const handleGoHome = () => {
    finalizeTaskProgress();
    router.replace("/");
  };

  const handleNextLevel =
    hasNextLevel && nextLevelValue
      ? () => {
          finalizeTaskProgress();
          router.replace({ pathname: "/game/[level]", params: { level: nextLevelValue } });
        }
      : undefined;

  return {
    goToNextTask,
    handleGoHome,
    handleNextLevel,
  };
};
