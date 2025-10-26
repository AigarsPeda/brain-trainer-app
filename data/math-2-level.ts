import type { MultiAnswerMathTaskType } from "@/context/app.context.reducer";

export const LEVEL_2: MultiAnswerMathTaskType[] = [
  {
    id: 1,
    // level: 2,
    taskNumberInLevel: 1,
    taskType: "mathTaskWithResult",
    result: 12,
    options: [
      {
        id: 1,
        equation: "4 + 8",
      },
      {
        id: 2,
        equation: "6 + 6",
      },
      {
        id: 3,
        equation: "10 - 7",
      },
      {
        id: 4,
        equation: "10 + 5",
      },
    ],
  },
  {
    id: 2,
    // level: 2,
    taskNumberInLevel: 2,
    taskType: "mathTaskWithResult",
    result: 4,
    options: [
      {
        id: 1,
        equation: "2 + 2",
      },
      {
        id: 2,
        equation: "6 - 2",
      },
      {
        id: 3,
        equation: "4 + 3",
      },
      {
        id: 4,
        equation: "5 + 2",
      },
    ],
  },
  {
    id: 3,
    // level: 2,
    taskNumberInLevel: 3,
    taskType: "mathTaskWithResult",
    result: 9,
    options: [
      {
        id: 1,
        equation: "4 + 2",
      },
      {
        id: 2,
        equation: "9 - 2",
      },
      {
        id: 3,
        equation: "6 + 3",
      },
      {
        id: 4,
        equation: "5 + 2",
      },
    ],
  },
];
