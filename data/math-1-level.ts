import type { TaskType } from "@/context/app.context.reducer";

export const LEVEL_1: TaskType[] = [
  // {
  //   id: 5,
  //   taskType: "createMathTask",
  //   result: 8,
  //   level: 1,
  //   operation: "+",
  //   taskNumberInLevel: 1,
  //   options: [
  //     {
  //       id: 1,
  //       number: "4",
  //       isCorrect: false,
  //     },
  //     {
  //       id: 3,
  //       number: "5",
  //       isCorrect: true,
  //     },
  //     {
  //       id: 4,
  //       number: "6",
  //       isCorrect: false,
  //     },
  //     {
  //       id: 2,
  //       number: "3",
  //       isCorrect: true,
  //     },
  //   ],
  // },
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 8,
    level: 1,
    taskNumberInLevel: 1,
    options: [
      {
        id: 1,
        equation: "4 + 4",
        isCorrect: true,
      },
      {
        id: 3,
        equation: "10 - 2",
        isCorrect: true,
      },
      {
        id: 4,
        equation: "6 + 3",
        isCorrect: false,
      },
      {
        id: 2,
        equation: "5 + 2",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    level: 1,
    taskNumberInLevel: 2,
    options: [
      {
        id: 1,
        equation: "1 + 2",
        isCorrect: true,
      },
      {
        id: 3,
        equation: "5 - 2",
        isCorrect: true,
      },
      {
        id: 4,
        equation: "4 + 3",
        isCorrect: false,
      },
      {
        id: 2,
        equation: "5 + 2",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    taskType: "mathTaskWithResult",
    result: 6,
    level: 1,
    taskNumberInLevel: 3,
    options: [
      {
        id: 1,
        equation: "5 - 2",
        isCorrect: false,
      },
      {
        id: 3,
        equation: "7 - 2",
        isCorrect: false,
      },
      {
        id: 4,
        equation: "6 - 0",
        isCorrect: true,
      },
      {
        id: 2,
        equation: "5 - 2",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    taskType: "mathTaskWithResult",
    result: 10,
    level: 1,
    taskNumberInLevel: 4,
    options: [
      {
        id: 1,
        equation: "5 + 5",
        isCorrect: true,
      },
      {
        id: 3,
        equation: "7 + 3",
        isCorrect: true,
      },
      {
        id: 4,
        equation: "6 - 0",
        isCorrect: false,
      },
      {
        id: 2,
        equation: "7 + 2",
        isCorrect: false,
      },
    ],
  },
];
