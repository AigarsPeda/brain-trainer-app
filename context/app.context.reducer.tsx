import { TaskInfoType } from "@/data/common";
import { AVAILABLE_LEVEL_COUNT } from "@/data/math";
import { createContext } from "react";

type AppContextState = {
  name: string;
  taskInfos: TaskInfoType[];
};

export type AppContextActionType = SetNameAction;

interface SetNameAction {
  type: "SET_NAME";
  payload: string;
}

export type AppContextType = {
  state: AppContextState;
  dispatch: React.Dispatch<AppContextActionType>;
};

export const initialState: AppContextState = {
  name: "Aigars",
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

export const appReducer = (
  state: AppContextState,
  action: AppContextActionType
): AppContextState => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    default:
      return state;
  }
};
