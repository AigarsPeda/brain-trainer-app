import { GEMS_FROM_AD, INITIAL_LIVES, MAX_LIVES, STREAK_BONUSES } from "@/constants/GameSettings";
import { TOTAL_LEVELS } from "@/data/levelLoader";
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
  claimedStreakBonuses: number[];
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

const INITIAL_LEVEL = 1;
const INITIAL_TASK = 1;
const DEFAULT_STARS = 0;

const initializeLevels = (): TaskInfoType[] => {
  return Array.from({ length: TOTAL_LEVELS }, (_, index) => ({
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
  theme: "dark",
  results: {
    "1": {
      tasksResults: [],
    },
  },
  daysInARow: 0,
  claimedStreakBonuses: [],
  lastPlayedDate: null,
  lastLifeLostAt: null,
  currentTaskAttemptCount: 0,
  name: "Aigars",
  game: { currentLevel: INITIAL_LEVEL, currentTaskInLevel: INITIAL_TASK },
  availableLevels: TOTAL_LEVELS,
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

interface ClaimStreakBonusActionType {
  type: "CLAIM_STREAK_BONUS";
  payload: number; // the streak day milestone
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
  | ClaimStreakBonusActionType
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

    case "CLAIM_STREAK_BONUS": {
      const milestone = action.payload;
      const bonus = STREAK_BONUSES.find((b) => b.day === milestone);
      if (!bonus || state.claimedStreakBonuses.includes(milestone)) {
        return state;
      }
      return {
        ...state,
        gems: state.gems + bonus.gems,
        claimedStreakBonuses: [...state.claimedStreakBonuses, milestone],
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
        theme: action.payload.theme ?? "dark",
        availableLevels: TOTAL_LEVELS,
        lastPlayedDate: action.payload.lastPlayedDate ?? null,
        currentTaskAttemptCount: action.payload.currentTaskAttemptCount ?? 0,
        claimedStreakBonuses: action.payload.claimedStreakBonuses ?? [],
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
