import { INITIAL_LIVES, MAX_LIVES } from "@/constants/GameSettings";
import { LEVEL_1 } from "@/data/math-1-level";
import { LEVEL_2 } from "@/data/math-2-level";
import { LEVEL_3 } from "@/data/math-3-level";
import { calculateTaskCorrectnessPercentage } from "@/utils/utils";
import { createContext } from "react";
import type { ImageSourcePropType } from "react-native";

// Level -> Multiple tasks -> One task -> Multiple answers

export type MathTypeType = "mathTaskWithResult" | "createMathTask" | "textTask";

export type TaskOptionType = {
  id: number;
  equation: string;
};

export type CreateMathTaskOptionType = {
  id: number;
  number: string;
};

export type TaskInfoType = {
  title: string;
  stars: number;
  levelNumber: number;
  isLevelLocked: boolean;
  isLevelCompleted: boolean;
};

export type BaseMathTaskType = {
  id: number;
  result: number;
  taskType: MathTypeType;
  taskNumberInLevel: number;
};

export type MultiAnswerMathTaskType = BaseMathTaskType & {
  options: TaskOptionType[];
};

export type MathOperation = "+" | "-" | "×" | "÷" | "*" | "/";

export type CreateMathTaskType = BaseMathTaskType & {
  operation: MathOperation;
  options: CreateMathTaskOptionType[];
};

export type TextTaskType = BaseMathTaskType & {
  question: string;
  icon: ImageSourcePropType;
};

export type TaskAnswerType = {
  optionId: number;
  isCorrect: boolean;
};

export type TaskResultType = {
  taskNumber: string;
  correctnessPercentage: number;
};

export type ThemeType = "light" | "dark";

export type AppContextStateType = {
  gems: number;
  name: string;
  lives: number;
  theme: ThemeType;
  daysInARow: number;
  lastLifeLostAt: number | null;
  currentTaskAttemptCount: number;
  results: {
    [level: string]: {
      tasksResults: TaskResultType[];
    };
  };
  levels: TaskInfoType[];
  availableLevels: number;
  game: { currentLevel: number; currentTaskInLevel: number };
};

export type AppContextActionType =
  | GetNextLevel
  | SetNameActionType
  | SetThemeActionType
  | CreateNextLevelActionType
  | SetIsCheckedForTaskActionType
  | LoseLifeActionType
  | RestoreLifeActionType
  | RestoreLifeFromAdActionType
  | HydrateStateActionType;

export type AppContextType = {
  state: AppContextStateType;
  dispatch: React.Dispatch<AppContextActionType>;
};

export enum LevelsEnum {
  LEVEL_1 = "1",
  LEVEL_2 = "2",
  LEVEL_3 = "3",
}

export type TaskType = MultiAnswerMathTaskType | CreateMathTaskType | TextTaskType;

export const isMultiAnswerMathTask = (task: TaskType): task is MultiAnswerMathTaskType => {
  return (task as MultiAnswerMathTaskType).options?.length > 0 && !("operation" in task) && !("question" in task);
};

export const isCreateMathTask = (task: TaskType): task is CreateMathTaskType => {
  return "operation" in task && !("question" in task);
};

export const isTextTask = (task: TaskType): task is TextTaskType => {
  return "question" in task && "icon" in task;
};

export const ALL_TASKS: Record<LevelsEnum, TaskType[]> = {
  [LevelsEnum.LEVEL_1]: LEVEL_1,
  [LevelsEnum.LEVEL_2]: LEVEL_2,
  [LevelsEnum.LEVEL_3]: LEVEL_3,
};

const INITIAL_LEVEL = 1;
const INITIAL_TASK = 1;
const DEFAULT_STARS = 0;

const initializeLevels = (): TaskInfoType[] => {
  return Array.from({ length: Object.keys(ALL_TASKS).length }, (_, index) => ({
    stars: DEFAULT_STARS,
    levelNumber: index + 1,
    isLevelCompleted: false,
    title: `Task ${index + 1}`,
    isLevelLocked: index !== 0,
  }));
};

export const initialState: AppContextStateType = {
  gems: 0,
  lives: INITIAL_LIVES,
  theme: "light",
  results: {
    "1": {
      tasksResults: [],
    },
  },
  daysInARow: 0,
  lastLifeLostAt: null,
  currentTaskAttemptCount: 0,
  name: "Aigars",
  game: { currentLevel: INITIAL_LEVEL, currentTaskInLevel: INITIAL_TASK },
  availableLevels: Object.keys(ALL_TASKS).length,
  levels: initializeLevels(),
};

export const initialContext: AppContextType = {
  state: initialState,
  dispatch: () => null,
};

export const AppContext = createContext<AppContextType>(initialContext);

interface SetNameActionType {
  type: "SET_NAME";
  payload: string;
}

interface SetThemeActionType {
  type: "SET_THEME";
  payload: ThemeType;
}

interface SetIsCheckedForTaskActionType {
  type: "CHECK_ANSWERS";
  payload: {
    level: string;
    currentTaskNumber: number;
  };
}

interface CreateNextLevelActionType {
  type: "GET_NEXT_TASK";
  payload: {
    isCorrect: boolean;
    maxLevelStep: number;
  };
}

interface LoseLifeActionType {
  type: "LOSE_LIFE";
}

interface RestoreLifeActionType {
  type: "RESTORE_LIFE";
}

interface RestoreLifeFromAdActionType {
  type: "RESTORE_LIFE_FROM_AD";
}

interface HydrateStateActionType {
  type: "HYDRATE_STATE";
  payload: AppContextStateType;
}

