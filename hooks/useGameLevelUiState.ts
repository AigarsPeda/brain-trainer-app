import { type SetStateAction, useCallback, useState } from "react";

type ModalType = "help" | "hint" | "info" | "lives" | "bossTimer" | null;

type HelpRewardState = {
  gemAnimationStartValue?: number;
  showGemAnimation: boolean;
};

type TaskAssistState = {
  removedAnswerIds: number[];
  showTextTaskAsMultipleChoice: boolean;
};

const defaultHelpRewardState: HelpRewardState = {
  gemAnimationStartValue: undefined,
  showGemAnimation: false,
};

const defaultTaskAssistState: TaskAssistState = {
  removedAnswerIds: [],
  showTextTaskAsMultipleChoice: false,
};

export function useGameLevelUiState() {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [helpRewardState, setHelpRewardState] = useState<HelpRewardState>(defaultHelpRewardState);
  const [taskAssistState, setTaskAssistState] = useState<TaskAssistState>(defaultTaskAssistState);

  const setRemovedAnswerIds = useCallback((value: SetStateAction<number[]>) => {
    setTaskAssistState((previousState) => ({
      ...previousState,
      removedAnswerIds: typeof value === "function" ? value(previousState.removedAnswerIds) : value,
    }));
  }, []);

  const setShowTextTaskAsMultipleChoice = useCallback((value: SetStateAction<boolean>) => {
    setTaskAssistState((previousState) => ({
      ...previousState,
      showTextTaskAsMultipleChoice:
        typeof value === "function" ? value(previousState.showTextTaskAsMultipleChoice) : value,
    }));
  }, []);

  const resetTaskUiState = useCallback(() => {
    setTaskAssistState(defaultTaskAssistState);
  }, []);

  const hideAllModals = useCallback(() => {
    setOpenModal(null);
  }, []);

  const hideHelpModal = useCallback(() => {
    setOpenModal(null);
    setHelpRewardState(defaultHelpRewardState);
  }, []);

  const onOpenHelp = useCallback(() => {
    setOpenModal("help");
  }, []);

  const openHintModal = useCallback(() => {
    setOpenModal("hint");
  }, []);

  const onOpenInfo = useCallback(() => {
    setOpenModal("info");
  }, []);

  const onOpenLives = useCallback(() => {
    setOpenModal("lives");
  }, []);

  const showBossTimerModal = useCallback(() => {
    setOpenModal("bossTimer");
  }, []);

  const hideBossTimerModal = useCallback(() => {
    setOpenModal((currentOpenModal) => (currentOpenModal === "bossTimer" ? null : currentOpenModal));
  }, []);

  const prepareGemRewardAnimation = useCallback((gemAnimationStartValue: number) => {
    setHelpRewardState({
      gemAnimationStartValue,
      showGemAnimation: false,
    });
  }, []);

  const showGemRewardAnimation = useCallback((gemAnimationStartValue: number) => {
    setHelpRewardState({
      gemAnimationStartValue,
      showGemAnimation: true,
    });
  }, []);

  return {
    gemAnimationStartValue: helpRewardState.gemAnimationStartValue,
    helpVisible: openModal === "help",
    hideAllModals,
    hideBossTimerModal,
    hideHelpModal,
    hintVisible: openModal === "hint",
    infoVisible: openModal === "info",
    isBossTimerModalOpen: openModal === "bossTimer",
    livesModalVisible: openModal === "lives",
    onOpenHelp,
    onOpenInfo,
    onOpenLives,
    openHintModal,
    prepareGemRewardAnimation,
    removedAnswerIds: taskAssistState.removedAnswerIds,
    resetTaskUiState,
    setRemovedAnswerIds,
    setShowTextTaskAsMultipleChoice,
    showBossTimerModal,
    showGemAnimation: helpRewardState.showGemAnimation,
    showGemRewardAnimation,
    showTextTaskAsMultipleChoice: taskAssistState.showTextTaskAsMultipleChoice,
  };
}
