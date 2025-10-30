import type { Router } from "expo-router";

type LevelNavigationArgs = {
  isFinalTaskInLevel: boolean;
  hasNextLevel: boolean;
  finalizeTaskProgress: () => void;
  router: Router;
  nextLevelValue?: string;
};

type LevelNavigationHandlers = {
  goToNextTask: () => void;
  handleGoHome: () => void;
  handleNextLevel?: () => void;
};

export const createLevelNavigationHandlers = ({
  isFinalTaskInLevel,
  hasNextLevel,
  finalizeTaskProgress,
  router,
  nextLevelValue,
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
