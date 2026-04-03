import { describe, expect, it } from "@jest/globals";
import { deriveGameLevelRouteState } from "@/hooks/useGameLevelRouteState";

describe("deriveGameLevelRouteState", () => {
  it("keeps the current in-progress task when the selected level is active", () => {
    expect(
      deriveGameLevelRouteState({
        bossRetryAvailableAt: null,
        currentLevel: 8,
        currentTaskInLevel: 2,
        lastAttemptedBossLevel: null,
        level: "8",
        levels: [
          {
            levelNumber: 8,
            isLevelCompleted: false,
            isLevelLocked: false,
            stars: 1,
            title: "Task 8",
          },
        ],
        results: {
          "8": {
            tasksResults: [{ taskNumber: "1", correctnessPercentage: 100 }],
          },
        },
      })
    ).toMatchObject({
      bossLevel: false,
      currentLevelResultsCount: 1,
      effectiveTaskInLevel: 2,
      hasValidLevelNumber: true,
      levelNumber: 8,
      levelParam: "8",
      levelSelection: {
        currentTaskInLevel: 2,
        isCurrentLevel: true,
        nextTaskInLevel: 2,
      },
    });
  });

  it("derives boss retry cooldown for valid boss levels and falls back cleanly for invalid routes", () => {
    const now = Date.now();

    expect(
      deriveGameLevelRouteState({
        bossRetryAvailableAt: now + 500,
        currentLevel: 10,
        currentTaskInLevel: 3,
        lastAttemptedBossLevel: 10,
        level: "10",
        levels: [
          {
            levelNumber: 10,
            isLevelCompleted: false,
            isLevelLocked: false,
            stars: 2,
            title: "Boss 10",
          },
        ],
        results: {
          "10": {
            tasksResults: [{ taskNumber: "1", correctnessPercentage: 100 }],
          },
        },
      })
    ).toMatchObject({
      bossLevel: true,
      canRetryBossForFree: false,
      hasActiveBossRetryCooldown: true,
      hasBossRetryState: true,
    });

    expect(
      deriveGameLevelRouteState({
        bossRetryAvailableAt: now + 500,
        currentLevel: 4,
        currentTaskInLevel: 2,
        lastAttemptedBossLevel: 10,
        level: "nope",
        levels: [],
        results: {},
      })
    ).toMatchObject({
      bossLevel: false,
      currentLevelResultsCount: 0,
      effectiveTaskInLevel: 2,
      hasActiveBossRetryCooldown: false,
      hasBossRetryState: false,
      hasValidLevelNumber: false,
      levelSelection: null,
    });
  });
});
