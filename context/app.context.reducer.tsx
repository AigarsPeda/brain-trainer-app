import { GEMS_FROM_AD, INITIAL_LIVES, MAX_LIVES } from "@/constants/GameSettings";
import { LEVEL_1 } from "@/data/math-1-level";
import { LEVEL_2 } from "@/data/math-2-level";
import { LEVEL_3 } from "@/data/math-3-level";
import { LEVEL_4 } from "@/data/math-4-level";
import { LEVEL_5 } from "@/data/math-5-level";
import { LEVEL_6 } from "@/data/math-6-level";
import { LEVEL_7 } from "@/data/math-7-level";
import { LEVEL_8 } from "@/data/math-8-level";
import { LEVEL_9 } from "@/data/math-9-level";
import { LEVEL_10 } from "@/data/math-10-level";
import { LEVEL_11 } from "@/data/math-11-level";
import { LEVEL_12 } from "@/data/math-12-level";
import { LEVEL_13 } from "@/data/math-13-level";
import { LEVEL_14 } from "@/data/math-14-level";
import { LEVEL_15 } from "@/data/math-15-level";
import { LEVEL_16 } from "@/data/math-16-level";
import { LEVEL_17 } from "@/data/math-17-level";
import { LEVEL_18 } from "@/data/math-18-level";
import { LEVEL_19 } from "@/data/math-19-level";
import { LEVEL_20 } from "@/data/math-20-level";
import { LEVEL_21 } from "@/data/math-21-level";
import { LEVEL_22 } from "@/data/math-22-level";
import { LEVEL_23 } from "@/data/math-23-level";
import { LEVEL_24 } from "@/data/math-24-level";
import { LEVEL_25 } from "@/data/math-25-level";
import { LEVEL_26 } from "@/data/math-26-level";
import { LEVEL_27 } from "@/data/math-27-level";
import { LEVEL_28 } from "@/data/math-28-level";
import { LEVEL_29 } from "@/data/math-29-level";
import { LEVEL_30 } from "@/data/math-30-level";
import { LEVEL_31 } from "@/data/math-31-level";
import { LEVEL_32 } from "@/data/math-32-level";
import { LEVEL_33 } from "@/data/math-33-level";
import { LEVEL_34 } from "@/data/math-34-level";
import { LEVEL_35 } from "@/data/math-35-level";
import { LEVEL_36 } from "@/data/math-36-level";
import { LEVEL_37 } from "@/data/math-37-level";
import { LEVEL_38 } from "@/data/math-38-level";
import { LEVEL_39 } from "@/data/math-39-level";
import { LEVEL_40 } from "@/data/math-40-level";
import { LEVEL_41 } from "@/data/math-41-level";
import { LEVEL_42 } from "@/data/math-42-level";
import { LEVEL_43 } from "@/data/math-43-level";
import { LEVEL_44 } from "@/data/math-44-level";
import { LEVEL_45 } from "@/data/math-45-level";
import { LEVEL_46 } from "@/data/math-46-level";
import { LEVEL_47 } from "@/data/math-47-level";
import { LEVEL_48 } from "@/data/math-48-level";
import { LEVEL_49 } from "@/data/math-49-level";
import { LEVEL_50 } from "@/data/math-50-level";
import { LEVEL_51 } from "@/data/math-51-level";
import { calculateTaskCorrectnessPercentage, updateDaysInARow } from "@/utils/utils";
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
  lastPlayedDate: string | null;
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

export type AppContextType = {
  state: AppContextStateType;
  dispatch: React.Dispatch<AppContextActionType>;
};

