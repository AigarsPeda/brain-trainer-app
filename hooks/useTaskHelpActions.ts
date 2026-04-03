import { HINT_COST, REMOVE_WRONG_ANSWER_COST } from "@/constants/GameSettings";
import {
  AppContextActionType,
  isCreateMathTask,
  isMultiAnswerMathTask,
  isTextTask,
  TaskType,
} from "@/context/app.context.reducer";
import { findIncorrectCreateMathOptions, findIncorrectMultiAnswerOptions, selectRandomItem } from "@/utils/taskHelpers";
import { useCallback, useMemo } from "react";

type UseTaskHelpActionsArgs = {
  bossLevel: boolean;
  currentTask?: TaskType;
  dispatch: React.Dispatch<AppContextActionType>;
  removedAnswerIds: number[];
  setRemovedAnswerIds: React.Dispatch<React.SetStateAction<number[]>>;
  setShowTextTaskAsMultipleChoice: React.Dispatch<React.SetStateAction<boolean>>;
  showTextTaskAsMultipleChoice: boolean;
  openHintModal: () => void;
};

type UseTaskHelpActionsResult = {
  canRemoveAnswer: boolean;
  handlePurchaseHint: () => void;
  handleRemoveWrongAnswer: () => void;
};

export function useTaskHelpActions({
  bossLevel,
  currentTask,
  dispatch,
  removedAnswerIds,
  setRemovedAnswerIds,
  setShowTextTaskAsMultipleChoice,
  showTextTaskAsMultipleChoice,
  openHintModal,
}: UseTaskHelpActionsArgs): UseTaskHelpActionsResult {
  const canRemoveAnswer = useMemo(() => {
    if (bossLevel || !currentTask) {
      return false;
    }

    if (isTextTask(currentTask)) {
      return !showTextTaskAsMultipleChoice;
    }

    const remainingOptions = currentTask.options.filter((option) => !removedAnswerIds.includes(option.id));

    if (isMultiAnswerMathTask(currentTask)) {
      return remainingOptions.length > 1;
    }

    if (isCreateMathTask(currentTask)) {
      return remainingOptions.length > 2;
    }

    return false;
  }, [bossLevel, currentTask, removedAnswerIds, showTextTaskAsMultipleChoice]);

  const handlePurchaseHint = useCallback(() => {
    dispatch({ type: "SPEND_GEMS", payload: HINT_COST });
    openHintModal();
  }, [dispatch, openHintModal]);

  const handleRemoveWrongAnswer = useCallback(() => {
    if (!currentTask) {
      return;
    }

    dispatch({ type: "SPEND_GEMS", payload: REMOVE_WRONG_ANSWER_COST });

    if (isTextTask(currentTask)) {
      setShowTextTaskAsMultipleChoice(true);
      return;
    }

    const incorrectOptions: Array<{ id: number }> = isMultiAnswerMathTask(currentTask)
      ? findIncorrectMultiAnswerOptions(currentTask, removedAnswerIds)
      : findIncorrectCreateMathOptions(currentTask, removedAnswerIds);

    const randomIncorrect = selectRandomItem(incorrectOptions);

    if (randomIncorrect) {
      setRemovedAnswerIds((previous) => [...previous, randomIncorrect.id]);
    }
  }, [currentTask, dispatch, removedAnswerIds, setRemovedAnswerIds, setShowTextTaskAsMultipleChoice]);

  return {
    canRemoveAnswer,
    handlePurchaseHint,
    handleRemoveWrongAnswer,
  };
}
