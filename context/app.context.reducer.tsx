import {
  DEFAULT_STARS,
  GEMS_FROM_AD,
  INITIAL_LEVEL,
  INITIAL_TASK,
  MAX_LIVES,
  STREAK_BONUSES,
  TASK_ACHIEVEMENTS,
} from "@/constants/GameSettings";
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
  levels: TaskInfoType[];
  availableLevels: number;
  lastPlayedDate: string | null;
  lastLifeLostAt: number | null;
  claimedStreakBonuses: number[];
  currentTaskAttemptCount: number;
  claimedTaskAchievements: number[];
  streakBonusClaimDates: Record<number, string>;
  taskAchievementClaimDates: Record<number, string>;
  game: { currentLevel: number; currentTaskInLevel: number };
  results: {
    [level: string]: {
      tasksResults: TaskResultType[];
    };
  };
};

export type AppContextType = {
  state: AppContextStateType;
  dispatch: React.Dispatch<AppContextActionType>;
};

export type TaskType = MultiAnswerMathTaskType | CreateMathTaskType | TextTaskType;
export type AppStatsContextType = Pick<AppContextStateType, "gems" | "lives" | "daysInARow" | "lastLifeLostAt">;

export const isMultiAnswerMathTask = (task: TaskType): task is MultiAnswerMathTaskType => {
  return task.taskType === "mathTaskWithResult";
};

export const isCreateMathTask = (task: TaskType): task is CreateMathTaskType => {
  return task.taskType === "createMathTask";
};

export const isTextTask = (task: TaskType): task is TextTaskType => {
  return task.taskType === "textTask";
};

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
  theme: "dark",
  daysInARow: 0,
  name: "Aigars",
  lastPlayedDate: null,
  lastLifeLostAt: null,
  lives: MAX_LIVES,
  claimedStreakBonuses: [],
  streakBonusClaimDates: {},
  levels: initializeLevels(),
  currentTaskAttemptCount: 0,
  claimedTaskAchievements: [],
  taskAchievementClaimDates: {},
  availableLevels: TOTAL_LEVELS,
  game: { currentLevel: INITIAL_LEVEL, currentTaskInLevel: INITIAL_TASK },
  results: {
    "1": {
      tasksResults: [],
    },
  },
};

export const AppStateContext = createContext<AppContextStateType | null>(null);
export const AppDispatchContext = createContext<React.Dispatch<AppContextActionType> | null>(null);
export const AppThemeContext = createContext<ThemeType>("dark");
export const AppStatsContext = createContext<AppStatsContextType | null>(null);

// Helper Functions
const getLevelResultsEntry = (
  results: AppContextStateType["results"],
  level: number
): { tasksResults: TaskResultType[] } => {
  return results[level.toString()] ?? { tasksResults: [] };
};

export const getTaskInLevelForSelection = (
  state: Pick<AppContextStateType, "levels" | "results">,
  level: number
): number => {
  const selectedLevel = state.levels.find((item) => item.levelNumber === level);

  if (selectedLevel?.isLevelCompleted) {
    return 1;
  }

  return getLevelResultsEntry(state.results, level).tasksResults.length + 1;
};

