import type { TaskInfoType } from "@/data/common";
import { AVAILABLE_LEVEL_COUNT, MULTI_ANSWER_MATH_TASK } from "@/data/math";
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
  result: number;
  correctAnswer: number;
  taskType: MathTypeType;
  options: TaskOptionType[];
};

export type TaskAnswerType = {
  optionId: number;
  isCorrect: boolean;
};

type AppContextStateType = {
  name: string;
  taskInfos: TaskInfoType[];
  multiAnswerMathTasks: MultiAnswerMathTaskType[];

  resultsObj: {
    [level: string]: {
      isLevelLocked: boolean;
      isLevelCompleted: boolean;
      tasks: {
        [taskId: number]: {
          isTaskChecked: boolean;
          answers: TaskAnswerType[];
        };
      };
    };
  };
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

export const initialState: AppContextStateType = {
  name: "Aigars",
  resultsObj: {},
  multiAnswerMathTasks: MULTI_ANSWER_MATH_TASK,
  taskInfos: Array.from({ length: AVAILABLE_LEVEL_COUNT }, (_, index) => ({
    id: index + 1,
    title: `Task ${index + 1}`,
    stars: 5,
  })),
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
    taskId: number;
    answer: {
      optionId: number;
      isCorrect: boolean;
    };
  };
}

interface SetIsCheckedForTaskActionType {
  type: "SET_IS_CHECKED_FOR_TASK";
  payload: {
    level: string;
    taskId: number;
  };
}

interface CreateNextLevelActionType {
  type: "CREATE_NEXT_LEVEL";
  payload: {
    level: string;
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
      const { level, answer, taskId } = action.payload;

      const currentTask = state.resultsObj[level]?.tasks[taskId] || {};
      const currentTaskAnswers = currentTask.answers || [];

      const updatedAnswers = currentTaskAnswers.some(
        (r) => r.optionId === answer.optionId
      )
        ? currentTaskAnswers.filter((r) => r.optionId !== answer.optionId)
        : [
            ...currentTaskAnswers,
            {
              optionId: answer.optionId,
              isCorrect: answer.isCorrect,
            },
          ];

      return {
        ...state,
        resultsObj: {
          ...state.resultsObj,
          [level]: {
            ...state.resultsObj[level],
            tasks: {
              ...state.resultsObj[level]?.tasks,
              [taskId]: {
                ...state.resultsObj[level]?.tasks[taskId],
                answers: updatedAnswers,
              },
            },
          },
        },
      };
    }

    case "SET_IS_CHECKED_FOR_TASK": {
      const { level, taskId } = action.payload;

      const currentTask = state.resultsObj[level]?.tasks[taskId] || {};

      const updatedTask = {
        ...currentTask,
        isTaskChecked: true,
      };

      return {
        ...state,
        resultsObj: {
          ...state.resultsObj,
          [level]: {
            ...state.resultsObj[level],
            tasks: {
              ...state.resultsObj[level]?.tasks,
              [taskId]: updatedTask,
            },
          },
        },
      };
    }

    case "CREATE_NEXT_LEVEL": {
      const { level } = action.payload;
      const taskId = Object.keys(state.resultsObj[level]?.tasks || {}).length;

      return {
        ...state,
        resultsObj: {
          ...state.resultsObj,
          [level]: {
            ...state.resultsObj[level],
            tasks: {
              ...state.resultsObj[level]?.tasks,
              [taskId]: {
                isTaskChecked: false,
                answers: [],
              },
            },
          },
        },
      };
    }

    default: {
      console.log("ACTION NOT FOUND", action);
      return state;
    }
  }
};