export enum LevelsEnum {
  LEVEL_1 = "1",
  LEVEL_2 = "2",
  LEVEL_3 = "3",
  LEVEL_4 = "4",
  LEVEL_5 = "5",
  LEVEL_6 = "6",
  LEVEL_7 = "7",
  LEVEL_8 = "8",
  LEVEL_9 = "9",
  LEVEL_10 = "10",
  LEVEL_11 = "11",
  LEVEL_12 = "12",
  LEVEL_13 = "13",
  LEVEL_14 = "14",
  LEVEL_15 = "15",
  LEVEL_16 = "16",
  LEVEL_17 = "17",
  LEVEL_18 = "18",
  LEVEL_19 = "19",
  LEVEL_20 = "20",
  LEVEL_21 = "21",
  LEVEL_22 = "22",
  LEVEL_23 = "23",
  LEVEL_24 = "24",
  LEVEL_25 = "25",
  LEVEL_26 = "26",
  LEVEL_27 = "27",
  LEVEL_28 = "28",
  LEVEL_29 = "29",
  LEVEL_30 = "30",
  LEVEL_31 = "31",
  LEVEL_32 = "32",
  LEVEL_33 = "33",
  LEVEL_34 = "34",
  LEVEL_35 = "35",
  LEVEL_36 = "36",
  LEVEL_37 = "37",
  LEVEL_38 = "38",
  LEVEL_39 = "39",
  LEVEL_40 = "40",
  LEVEL_41 = "41",
  LEVEL_42 = "42",
  LEVEL_43 = "43",
  LEVEL_44 = "44",
  LEVEL_45 = "45",
  LEVEL_46 = "46",
  LEVEL_47 = "47",
  LEVEL_48 = "48",
  LEVEL_49 = "49",
  LEVEL_50 = "50",
  LEVEL_51 = "51",
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
  [LevelsEnum.LEVEL_4]: LEVEL_4,
  [LevelsEnum.LEVEL_5]: LEVEL_5,
  [LevelsEnum.LEVEL_6]: LEVEL_6,
  [LevelsEnum.LEVEL_7]: LEVEL_7,
  [LevelsEnum.LEVEL_8]: LEVEL_8,
  [LevelsEnum.LEVEL_9]: LEVEL_9,
  [LevelsEnum.LEVEL_10]: LEVEL_10,
  [LevelsEnum.LEVEL_11]: LEVEL_11,
  [LevelsEnum.LEVEL_12]: LEVEL_12,
  [LevelsEnum.LEVEL_13]: LEVEL_13,
  [LevelsEnum.LEVEL_14]: LEVEL_14,
  [LevelsEnum.LEVEL_15]: LEVEL_15,
  [LevelsEnum.LEVEL_16]: LEVEL_16,
  [LevelsEnum.LEVEL_17]: LEVEL_17,
  [LevelsEnum.LEVEL_18]: LEVEL_18,
  [LevelsEnum.LEVEL_19]: LEVEL_19,
  [LevelsEnum.LEVEL_20]: LEVEL_20,
  [LevelsEnum.LEVEL_21]: LEVEL_21,
  [LevelsEnum.LEVEL_22]: LEVEL_22,
  [LevelsEnum.LEVEL_23]: LEVEL_23,
  [LevelsEnum.LEVEL_24]: LEVEL_24,
  [LevelsEnum.LEVEL_25]: LEVEL_25,
  [LevelsEnum.LEVEL_26]: LEVEL_26,
  [LevelsEnum.LEVEL_27]: LEVEL_27,
  [LevelsEnum.LEVEL_28]: LEVEL_28,
  [LevelsEnum.LEVEL_29]: LEVEL_29,
  [LevelsEnum.LEVEL_30]: LEVEL_30,
  [LevelsEnum.LEVEL_31]: LEVEL_31,
  [LevelsEnum.LEVEL_32]: LEVEL_32,
  [LevelsEnum.LEVEL_33]: LEVEL_33,
  [LevelsEnum.LEVEL_34]: LEVEL_34,
  [LevelsEnum.LEVEL_35]: LEVEL_35,
  [LevelsEnum.LEVEL_36]: LEVEL_36,
  [LevelsEnum.LEVEL_37]: LEVEL_37,
  [LevelsEnum.LEVEL_38]: LEVEL_38,
  [LevelsEnum.LEVEL_39]: LEVEL_39,
  [LevelsEnum.LEVEL_40]: LEVEL_40,
  [LevelsEnum.LEVEL_41]: LEVEL_41,
  [LevelsEnum.LEVEL_42]: LEVEL_42,
  [LevelsEnum.LEVEL_43]: LEVEL_43,
  [LevelsEnum.LEVEL_44]: LEVEL_44,
  [LevelsEnum.LEVEL_45]: LEVEL_45,
  [LevelsEnum.LEVEL_46]: LEVEL_46,
  [LevelsEnum.LEVEL_47]: LEVEL_47,
  [LevelsEnum.LEVEL_48]: LEVEL_48,
  [LevelsEnum.LEVEL_49]: LEVEL_49,
  [LevelsEnum.LEVEL_50]: LEVEL_50,
  [LevelsEnum.LEVEL_51]: LEVEL_51,
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
  lastPlayedDate: null,
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

interface AddGemsFromAdActionType {
  type: "ADD_GEMS_FROM_AD";
}

interface SpendGemsActionType {
  type: "SPEND_GEMS";
  payload: number;
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

export type AppContextActionType =
  | GetNextLevel
  | SetNameActionType
  | SetThemeActionType
  | CreateNextLevelActionType
  | SetIsCheckedForTaskActionType
  | LoseLifeActionType
  | RestoreLifeActionType
  | RestoreLifeFromAdActionType
  | AddGemsFromAdActionType
  | SpendGemsActionType
  | HydrateStateActionType;

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
      const updatedLives = state.lives;
      const nextTaskInLevel = currentTaskInLevel + 1;
      const finalAttemptCount = isCorrect ? state.currentTaskAttemptCount + 1 : state.currentTaskAttemptCount;
      const correctnessPercentage = calculateTaskCorrectnessPercentage(isCorrect, finalAttemptCount, maxLevelStep);
      const { daysInARow: newDaysInARow, lastPlayedDate: newLastPlayedDate } = updateDaysInARow(
        state.lastPlayedDate,
        state.daysInARow
      );

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
          daysInARow: newDaysInARow,
          lastPlayedDate: newLastPlayedDate,
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
        daysInARow: newDaysInARow,
        lastPlayedDate: newLastPlayedDate,
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

