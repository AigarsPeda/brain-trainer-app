import type { TaskInfoType } from "@/data/common";
import { FIRST_LEVEL } from "@/data/math";
import { createContext } from "react";

export type MathTypeType = "mathTaskWithResult";

export type TaskOptionType = {
  id: number;
  result: number;
  equation: string;
  isCorrect: boolean;
};

// Level -> Multiple tasks -> One task -> Multiple answers

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
  taskInfos: TaskInfoType[];
  currentTaskInLevel: number;
};

export type AppContextActionType =
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
  0: FIRST_LEVEL,
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
  currentLevel: 0,
  currentTaskInLevel: 0,
  taskInfos: Array.from(
    { length: Object.keys(ALL_TASKS).length },
    (_, index) => ({
      id: index + 1,
      title: `Task ${index + 1}`,
      stars: 5,
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

export const appReducer = (
  state: AppContextStateType,
  action: AppContextActionType
): AppContextStateType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_RESULT_FOR_TASK": {
      const { level, answer } = action.payload;
      const foundAnnswer = state.results.find((r) => r.level === level);

      if (!foundAnnswer) {
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

      const levelAnnswers = foundAnnswer.tasks;
      const currentTask = levelAnnswers[state.currentTaskInLevel];

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
      const foundAnnswer = state.results.find((r) => r.level === level);
      const levelAnnswers = foundAnnswer?.tasks || {};
      const currentTask = levelAnnswers[currentTaskNumber] || {};

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

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
