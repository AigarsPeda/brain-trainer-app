import { LEVEL_1 } from "@/data/math-1-level";
import { LEVEL_2 } from "@/data/math-2-level";
import { createContext } from "react";

// Level -> Multiple tasks -> One task -> Multiple answers

export type MathTypeType = "mathTaskWithResult" | "createMathTask";

export type TaskOptionType = {
  id: number;
  equation: string;
  isCorrect: boolean;
};

export type CreateMathTaskOptionType = {
  id: number;
  number: string;
  isCorrect: boolean;
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
  level: number;
  result: number;
  taskType: MathTypeType;
  taskNumberInLevel: number;
};

export type MultiAnswerMathTaskType = BaseMathTaskType & {
  options: TaskOptionType[];
};

export type CreateMathTaskType = BaseMathTaskType & {
  operation: string;
  options: CreateMathTaskOptionType[];
};

export type TaskAnswerType = {
  optionId: number;
  isCorrect: boolean;
};

export type TaskResultType = {
  taskNumber: string;
  stars: number;
};

type AppContextStateType = {
  gems: number;
  name: string;
  lives: number;
  daysInARow: number;
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
  | CreateNextLevelActionType
  | SetIsCheckedForTaskActionType;

export type AppContextType = {
  state: AppContextStateType;
  dispatch: React.Dispatch<AppContextActionType>;
};

export enum LevelsEnum {
  LEVEL_1 = "1",
  LEVEL_2 = "2",
}

export type TaskType = MultiAnswerMathTaskType | CreateMathTaskType;

export const isMultiAnswerMathTask = (task: TaskType): task is MultiAnswerMathTaskType => {
  return (task as MultiAnswerMathTaskType).options?.length > 0 && !("operation" in task);
};

export const isCreateMathTask = (task: TaskType): task is CreateMathTaskType => {
  return "operation" in task;
};

export const ALL_TASKS: Record<LevelsEnum, TaskType[]> = {
  [LevelsEnum.LEVEL_1]: LEVEL_1,
  [LevelsEnum.LEVEL_2]: LEVEL_2,
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
  lives: 5,
  results: {
    "1": {
      tasksResults: [],
    },
  },
  daysInARow: 0,
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

interface SetIsCheckedForTaskActionType {
  type: "CHECK_ANSWERS";
  payload: {
    level: string;
    currentTaskNumber: number;
  };
}

interface CreateNextLevelActionType {
  type: "GET_NEXT_TASK_IN_LEVEL";
  payload: {
    stars: number; // This is the stars calculated based on the answers
  };
}

interface GetNextLevel {
  type: "GET_NEXT_LEVEL";
  payload: {
    nextLevel: number;
    stars: number; // Optional, if you want to pass stars for the next level
  };
}

export const appReducer = (state: AppContextStateType, action: AppContextActionType): AppContextStateType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "GET_NEXT_TASK_IN_LEVEL": {
      const { stars } = action.payload;
      const nextLevelNumber = state.game.currentTaskInLevel + 1;

      const foundLevel = state.results[state.game.currentLevel?.toString() || "1"] ?? {
        tasksResults: [],
      };

      foundLevel.tasksResults.push({
        taskNumber: state.game.currentTaskInLevel.toString(),
        stars: stars || 0, // TODO: calculate based on answers
      });

      return {
        ...state,
        game: {
          ...state.game,
          currentTaskInLevel: nextLevelNumber,
        },
      };
    }

    case "GET_NEXT_LEVEL": {
      const { nextLevel, stars } = action.payload;
      const currentLevel = state.game.currentLevel;
      const currentTaskInLevel = state.game.currentTaskInLevel;

      return {
        ...state,
        game: {
          currentTaskInLevel: 1, // Reset the task number for the next level
          currentLevel: nextLevel, // Update the current level to the next level
        },
        results: {
          ...state.results,
          [currentLevel.toString()]: {
            tasksResults: [
              ...(state.results[currentLevel.toString()]?.tasksResults || []),
              {
                taskNumber: currentTaskInLevel.toString(),
                stars: stars || 0, // Add stars for the current task TODO: calculate based on answers
              },
            ],
          },
          [nextLevel.toString()]: {
            tasksResults: [], // Initialize the next level's tasksResults as an empty array
          },
        },
        levels: state.levels.map((level) =>
          level.levelNumber === currentLevel
            ? {
                ...level,
                stars: 4, // Set stars for the current level TODO: calculate based on answers
                isLevelCompleted: true, // Mark the current level as completed
              }
            : level.levelNumber === nextLevel
              ? {
                  ...level,
                  isLevelLocked: false, // Unlock the next level
                }
              : level
        ),
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
