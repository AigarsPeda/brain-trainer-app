import type { Router } from "expo-router";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";

describe("createLevelNavigationHandlers", () => {
  it("does not finalize task progress when leaving after an incorrect answer", () => {
    const router = { replace: jest.fn() } as unknown as Router & { replace: jest.Mock };
    const finalizeTaskProgress = jest.fn();

    const { handleGoHome } = createLevelNavigationHandlers({
      router,
      hasNextLevel: true,
      nextLevelValue: "2",
      isFinalTaskInLevel: false,
      canFinalizeTaskProgress: () => false,
      finalizeTaskProgress,
    });

    handleGoHome();

    expect(finalizeTaskProgress).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/");
  });

  it("finalizes task progress when leaving after a correct answer", () => {
    const router = { replace: jest.fn() } as unknown as Router & { replace: jest.Mock };
    const finalizeTaskProgress = jest.fn();

    const { handleGoHome } = createLevelNavigationHandlers({
      router,
      hasNextLevel: true,
      nextLevelValue: "2",
      isFinalTaskInLevel: false,
      canFinalizeTaskProgress: () => true,
      finalizeTaskProgress,
    });

    handleGoHome();

    expect(finalizeTaskProgress).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
