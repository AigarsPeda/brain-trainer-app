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
  lastAttemptedBossLevel: number | null;
  bossRetryAvailableAt: number | null;
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
type LevelResultsEntry = { tasksResults: TaskResultType[] };
type LevelSelectionStateSource = Pick<AppContextStateType, "levels" | "results"> &
  Partial<Pick<AppContextStateType, "game">>;
type StreakState = Pick<AppContextStateType, "daysInARow" | "lastPlayedDate">;
type MilestoneClaimState = {
  gems: number;
  claimedMilestones: number[];
  claimDates: Record<number, string>;
};

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
  lastAttemptedBossLevel: null,
  bossRetryAvailableAt: null,
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
const toLevelKey = (level: number): string => {
  return level.toString();
};

const createEmptyLevelResultsEntry = (): LevelResultsEntry => {
  return { tasksResults: [] };
};

const getTodayIsoDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const getLevelResultsEntry = (results: AppContextStateType["results"], level: number): LevelResultsEntry => {
  return results[toLevelKey(level)] ?? createEmptyLevelResultsEntry();
};

const getLevelInfo = (levels: TaskInfoType[], level: number): TaskInfoType | undefined => {
  return levels.find((item) => item.levelNumber === level);
};

export const getLevelSelectionState = (state: LevelSelectionStateSource, level: number) => {
  const gameState = state.game;
  const levelInfo = getLevelInfo(state.levels, level);
  const levelResults = getLevelResultsEntry(state.results, level);
  const nextTaskInLevel = levelInfo?.isLevelCompleted ? 1 : levelResults.tasksResults.length + 1;
  const isCurrentLevel = gameState?.currentLevel === level;

  return {
    isCurrentLevel,
    isLevelCompleted: levelInfo?.isLevelCompleted ?? false,
    levelResults,
    levelResultsCount: levelResults.tasksResults.length,
    nextTaskInLevel,
    currentTaskInLevel: isCurrentLevel && gameState ? gameState.currentTaskInLevel : nextTaskInLevel,
  };
};

const buildLevelProgressState = (
  state: AppContextStateType,
  level: number,
  currentTaskInLevel: number,
  levelResults: LevelResultsEntry
): Pick<AppContextStateType, "game" | "results"> => {
  return {
    game: {
      currentLevel: level,
      currentTaskInLevel,
    },
    results: {
      ...state.results,
      [toLevelKey(level)]: levelResults,
    },
  };
};

export const getTaskInLevelForSelection = (
  state: Pick<AppContextStateType, "levels" | "results">,
  level: number
): number => {
  return getLevelSelectionState(state, level).nextTaskInLevel;
};

