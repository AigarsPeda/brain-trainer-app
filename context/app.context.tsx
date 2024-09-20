import {
  appReducer,
  initialState,
  AppContext,
} from "@/context/app.context.reducer";
import { useReducer } from "react";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
