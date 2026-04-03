import { describe, expect, it } from "@jest/globals";

import { getGameLevelScreenUnavailableState } from "@/hooks/useGameLevelScreenShellState";

describe("getGameLevelScreenUnavailableState", () => {
  it("returns the invalid-level state when the route param is missing or invalid", () => {
    expect(
      getGameLevelScreenUnavailableState({
        currentTaskExists: true,
        hasLevelTasks: true,
        hasValidLevelNumber: false,
        levelParam: "5",
      })
    ).toEqual({
      status: "invalidLevel",
      message: "Nav atrasts līmenis",
    });

    expect(
      getGameLevelScreenUnavailableState({
        currentTaskExists: true,
        hasLevelTasks: true,
        hasValidLevelNumber: true,
        levelParam: undefined,
      })
    ).toEqual({
      status: "invalidLevel",
      message: "Nav atrasts līmenis",
    });
  });

  it("returns task-related fallback states before ready", () => {
    expect(
      getGameLevelScreenUnavailableState({
        currentTaskExists: true,
        hasLevelTasks: false,
        hasValidLevelNumber: true,
        levelParam: "5",
      })
    ).toEqual({
      status: "noTasks",
      message: "Nav uzdevumu",
    });

    expect(
      getGameLevelScreenUnavailableState({
        currentTaskExists: false,
        hasLevelTasks: true,
        hasValidLevelNumber: true,
        levelParam: "5",
      })
    ).toEqual({
      status: "noCurrentTask",
      message: "Nav atrasts uzdevums",
    });
  });

  it("returns null when the screen has everything it needs", () => {
    expect(
      getGameLevelScreenUnavailableState({
        currentTaskExists: true,
        hasLevelTasks: true,
        hasValidLevelNumber: true,
        levelParam: "5",
      })
    ).toBeNull();
  });
});