const appendTaskResult = (
  state: AppContextStateType,
  correctnessPercentage: number
): AppContextStateType["results"] => {
  const { currentLevel, currentTaskInLevel } = state.game;
  const levelKey = toLevelKey(currentLevel);

  return {
    ...state.results,
    [levelKey]: {
      tasksResults: [
        ...getLevelResultsEntry(state.results, currentLevel).tasksResults,
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
  streak: StreakState
): AppContextStateType => {
  const { currentLevel } = state.game;
  const currentLevelKey = toLevelKey(currentLevel);
  const finalResults = {
    ...results,
    [toLevelKey(nextLevel)]: createEmptyLevelResultsEntry(),
  };
  const stars = calculateStars(finalResults[currentLevelKey].tasksResults);

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

const buildCompletedTaskState = (
  state: AppContextStateType,
  correctnessPercentage: number
): { results: AppContextStateType["results"]; streak: StreakState } => {
  return {
    results: appendTaskResult(state, correctnessPercentage),
    streak: updateDaysInARow(state.lastPlayedDate, state.daysInARow),
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

const buildMilestoneClaimState = (
  state: AppContextStateType,
  milestone: number,
  rewardGems: number,
  claimedMilestones: number[],
  claimDates: Record<number, string>
): MilestoneClaimState => {
  return {
    gems: state.gems + rewardGems,
    claimedMilestones: [...claimedMilestones, milestone],
    claimDates: {
      ...claimDates,
      [milestone]: getTodayIsoDate(),
    },
  };
};

const mergePersistedLevels = (persistedLevels: TaskInfoType[] = []): TaskInfoType[] => {
  const persistedLevelsByNumber = new Map(persistedLevels.map((level) => [level.levelNumber, level]));

  return initializeLevels().map((freshLevel) => {
    const persistedLevel = persistedLevelsByNumber.get(freshLevel.levelNumber);

    if (!persistedLevel) {
      return freshLevel;
    }

    return {
      ...freshLevel,
      stars: persistedLevel.stars,
      isLevelCompleted: persistedLevel.isLevelCompleted,
      isLevelLocked: persistedLevel.isLevelLocked,
    };
  });
};

const normalizeHydratedState = (state: AppContextStateType): AppContextStateType => {
  return {
    ...state,
    levels: mergePersistedLevels(state.levels),
    theme: state.theme ?? "dark",
    availableLevels: TOTAL_LEVELS,
    lastPlayedDate: state.lastPlayedDate ?? null,
    lastAttemptedBossLevel: state.lastAttemptedBossLevel ?? null,
    bossRetryAvailableAt: state.bossRetryAvailableAt ?? null,
    currentTaskAttemptCount: state.currentTaskAttemptCount ?? 0,
    claimedStreakBonuses: state.claimedStreakBonuses ?? [],
    claimedTaskAchievements: state.claimedTaskAchievements ?? [],
    streakBonusClaimDates: state.streakBonusClaimDates ?? {},
    taskAchievementClaimDates: state.taskAchievementClaimDates ?? {},
  };
};

interface SetNameActionType {
  type: "SET_NAME";
  payload: string;
}

interface SetThemeActionType {
  type: "SET_THEME";
  payload: ThemeType;
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

interface SetBossRetryCooldownActionType {
  type: "SET_BOSS_RETRY_COOLDOWN";
  payload: number | null;
}

interface SetLastAttemptedBossLevelActionType {
  type: "SET_LAST_ATTEMPTED_BOSS_LEVEL";
  payload: number | null;
}

export type AppContextActionType =
  | SelectLevelActionType
  | RestartLevelActionType
  | SetBossRetryCooldownActionType
  | SetLastAttemptedBossLevelActionType
  | GetNextLevel
  | SetNameActionType
  | SetThemeActionType
  | CreateNextLevelActionType
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
      const levelSelection = getLevelSelectionState(state, level);

      return {
        ...state,
        ...buildLevelProgressState(state, level, levelSelection.currentTaskInLevel, levelSelection.levelResults),
      };
    }

    case "RESTART_LEVEL": {
      const { level } = action.payload;

      return {
        ...state,
        lastAttemptedBossLevel: null,
        bossRetryAvailableAt: null,
        currentTaskAttemptCount: 0,
        ...buildLevelProgressState(state, level, 1, createEmptyLevelResultsEntry()),
      };
    }

    case "SET_BOSS_RETRY_COOLDOWN": {
      return {
        ...state,
        bossRetryAvailableAt: action.payload,
      };
    }

    case "SET_LAST_ATTEMPTED_BOSS_LEVEL": {
      return {
        ...state,
        lastAttemptedBossLevel: action.payload,
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
      const { streak, results } = buildCompletedTaskState(state, correctnessPercentage);

      if (nextTaskInLevel > maxLevelStep) {
        return advanceToNextLevel(state, state.game.currentLevel + 1, results, streak);
      }

      return {
        ...state,
        daysInARow: streak.daysInARow,
        lastPlayedDate: streak.lastPlayedDate,
        game: { ...state.game, currentTaskInLevel: nextTaskInLevel },
        results,
        currentTaskAttemptCount: 0,
      };
    }

    case "GET_NEXT_LEVEL": {
      const { nextLevel, correctnessPercentage } = action.payload;
      const { streak, results } = buildCompletedTaskState(state, correctnessPercentage);

      return advanceToNextLevel(state, nextLevel, results, streak);
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

      const claimState = buildMilestoneClaimState(
        state,
        milestone,
        bonus.gems,
        state.claimedStreakBonuses,
        state.streakBonusClaimDates
      );

      return {
        ...state,
        gems: claimState.gems,
        claimedStreakBonuses: claimState.claimedMilestones,
        streakBonusClaimDates: claimState.claimDates,
      };
    }

    case "CLAIM_TASK_ACHIEVEMENT": {
      const milestone = action.payload;
      const achievement = TASK_ACHIEVEMENTS.find((a) => a.taskCount === milestone);

      if (!achievement || state.claimedTaskAchievements.includes(milestone)) {
        return state;
      }

      const claimState = buildMilestoneClaimState(
        state,
        milestone,
        achievement.gems,
        state.claimedTaskAchievements,
        state.taskAchievementClaimDates
      );

      return {
        ...state,
        gems: claimState.gems,
        claimedTaskAchievements: claimState.claimedMilestones,
        taskAchievementClaimDates: claimState.claimDates,
      };
    }

    case "HYDRATE_STATE": {
      return normalizeHydratedState(action.payload);
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