const appendTaskResult = (
  state: AppContextStateType,
  correctnessPercentage: number
): AppContextStateType["results"] => {
  const { currentLevel, currentTaskInLevel } = state.game;
  return {
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
};

const advanceToNextLevel = (
  state: AppContextStateType,
  nextLevel: number,
  results: AppContextStateType["results"],
  streak: { daysInARow: number; lastPlayedDate: string | null }
): AppContextStateType => {
  const { currentLevel } = state.game;
  const finalResults = {
    ...results,
    [nextLevel.toString()]: { tasksResults: [] },
  };
  const stars = calculateStars(finalResults[currentLevel.toString()].tasksResults);

  return {
    ...state,
    daysInARow: streak.daysInARow,
    lastPlayedDate: streak.lastPlayedDate,
    game: { currentTaskInLevel: 1, currentLevel: nextLevel },
    results: finalResults,
    currentTaskAttemptCount: 0,
    levels: updateLevelStates(state.levels, currentLevel, nextLevel, stars),
  };
};

const calculateStars = (tasksResults: TaskResultType[]): number => {
  const totalPercentage = tasksResults.reduce((sum, taskResult) => sum + taskResult.correctnessPercentage, 0);

  if (totalPercentage >= 90) {
    return 5;
  }
  if (totalPercentage >= 75) {
    return 4;
  }
  if (totalPercentage >= 60) {
    return 3;
  }
  if (totalPercentage >= 40) {
    return 2;
  }
  return 1;
};

const updateLevelStates = (
  levels: TaskInfoType[],
  currentLevel: number,
  nextLevel: number,
  stars: number
): TaskInfoType[] => {
  return levels.map((level) => {
    if (level.levelNumber === currentLevel) {
      return { ...level, stars, isLevelCompleted: true };
    }
    if (level.levelNumber === nextLevel) {
      return { ...level, isLevelLocked: false };
    }
    return level;
  });
};

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

interface ClaimTaskAchievementActionType {
  type: "CLAIM_TASK_ACHIEVEMENT";
  payload: number; // the task count milestone
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

interface SelectLevelActionType {
  type: "SELECT_LEVEL";
  payload: {
    level: number;
  };
}

interface RestartLevelActionType {
  type: "RESTART_LEVEL";
  payload: {
    level: number;
  };
}

export type AppContextActionType =
  | SelectLevelActionType
  | RestartLevelActionType
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
  | ClaimTaskAchievementActionType
  | HydrateStateActionType;

export const appReducer = (state: AppContextStateType, action: AppContextActionType): AppContextStateType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "SELECT_LEVEL": {
      const { level } = action.payload;

      return {
        ...state,
        game: {
          currentLevel: level,
          currentTaskInLevel: getTaskInLevelForSelection(state, level),
        },
        results: {
          ...state.results,
          [level.toString()]: getLevelResultsEntry(state.results, level),
        },
      };
    }

    case "RESTART_LEVEL": {
      const { level } = action.payload;

      return {
        ...state,
        currentTaskAttemptCount: 0,
        game: {
          currentLevel: level,
          currentTaskInLevel: 1,
        },
        results: {
          ...state.results,
          [level.toString()]: { tasksResults: [] },
        },
      };
    }

    case "GET_NEXT_TASK": {
      const { isCorrect, maxLevelStep } = action.payload;

      if (!isCorrect) {
        return state;
      }

      const nextTaskInLevel = state.game.currentTaskInLevel + 1;
      const finalAttemptCount = state.currentTaskAttemptCount + 1;
      const correctnessPercentage = calculateTaskCorrectnessPercentage(isCorrect, finalAttemptCount, maxLevelStep);
      const streak = updateDaysInARow(state.lastPlayedDate, state.daysInARow);
      const newResults = appendTaskResult(state, correctnessPercentage);

      if (nextTaskInLevel > maxLevelStep) {
        return advanceToNextLevel(state, state.game.currentLevel + 1, newResults, streak);
      }

      return {
        ...state,
        daysInARow: streak.daysInARow,
        lastPlayedDate: streak.lastPlayedDate,
        game: { ...state.game, currentTaskInLevel: nextTaskInLevel },
        results: newResults,
        currentTaskAttemptCount: 0,
      };
    }

    case "GET_NEXT_LEVEL": {
      const { nextLevel, correctnessPercentage } = action.payload;
      const streak = updateDaysInARow(state.lastPlayedDate, state.daysInARow);
      const newResults = appendTaskResult(state, correctnessPercentage);
      return advanceToNextLevel(state, nextLevel, newResults, streak);
    }

    case "LOSE_LIFE": {
      const newLives = Math.max(0, state.lives - 1);
      const shouldSetLifeLostTime = state.lastLifeLostAt === null && newLives < state.lives;
      return {
        ...state,
        lives: newLives,
        lastLifeLostAt: shouldSetLifeLostTime ? Date.now() : state.lastLifeLostAt,
        currentTaskAttemptCount: state.currentTaskAttemptCount + 1,
      };
    }

    case "RESTORE_LIFE":
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
        streakBonusClaimDates: { ...state.streakBonusClaimDates, [milestone]: new Date().toISOString().split("T")[0] },
      };
    }

    case "CLAIM_TASK_ACHIEVEMENT": {
      const milestone = action.payload;
      const achievement = TASK_ACHIEVEMENTS.find((a) => a.taskCount === milestone);

      if (!achievement || state.claimedTaskAchievements.includes(milestone)) {
        return state;
      }

      return {
        ...state,
        gems: state.gems + achievement.gems,
        claimedTaskAchievements: [...state.claimedTaskAchievements, milestone],
        taskAchievementClaimDates: {
          ...state.taskAchievementClaimDates,
          [milestone]: new Date().toISOString().split("T")[0],
        },
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
        claimedTaskAchievements: action.payload.claimedTaskAchievements ?? [],
        streakBonusClaimDates: action.payload.streakBonusClaimDates ?? {},
        taskAchievementClaimDates: action.payload.taskAchievementClaimDates ?? {},
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
