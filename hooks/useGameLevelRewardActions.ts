import type { AppContextActionType } from "@/context/app.context.reducer";
import type { BossModalMode } from "@/hooks/useBossLevelFlow";
import { useCallback } from "react";

type ShowAdForReward = (onReward: () => void, onAdClosed?: () => void) => boolean;

type UseGameLevelRewardActionsArgs = {
  dispatch: React.Dispatch<AppContextActionType>;
  gems: number;
  prepareGemRewardAnimation: (gemAnimationStartValue: number) => void;
  setBossModalMode: React.Dispatch<React.SetStateAction<BossModalMode>>;
  showAdForReward: ShowAdForReward;
  showGemRewardAnimation: (gemAnimationStartValue: number) => void;
};

export function useGameLevelRewardActions({
  dispatch,
  gems,
  prepareGemRewardAnimation,
  setBossModalMode,
  showAdForReward,
  showGemRewardAnimation,
}: UseGameLevelRewardActionsArgs) {
  const handleWatchAd = useCallback(() => {
    showAdForReward(() => {
      dispatch({ type: "RESTORE_LIFE_FROM_AD" });
    });
  }, [dispatch, showAdForReward]);

  const handleWatchAdForGems = useCallback(() => {
    prepareGemRewardAnimation(gems);
    let rewardEarned = false;

    showAdForReward(
      () => {
        rewardEarned = true;
      },
      () => {
        if (!rewardEarned) {
          return;
        }

        dispatch({ type: "ADD_GEMS_FROM_AD" });
        showGemRewardAnimation(gems);
        setBossModalMode((currentMode) =>
          currentMode === "expired" || currentMode === "retry" ? "retry" : currentMode
        );
      }
    );
  }, [dispatch, gems, prepareGemRewardAnimation, setBossModalMode, showAdForReward, showGemRewardAnimation]);

  return {
    handleWatchAd,
    handleWatchAdForGems,
  };
}
