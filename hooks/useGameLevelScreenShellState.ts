import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ADDITIONAL_TOP_PADDING = 12;
const BASE_BOTTOM_PADDING = 25;

type GameLevelScreenStatusArgs = {
  currentTaskExists: boolean;
  hasLevelTasks: boolean;
  hasValidLevelNumber: boolean;
  levelParam?: string;
};

export type GameLevelScreenUnavailableState = {
  status: "invalidLevel" | "noTasks" | "noCurrentTask";
  message: string;
};

export function getGameLevelScreenUnavailableState({
  currentTaskExists,
  hasLevelTasks,
  hasValidLevelNumber,
  levelParam,
}: GameLevelScreenStatusArgs): GameLevelScreenUnavailableState | null {
  if (!levelParam || !hasValidLevelNumber) {
    return {
      status: "invalidLevel",
      message: "Nav atrasts līmenis",
    };
  }

  if (!hasLevelTasks) {
    return {
      status: "noTasks",
      message: "Nav uzdevumu",
    };
  }

  if (!currentTaskExists) {
    return {
      status: "noCurrentTask",
      message: "Nav atrasts uzdevums",
    };
  }

  return null;
}

type UseGameLevelScreenShellStateArgs = {
  hideAllModals: () => void;
};

export function useGameLevelScreenShellState({ hideAllModals }: UseGameLevelScreenShellStateArgs) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleGoHome = useCallback(() => {
    hideAllModals();
    router.replace("/");
  }, [hideAllModals, router]);

  return {
    handleGoBack,
    handleGoHome,
    itemsWrapPaddingBottom: BASE_BOTTOM_PADDING + insets.bottom,
    itemsWrapPaddingTop: insets.top + ADDITIONAL_TOP_PADDING,
  };
}
