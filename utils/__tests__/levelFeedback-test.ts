import { describe, expect, it } from "@jest/globals";
import { buildLevelFeedbackSummary, buildTaskFeedbackEntries, formatCompletionTime } from "@/utils/levelFeedback";
import { TaskType } from "@/context/app.context.reducer";

describe("level feedback", () => {
  it("summarizes accuracy, best streak, weak task types, and next step", () => {
    const levelTasks: TaskType[] = [
      {
        id: 1,
        result: 4,
        taskType: "mathTaskWithResult",
        taskNumberInLevel: 1,
        options: [{ id: 1, equation: "2 + 2" }],
      },
      {
        id: 2,
        result: 8,
        taskType: "createMathTask",
        taskNumberInLevel: 2,
        operation: "+",
        options: [
          { id: 1, number: "3" },
          { id: 2, number: "5" },
        ],
      },
      {
        id: 3,
        result: 7,
        taskType: "textTask",
        taskNumberInLevel: 3,
        question: "Test",
        icon: 1,
      },
    ];

    const summary = buildLevelFeedbackSummary(
      buildTaskFeedbackEntries(levelTasks, [
        { taskNumber: "1", correctnessPercentage: 33.33 },
        { taskNumber: "2", correctnessPercentage: 10 },
        { taskNumber: "3", correctnessPercentage: 33.33 },
      ]),
      3,
      125000
    );

    expect(summary.accuracy).toBe(77);
    expect(summary.bestStreak).toBe(1);
    expect(summary.completionTimeMs).toBe(125000);
    expect(summary.weakTaskTypes[0]).toMatchObject({
      taskType: "createMathTask",
      averageScore: 30,
    });
    expect(summary.recommendedNextStep).toContain("vienādojuma");
  });

  it("formats completion time for display", () => {
    expect(formatCompletionTime(42000)).toBe("42 sek");
    expect(formatCompletionTime(125000)).toBe("2 min 05 sek");
    expect(formatCompletionTime(3900000)).toBe("1 h 5 min");
  });
});
