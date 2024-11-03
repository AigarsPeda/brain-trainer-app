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
      isLevelChecked: boolean;
      isLevelCompleted: boolean;
      answers: TaskAnswerType[];
    };
  };
};

export type AppContextActionType =
  | SetNameActionType
  | SetResultForTaskActionType;

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
    answer: {
      optionId: number;
      isCorrect: boolean;
    };
  };
}

export const appReducer = (
  state: AppContextStateType,
  action: AppContextActionType
): AppContextStateType => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_RESULT_FOR_TASK":
      const { level, answer } = action.payload;
      const currentLevelResults = state.resultsObj[level] || { answers: [] };

      const updatedAnswers = currentLevelResults.answers.some(
        (r) => r.optionId === answer.optionId
      )
        ? currentLevelResults.answers.filter(
            (r) => r.optionId !== answer.optionId
          )
        : [
            ...currentLevelResults.answers,
            { optionId: answer.optionId, isCorrect: answer.isCorrect },
          ];

      return {
        ...state,
        resultsObj: {
          ...state.resultsObj,
          [level]: {
            ...currentLevelResults,
            answers: updatedAnswers,
          },
        },
      };

    default:
      console.log("ACTION NOT FOUND", action);
      return state;
  }
};
