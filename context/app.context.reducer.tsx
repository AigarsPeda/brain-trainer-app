import type { TaskInfoType } from "@/data/common";
import { AVAILABLE_LEVEL_COUNT, MATH_TASK } from "@/data/math";
import { createContext } from "react";

export type MathTypeType = "mathTaskWithResult";

export type TaskVariantType = {
  id: number;
  result: number;
  equation: string;
  isCorrect: boolean;
};

export type MathTaskType = {
  id: number;
  result: number;
  taskType: MathTypeType;
  variants: TaskVariantType[];
};

export type TaskAnnswerType = {
  result: number;
  annswerId: number;
  isCorrect: boolean;
};

type AppContextStateType = {
  name: string;
  taskInfos: TaskInfoType[];
  mathTasks: MathTaskType[];
  resultsObj: {
    [level: string]: {
      [taskNumber: number]: TaskAnnswerType[];
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
  mathTasks: MATH_TASK,
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
    taskNumber: number;
    answer: TaskAnnswerType;
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
      console.log("action.payload", action.payload);
      console.log("state.resultsObj", state.resultsObj);

      const levelResults =
        state.resultsObj?.[action.payload.level]?.[action.payload.taskNumber] ??
        [];
      console.log("levelResults", levelResults);

      const indexOfTask = levelResults.findIndex(
        (r) => r?.annswerId === action.payload.answer.annswerId
      );

      if (indexOfTask !== -1) {
        levelResults.splice(indexOfTask, 1);
      } else {
        levelResults.push(action.payload.answer);
      }

      return {
        ...state,
        resultsObj: {
          ...state.resultsObj,
          [action.payload.level]: {
            ...state.resultsObj[action.payload.taskNumber],
            [action.payload.taskNumber]: levelResults,
          },
        },
      };

    default:
      return state;
  }
};
