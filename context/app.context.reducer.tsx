import { LEVEL_1 } from "@/data/math-1-level";
import { LEVEL_2 } from "@/data/math-2-level";
import calculateStars from "@/utils/utils";
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

type AppContextStateType = {
  gems: number;
  name: string;
  lives: number;
  daysInARow: number;
  results: ResultType[];
  levels: TaskInfoType[];
  availableLevels: number;
  game: { currentLevel: number; currentTaskInLevel: number };
};

export type AppContextActionType =
  | GetNextLevel
  | SetNameActionType
  | CreateNextLevelActionType
  | SetResultForTaskActionType
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

type ResultType = {
  level: string;
  tasks: {
    [taskNumber: string]: {
      isTaskChecked: boolean;
      answers: TaskAnswerType[];
    };
  };
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
  results: [],
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

interface SetResultForTaskActionType {
  type: "SET_RESULT_FOR_TASK";
  payload: {
    level: string;
    answer: {
      optionId: number;
      isCorrect: boolean;
    };
  };
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
}

interface GetNextLevel {
  type: "GET_NEXT_LEVEL";
  payload: {
    nextLevel: number;
  };
}

export const appReducer = (state: AppContextStateType, action: AppContextActionType): AppContextStateType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_RESULT_FOR_TASK": {
      const { level, answer } = action.payload;
      const foundAnswer = state.results.find((r) => r.level === level);

      if (!foundAnswer) {
        return {
          ...state,
          results: [
            ...state.results,
            {
              level,
              tasks: {
                [state.game.currentTaskInLevel]: {
                  isTaskChecked: false,
                  answers: [answer],
                },
              },
            },
          ],
        };
      }

      const levelAnswers = foundAnswer.tasks;
      const currentTask = levelAnswers[state.game.currentTaskInLevel];

      const updatedAnswers = currentTask?.answers?.some((r) => r.optionId === answer.optionId)
        ? currentTask.answers.filter((r) => r.optionId !== answer.optionId)
        : [...(currentTask?.answers || []), answer];

      return {
        ...state,
        results: state.results.map((r) =>
          r.level === level
            ? {
                ...r,
                tasks: {
                  ...r.tasks,
                  [state.game.currentTaskInLevel]: {
                    ...r.tasks[state.game.currentTaskInLevel],
                    answers: updatedAnswers,
                  },
                },
              }
            : r
        ),
      };
    }

    case "CHECK_ANSWERS": {
      const { level, currentTaskNumber } = action.payload;
      const foundAnswer = state.results.find((r) => r.level === level);
      const levelAnswers = foundAnswer?.tasks || {};
      const currentTask = levelAnswers[currentTaskNumber] || {};

      const updatedTask = {
        ...currentTask,
        isTaskChecked: true,
      };

      return {
        ...state,
        results: state.results.map((r) =>
          r.level === level
            ? {
                ...r,
                tasks: {
                  ...r.tasks,
                  [currentTaskNumber]: updatedTask,
                },
              }
            : r
        ),
      };
    }

    case "GET_NEXT_TASK_IN_LEVEL": {
      const nextLevelNumber = state.game.currentTaskInLevel + 1;

      return {
        ...state,
        game: {
          ...state.game,
          currentTaskInLevel: nextLevelNumber,
        },
        results: [
          ...state.results,
          {
            level: state.game.currentLevel.toString(),
            tasks: {
              [nextLevelNumber]: {
                isTaskChecked: false,
                answers: [],
              },
            },
          },
        ],
      };
    }

    case "GET_NEXT_LEVEL": {
      const { nextLevel } = action.payload;

      // get all answers for the current level
      const currentLevelAnswers = state.results.find((r) => r.level === state.game.currentLevel.toString());

      if (!currentLevelAnswers) {
        return state;
      }

      const allLevelResult = Object.values(currentLevelAnswers?.tasks).reduce<TaskAnswerType[]>((acc, task) => {
        return acc.concat(task.answers);
      }, []);

      const updatedTaskInfos = state.levels.map((t) => {
        if (t.levelNumber === state.game.currentLevel) {
          return {
            ...t,
            stars: calculateStars(allLevelResult),
            isLevelCompleted: true,
          };
        } else if (t.levelNumber === nextLevel) {
          return {
            ...t,
            isLevelLocked: false,
          };
        }
        return t;
      });

      return {
        ...state,
        game: {
          currentTaskInLevel: 1,
          currentLevel: nextLevel,
        },
        levels: updatedTaskInfos,
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