interface GetNextLevel {
  type: "GET_NEXT_LEVEL";
  payload: {
    nextLevel: number;
    correctnessPercentage: number;
  };
}

export const appReducer = (state: AppContextStateType, action: AppContextActionType): AppContextStateType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "GET_NEXT_TASK": {
      const { isCorrect, maxLevelStep } = action.payload;
      const currentLevel = state.game.currentLevel;
      const currentTaskInLevel = state.game.currentTaskInLevel;
      const nextTaskInLevel = currentTaskInLevel + 1;
      const updatedLives = state.lives;
      const finalAttemptCount = isCorrect ? state.currentTaskAttemptCount + 1 : state.currentTaskAttemptCount;
      const correctnessPercentage = calculateTaskCorrectnessPercentage(isCorrect, finalAttemptCount, maxLevelStep);

      const newResults = {
        ...state.results,
        [currentLevel.toString()]: {
          tasksResults: [
            ...(state.results[currentLevel.toString()]?.tasksResults || []),
            {
              taskNumber: currentTaskInLevel.toString(),
              correctnessPercentage,
            },
          ],
        },
      };

      const isLastTaskInLevel = nextTaskInLevel > maxLevelStep;

      if (isLastTaskInLevel) {
        const nextLevel = currentLevel + 1;

        const calculateStars = (tasksResults: TaskResultType[]): number => {
          const totalPercentage = tasksResults.reduce((sum, taskResult) => sum + taskResult.correctnessPercentage, 0);

          if (totalPercentage >= 90) {
            return 5;
          } else if (totalPercentage >= 75) {
            return 4;
          } else if (totalPercentage >= 60) {
            return 3;
          } else if (totalPercentage >= 40) {
            return 2;
          } else {
            return 1;
          }
        };

        const finalResults = {
          ...newResults,
          [nextLevel.toString()]: {
            tasksResults: [],
          },
        };

        return {
          ...state,
          lives: updatedLives,
          game: {
            currentTaskInLevel: 1,
            currentLevel: nextLevel,
          },
          results: finalResults,
          currentTaskAttemptCount: 0,
          levels: state.levels.map((level) =>
            level.levelNumber === currentLevel
              ? {
                  ...level,
                  stars: calculateStars(finalResults[currentLevel.toString()].tasksResults),
                  isLevelCompleted: true,
                }
              : level.levelNumber === nextLevel
                ? {
                    ...level,
                    isLevelLocked: false,
                  }
                : level
          ),
        };
      }

      return {
        ...state,
        lives: updatedLives,
        game: {
          ...state.game,
          currentTaskInLevel: nextTaskInLevel,
        },
        results: newResults,
        currentTaskAttemptCount: 0,
      };
    }

    case "GET_NEXT_LEVEL": {
      const { nextLevel, correctnessPercentage } = action.payload;
      const currentLevel = state.game.currentLevel;
      const currentTaskInLevel = state.game.currentTaskInLevel;

      const calculateStars = (tasksResults: TaskResultType[]): number => {
        const totalPercentage = tasksResults.reduce((sum, taskResult) => sum + taskResult.correctnessPercentage, 0);

        if (totalPercentage >= 90) {
          return 5;
        } else if (totalPercentage >= 75) {
          return 4;
        } else if (totalPercentage >= 60) {
          return 3;
        } else if (totalPercentage >= 40) {
          return 2;
        } else {
          return 1;
        }
      };

      const newResults = {
        ...state.results,
        [currentLevel.toString()]: {
          tasksResults: [
            ...(state.results[currentLevel.toString()]?.tasksResults || []),
            {
              taskNumber: currentTaskInLevel.toString(),
              correctnessPercentage,
            },
          ],
        },
        [nextLevel.toString()]: {
          tasksResults: [],
        },
      };

      const newState = {
        ...state,
        game: {
          currentTaskInLevel: 1,
          currentLevel: nextLevel,
        },
        results: newResults,
        currentTaskAttemptCount: 0,
        levels: state.levels.map((level) =>
          level.levelNumber === currentLevel
            ? {
                ...level,
                stars: calculateStars(newResults[currentLevel.toString()].tasksResults),
                isLevelCompleted: true,
              }
            : level.levelNumber === nextLevel
              ? {
                  ...level,
                  isLevelLocked: false,
                }
              : level
        ),
      };

      return newState;
    }

    case "LOSE_LIFE": {
      const newLives = Math.max(0, state.lives - 1);
      return {
        ...state,
        lives: newLives,
        lastLifeLostAt: newLives < state.lives && state.lastLifeLostAt === null ? Date.now() : state.lastLifeLostAt,
        currentTaskAttemptCount: state.currentTaskAttemptCount + 1,
      };
    }

    case "RESTORE_LIFE": {
      const newLives = Math.min(MAX_LIVES, state.lives + 1);
      return {
        ...state,
        lives: newLives,
        lastLifeLostAt: newLives >= MAX_LIVES ? null : Date.now(),
      };
    }

    case "RESTORE_LIFE_FROM_AD": {
      const newLives = Math.min(MAX_LIVES, state.lives + 1);
      return {
        ...state,
        lives: newLives,
        lastLifeLostAt: newLives >= MAX_LIVES ? null : state.lastLifeLostAt,
      };
    }

    case "HYDRATE_STATE": {
      // Restore the entire state from persisted storage
      return {
        ...action.payload,
        theme: action.payload.theme ?? "light",
        availableLevels: Object.keys(ALL_TASKS).length,
        currentTaskAttemptCount: action.payload.currentTaskAttemptCount ?? 0,
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
