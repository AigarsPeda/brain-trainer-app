import { AppContext } from "@/context/app.context.reducer";
import { useContext } from "react";

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return {
    state: context.state,
    dispatch: context.dispatch,
  };
};

export default useAppContext;
