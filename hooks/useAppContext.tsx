import { AppContext, TaskType } from "@/context/app.context.reducer";
import { useContext, useCallback } from "react";
import { getMathExplanation, MathExplanation } from "@/utils/mathExplanations";

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  const getTaskExplanation = useCallback((task: TaskType): MathExplanation => {
    return getMathExplanation(task);
  }, []);

  return {
    state: context.state,
    dispatch: context.dispatch,
    getTaskExplanation,
  };
};

export default useAppContext;
