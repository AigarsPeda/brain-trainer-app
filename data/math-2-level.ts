import type { MultiAnswerMathTaskType } from "@/context/app.context.reducer";

export const LEVEL_2: MultiAnswerMathTaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 12,
    correctAnswer: 2,
    level: 2,
    taskNumberInLevel: 1,
    options: [
      {
        id: 1,
        equation: "4 + 4",
        result: 8,
        isCorrect: false,
      },
      {
        id: 2,
        equation: "6 + 6",
        result: 9,
        isCorrect: true,
      },
      {
        id: 3,
        equation: "10 - 2",
        result: 8,
        isCorrect: false,
      },

      {
        id: 4,
        equation: "10 + 2",
        result: 7,
        isCorrect: true,
      },
    ],
  },
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 4,
    correctAnswer: 2,
    level: 2,
    taskNumberInLevel: 2,
    options: [
      {
        id: 1,
        equation: "2 + 2",
        result: 8,
        isCorrect: true,
      },
      {
        id: 3,
        equation: "6 - 2",
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
