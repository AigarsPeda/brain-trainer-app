import {
  AppDispatchContext,
  AppStateContext,
  AppStatsContext,
  AppThemeContext,
  TaskType,
} from "@/context/app.context.reducer";
import { useContext, useCallback } from "react";
import { getMathExplanation, MathExplanation } from "@/utils/mathExplanations";

export const useAppState = () => {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error("useAppState must be used within an AppContextProvider");
  }

  return state;
};

export const useAppDispatch = () => {
  const dispatch = useContext(AppDispatchContext);

  if (!dispatch) {
    throw new Error("useAppDispatch must be used within an AppContextProvider");
  }

  return dispatch;
};

export const useAppTheme = () => {
  return useContext(AppThemeContext);
};

export const useAppStats = () => {
  const stats = useContext(AppStatsContext);

  if (!stats) {
    throw new Error("useAppStats must be used within an AppContextProvider");
  }

  return stats;
};

const useAppContext = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const getTaskExplanation = useCallback((task: TaskType): MathExplanation => {
    return getMathExplanation(task);
  }, []);

  return {
    state,
    dispatch,
    getTaskExplanation,
  };
};

export default useAppContext;
