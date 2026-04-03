import { describe, expect, it } from "@jest/globals";
import { shouldInitializeGameLevelSession } from "@/hooks/useGameLevelSessionLifecycle";

describe("shouldInitializeGameLevelSession", () => {
  it("starts a fresh session only on the first task of a valid level with no stored progress", () => {
    expect(
      shouldInitializeGameLevelSession({
        currentLevelResultsCount: 0,
        currentTaskId: 101,
        effectiveTaskInLevel: 1,
        hasValidLevelNumber: true,
      })
    ).toBe(true);

    expect(
      shouldInitializeGameLevelSession({
        currentLevelResultsCount: 1,
        currentTaskId: 101,
        effectiveTaskInLevel: 1,
        hasValidLevelNumber: true,
      })
    ).toBe(false);

    expect(
      shouldInitializeGameLevelSession({
        currentLevelResultsCount: 0,
        currentTaskId: 101,
        effectiveTaskInLevel: 2,
        hasValidLevelNumber: true,
      })
    ).toBe(false);
  });

  it("does not start a session when the route is invalid or the current task is missing", () => {
    expect(
      shouldInitializeGameLevelSession({
        currentLevelResultsCount: 0,
        currentTaskId: null,
        effectiveTaskInLevel: 1,
        hasValidLevelNumber: true,
      })
    ).toBe(false);

    expect(
      shouldInitializeGameLevelSession({
        currentLevelResultsCount: 0,
        currentTaskId: 101,
        effectiveTaskInLevel: 1,
        hasValidLevelNumber: false,
      })
    ).toBe(false);
  });
});
