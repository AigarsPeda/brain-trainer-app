import type { MultiAnswerMathTaskType } from "@/context/app.context.reducer";

export const LEVEL_1: MultiAnswerMathTaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 8,
    correctAnswer: 2,
    level: 1,
    taskNumberInLevel: 1,
    options: [
      {
        id: 1,
        equation: "4 + 4",
        result: 8,
        isCorrect: true,
      },
      {
        id: 3,
        equation: "10 - 2",
        result: 8,
        isCorrect: true,
      },
      {
        id: 4,
        equation: "6 + 3",
        result: 9,
        isCorrect: false,
      },
      {
        id: 2,
        equation: "5 + 2",
        result: 7,
        isCorrect: false,
      },
    ],
  },
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 3,
    correctAnswer: 2,
    level: 1,
    taskNumberInLevel: 2,
    options: [
      {
        id: 1,
        equation: "1 + 2",
        result: 8,
        isCorrect: true,
      },
      {
        id: 3,
        equation: "5 - 2",
        result: 8,
        isCorrect: true,
      },
      {
        id: 4,
        equation: "4 + 3",
        result: 9,
        isCorrect: false,
      },
      {
        id: 2,
        equation: "5 + 2",
        result: 7,
        isCorrect: false,
      },
    ],
  },
];
