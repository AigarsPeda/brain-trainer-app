import { buildLevelFeedbackSummary, buildTaskFeedbackEntries } from "@/utils/levelFeedback";
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
      3
    );

    expect(summary.accuracy).toBe(77);
    expect(summary.bestStreak).toBe(1);
    expect(summary.weakTaskTypes[0]).toMatchObject({
      taskType: "createMathTask",
      averageScore: 30,
    });
    expect(summary.recommendedNextStep).toContain("vienādojuma");
  });
});
