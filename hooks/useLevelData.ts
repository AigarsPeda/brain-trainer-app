import { TaskType } from "@/context/app.context.reducer";
import { getLevel } from "@/data/levelLoader";
import { useMemo } from "react";

type LevelDataResult = {
  isLoading: false;
  levelTasks: TaskType[];
  currentTask: TaskType | undefined;
  maxLevelStep: number;
} | {
  isLoading: false;
  levelTasks: null;
  currentTask: undefined;
  maxLevelStep: 0;
};

export function useLevelData(level: string, currentTaskInLevel: number): LevelDataResult {
  return useMemo(() => {
    const levelNumber = Number(level);

    if (isNaN(levelNumber) || levelNumber < 1) {
      return {
        isLoading: false as const,
        levelTasks: null,
        currentTask: undefined,
        maxLevelStep: 0,
      };
    }

    const tasks = getLevel(levelNumber);

    if (!tasks) {
      return {
        isLoading: false as const,
        levelTasks: null,
        currentTask: undefined,
        maxLevelStep: 0,
      };
    }

    const currentTask = tasks.find((t) => t.taskNumberInLevel === currentTaskInLevel);

    return {
      isLoading: false as const,
      levelTasks: tasks,
      currentTask,
      maxLevelStep: tasks.length,
    };
  }, [level, currentTaskInLevel]);
}
