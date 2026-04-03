import { describe, expect, it, jest } from "@jest/globals";

import { deriveGameLevelDerivedState } from "@/hooks/useGameLevelDerivedState";
import type { TaskType } from "@/context/app.context.reducer";
import type { MathExplanation } from "@/utils/mathExplanations";

const explanation: MathExplanation = {
  title: "Example",
  example: {
    left: 1,
    right: 2,
    operation: "+",
    result: 3,
  },
  visualItems: {
    leftItems: [],
    rightItems: [],
    operationSymbol: "+",
  },
};

const mathTask: TaskType = {
  id: 42,
  result: 3,
  taskType: "mathTaskWithResult",
  taskNumberInLevel: 4,
  options: [{ id: 1, equation: "1+2" }],
};

describe("deriveGameLevelDerivedState", () => {
  it("derives non-boss presentation state from the current task", () => {
    const getTaskExplanation = jest.fn(() => explanation);
    const onBossFailure = jest.fn();
    const onBossInteraction = jest.fn();
    const onBossRetryRequest = jest.fn();
    const getLevelCompletionDurationMs = jest.fn(() => 1234);

    const result = deriveGameLevelDerivedState({
      bossLevel: false,
      currentTask: mathTask,
      getLevelCompletionDurationMs,
      getTaskExplanation,
      levelParam: "12",
      maxLevelStep: 4,
      onBossFailure,
      onBossInteraction,
      onBossRetryRequest,
      theme: "light",
    });

    expect(result.backgroundColors).toEqual(["#F0F9FF", "#ECFEFF", "#F8FAFC"]);
    expect(result.currentTaskExplanation).toBe(explanation);
    expect(result.isFinalTaskInLevel).toBe(true);
    expect(result.taskKey).toBe("12-42-4");
    expect(result.taskSession).toEqual({
      getLevelCompletionDurationMs,
      isBossLevel: false,
      onBossFailure,
      onBossInteraction,
      onBossRetryRequest,
    });
    expect(getTaskExplanation).toHaveBeenCalledWith(mathTask);
  });

  it("uses boss visuals and avoids explanation lookup when there is no current task", () => {
    const getTaskExplanation = jest.fn(() => explanation);

    const result = deriveGameLevelDerivedState({
      bossLevel: true,
      currentTask: undefined,
      getLevelCompletionDurationMs: () => 0,
      getTaskExplanation,
      levelParam: "10",
      maxLevelStep: 5,
      onBossFailure: () => undefined,
      onBossInteraction: () => undefined,
      onBossRetryRequest: () => undefined,
      theme: "dark",
    });

    expect(result.backgroundColors).toEqual(["#7C2D12", "#92400E", "#1C1917"]);
    expect(result.currentTaskExplanation).toBeNull();
    expect(result.isFinalTaskInLevel).toBe(false);
    expect(result.taskKey).toBe("10-missing-task");
    expect(getTaskExplanation).not.toHaveBeenCalled();
  });
});