      // Update days in a row and lastPlayedDate
      const { daysInARow: newDaysInARow, lastPlayedDate: newLastPlayedDate } = updateDaysInARow(
        state.lastPlayedDate,
        state.daysInARow
      );

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
        daysInARow: newDaysInARow,
        lastPlayedDate: newLastPlayedDate,
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

    case "ADD_GEMS_FROM_AD": {
      return {
        ...state,
        gems: state.gems + GEMS_FROM_AD,
      };
    }

    case "SPEND_GEMS": {
      return {
        ...state,
        gems: Math.max(0, state.gems - action.payload),
      };
    }

    case "HYDRATE_STATE": {
      // Restore the entire state from persisted storage
      // Merge persisted levels with fresh levels to handle new levels added
      const freshLevels = initializeLevels();
      const mergedLevels = freshLevels.map((freshLevel) => {
        const persistedLevel = action.payload.levels?.find((l) => l.levelNumber === freshLevel.levelNumber);
        if (persistedLevel) {
          return {
            ...freshLevel,
            stars: persistedLevel.stars,
            isLevelCompleted: persistedLevel.isLevelCompleted,
            isLevelLocked: persistedLevel.isLevelLocked,
          };
        }
        return freshLevel;
      });

      return {
        ...action.payload,
        levels: mergedLevels,
        theme: action.payload.theme ?? "light",
        availableLevels: Object.keys(ALL_TASKS).length,
        lastPlayedDate: action.payload.lastPlayedDate ?? null,
        currentTaskAttemptCount: action.payload.currentTaskAttemptCount ?? 0,
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
