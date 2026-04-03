import { describe, expect, it } from "@jest/globals";
import { getLevelSelectionState } from "@/context/app.context.reducer";
import { getBossRetryState, normalizeLevelParam, parseLevelParam } from "@/utils/gameLevelScreen.helpers";

describe("game level screen helpers", () => {
  it("normalizes route params and validates positive integer levels", () => {
    expect(normalizeLevelParam("5")).toBe("5");
    expect(normalizeLevelParam(["12", "13"])).toBe("12");

    expect(parseLevelParam("7")).toEqual({
      levelParam: "7",
      levelNumber: 7,
      hasValidLevelNumber: true,
    });

    expect(parseLevelParam("0").hasValidLevelNumber).toBe(false);
    expect(parseLevelParam("abc").hasValidLevelNumber).toBe(false);
    expect(parseLevelParam(undefined).hasValidLevelNumber).toBe(false);
  });

  it("derives boss retry state from the active level and cooldown", () => {
    expect(
      getBossRetryState({
        bossLevel: false,
        levelNumber: 10,
        lastAttemptedBossLevel: 10,
        bossRetryAvailableAt: 2500,
        now: 2000,
      })
    ).toEqual({
      isCurrentBossRetryLevel: false,
      hasBossRetryState: false,
      hasActiveBossRetryCooldown: false,
      canRetryBossForFree: false,
    });

    expect(
      getBossRetryState({
        bossLevel: true,
        levelNumber: 10,
        lastAttemptedBossLevel: 10,
        bossRetryAvailableAt: 2500,
        now: 2000,
      })
    ).toEqual({
      isCurrentBossRetryLevel: true,
      hasBossRetryState: true,
      hasActiveBossRetryCooldown: true,
      canRetryBossForFree: false,
    });

    expect(
      getBossRetryState({
        bossLevel: true,
        levelNumber: 10,
        lastAttemptedBossLevel: 10,
        bossRetryAvailableAt: 1500,
        now: 2000,
      })
    ).toEqual({
      isCurrentBossRetryLevel: true,
      hasBossRetryState: true,
      hasActiveBossRetryCooldown: false,
      canRetryBossForFree: true,
    });
  });

  it("uses persisted progress for non-current levels and in-progress task state for the active level", () => {
    const sharedState = {
      levels: [
        {
          levelNumber: 3,
          isLevelCompleted: false,
          isLevelLocked: false,
          stars: 0,
          title: "Task 3",
        },
      ],
      results: {
        "3": {
          tasksResults: [
            { taskNumber: "1", correctnessPercentage: 100 },
            { taskNumber: "2", correctnessPercentage: 66 },
          ],
        },
      },
    };

    expect(getLevelSelectionState(sharedState, 3)).toMatchObject({
      isCurrentLevel: false,
      levelResultsCount: 2,
      nextTaskInLevel: 3,
      currentTaskInLevel: 3,
    });

    expect(
      getLevelSelectionState(
        {
          ...sharedState,
          game: {
            currentLevel: 3,
            currentTaskInLevel: 2,
          },
        },
        3
      )
    ).toMatchObject({
      isCurrentLevel: true,
      nextTaskInLevel: 3,
      currentTaskInLevel: 2,
    });
  });

  it("resets completed levels back to the first task", () => {
    expect(
      getLevelSelectionState(
        {
          levels: [
            {
              levelNumber: 8,
              isLevelCompleted: true,
              isLevelLocked: false,
              stars: 3,
              title: "Task 8",
            },
          ],
          results: {
            "8": {
              tasksResults: [{ taskNumber: "1", correctnessPercentage: 100 }],
            },
          },
        },
        8
      )
    ).toMatchObject({
      isLevelCompleted: true,
      nextTaskInLevel: 1,
      currentTaskInLevel: 1,
    });
  });
});
