import { AppContext, TaskType } from "@/context/app.context.reducer";
import { useContext, useCallback } from "react";
import { getMathExplanation, MathExplanation } from "@/utils/mathExplanations";

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  /**
   * Returns a kid-friendly explanation for a math task based on its type and operation.
   * Useful for showing hints to help kids understand how to solve similar problems.
   */
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
