import { calculateStars } from "@/app/utils/utils";
import { LEVEL_1 } from "@/data/math-1-level";
import { LEVEL_2 } from "@/data/math-2-level";
import { createContext } from "react";

// Level -> Multiple tasks -> One task -> Multiple answers

export type MathTypeType = "mathTaskWithResult";

export type TaskOptionType = {
  id: number;
  result: number;
  equation: string;
  isCorrect: boolean;
};

export type TaskInfoType = {
  title: string;
  stars: number;
  levelNumber: number;
  isLevelDisabled: boolean;
  isLevelCompleted: boolean;
};

export type MultiAnswerMathTaskType = {
  id: number;
  level: number;
  result: number;
  correctAnswer: number;
  taskType: MathTypeType;
  taskNumberInLevel: number;
  options: TaskOptionType[];
};

export type TaskAnswerType = {
  optionId: number;
  isCorrect: boolean;
};

type AppContextStateType = {
  name: string;
  currentLevel: number;
  results: ResultType[];
  availableLevels: number;
  taskInfos: TaskInfoType[];
  currentTaskInLevel: number;
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

export const ALL_TASKS: {
  [level: string]: MultiAnswerMathTaskType[];
} = {
  1: LEVEL_1,
  2: LEVEL_2,
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

export const initialState: AppContextStateType = {
  name: "Aigars",
  results: [],
  currentLevel: 1,
  currentTaskInLevel: 1,
  availableLevels: Object.keys(ALL_TASKS).length,
  taskInfos: Array.from(
    { length: Object.keys(ALL_TASKS).length },
    (_, index) => ({
      stars: 0,
      levelNumber: index + 1,
      isLevelCompleted: false,
      title: `Task ${index + 1}`,
      isLevelDisabled: index !== 0,
    })
  ),
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

export const appReducer = (
  state: AppContextStateType,
  action: AppContextActionType
): AppContextStateType => {
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
                [state.currentTaskInLevel]: {
                  isTaskChecked: false,
                  answers: [answer],
                },
              },
            },
          ],
        };
      }

      const levelAnswers = foundAnswer.tasks;
      const currentTask = levelAnswers[state.currentTaskInLevel];

      const updatedAnswers = currentTask?.answers?.some(
        (r) => r.optionId === answer.optionId
      )
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
                  [state.currentTaskInLevel]: {
                    ...r.tasks[state.currentTaskInLevel],
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
      // const { level } = action.payload;
      const nextLevelNumber = state.currentTaskInLevel + 1;

      return {
        ...state,
        currentTaskInLevel: nextLevelNumber,
        results: [
          ...state.results,
          {
            level: state.currentLevel.toString(),
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
      const currentLevelAnswers = state.results.find(
        (r) => r.level === state.currentLevel.toString()
      );

      if (!currentLevelAnswers) {
        return state;
      }

      const allLevelResult = Object.values(currentLevelAnswers?.tasks).reduce<
        TaskAnswerType[]
      >((acc, task) => {
        return acc.concat(task.answers);
      }, []);

      const updatedTaskInfos = state.taskInfos.map((t) => {
        if (t.levelNumber === state.currentLevel) {
          return {
            ...t,
            stars: calculateStars(allLevelResult),
            isLevelCompleted: true,
          };
        } else if (t.levelNumber === nextLevel) {
          return {
            ...t,
            isLevelDisabled: false,
          };
        }
        return t;
      });

      return {
        ...state,
        currentTaskInLevel: 1,
        currentLevel: nextLevel,
        taskInfos: updatedTaskInfos,
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
