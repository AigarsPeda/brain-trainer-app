import { createContext } from "react";

type AppContextState = {
  name: string;
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
