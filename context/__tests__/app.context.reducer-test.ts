import { appReducer, initialState } from "@/context/app.context.reducer";

describe("appReducer SELECT_LEVEL", () => {
  it("starts an unstarted level from task 1", () => {
    const state = {
      ...initialState,
      results: {
        ...initialState.results,
      },
    };

    const nextState = appReducer(state, {
      type: "SELECT_LEVEL",
      payload: { level: 2 },
    });

    expect(nextState.game).toEqual({
      currentLevel: 2,
      currentTaskInLevel: 1,
    });
    expect(nextState.results["2"]).toEqual({ tasksResults: [] });
  });

  it("resumes an unfinished level from the next task", () => {
    const state = {
      ...initialState,
      results: {
        ...initialState.results,
        "2": {
          tasksResults: [
            { taskNumber: "1", correctnessPercentage: 100 },
            { taskNumber: "2", correctnessPercentage: 80 },
          ],
        },
      },
    };

    const nextState = appReducer(state, {
      type: "SELECT_LEVEL",
      payload: { level: 2 },
    });

    expect(nextState.game).toEqual({
      currentLevel: 2,
      currentTaskInLevel: 3,
    });
  });

  it("restarts a completed level from task 1", () => {
    const state = {
      ...initialState,
      levels: initialState.levels.map((level) =>
        level.levelNumber === 2 ? { ...level, isLevelCompleted: true, isLevelLocked: false } : level
      ),
      results: {
        ...initialState.results,
        "2": {
          tasksResults: [
            { taskNumber: "1", correctnessPercentage: 100 },
            { taskNumber: "2", correctnessPercentage: 100 },
          ],
        },
      },
    };

    const nextState = appReducer(state, {
      type: "SELECT_LEVEL",
      payload: { level: 2 },
    });

    expect(nextState.game).toEqual({
      currentLevel: 2,
      currentTaskInLevel: 1,
    });
  });

  it("preserves other level results when switching levels", () => {
    const state = {
      ...initialState,
      results: {
        ...initialState.results,
        "2": {
          tasksResults: [{ taskNumber: "1", correctnessPercentage: 90 }],
        },
        "3": {
          tasksResults: [{ taskNumber: "1", correctnessPercentage: 70 }],
        },
      },
    };

    const nextState = appReducer(state, {
      type: "SELECT_LEVEL",
      payload: { level: 3 },
    });

    expect(nextState.results["2"]).toEqual(state.results["2"]);
    expect(nextState.results["3"]).toEqual(state.results["3"]);
  });
});
