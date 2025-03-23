import type { MultiAnswerMathTaskType } from "@/context/app.context.reducer";

export const LEVEL_2: MultiAnswerMathTaskType[] = [
  {
    id: 1,
    level: 2,
    taskNumberInLevel: 1,
    taskType: "mathTaskWithResult",
    result: 12,
    // correctAnswer: 12,
    options: [
      {
        id: 1,
        equation: "4 + 8",
        isCorrect: true,
      },
      {
        id: 2,
        equation: "6 + 6",
        isCorrect: true,
      },
      {
        id: 3,
        equation: "10 - 7",
        isCorrect: false,
      },
      {
        id: 4,
        equation: "10 + 5",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    level: 2,
    taskNumberInLevel: 2,
    taskType: "mathTaskWithResult",
    result: 4,
    // correctAnswer: 4,
    options: [
      {
        id: 1,
        equation: "2 + 2",
        isCorrect: true,
      },
      {
        id: 2,
        equation: "6 - 2",
        isCorrect: true,
      },
      {
        id: 3,
        equation: "4 + 3",
        isCorrect: false,
      },
      {
        id: 4,
        equation: "5 + 2",
        isCorrect: false,
      },
    ],
  },
];
