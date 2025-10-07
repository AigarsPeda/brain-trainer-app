import type { TaskType } from "@/context/app.context.reducer";

export const LEVEL_1: TaskType[] = [
  {
    id: 5,
    taskType: "createMathTask",
    result: 8,
    level: 1,
    operation: "+",
    taskNumberInLevel: 1,
    options: [
      {
        id: 1,
        number: "4",
      },
      {
        id: 3,
        number: "5",
      },
      {
        id: 4,
        number: "6",
      },
      {
        id: 2,
        number: "3",
      },
    ],
  },
  // {
  //   id: 1,
  //   taskType: "mathTaskWithResult",
  //   result: 8,
  //   level: 1,
  //   taskNumberInLevel: 1,
  //   options: [
  //     {
  //       id: 1,
  //       equation: "4 + 4",
  //     },
  //     {
  //       id: 3,
  //       equation: "10 - 2",
  //     },
  //     {
  //       id: 4,
  //       equation: "6 + 3",
  //     },
  //     {
  //       id: 2,
  //       equation: "5 + 2",
  //     },
  //   ],
  // },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    level: 1,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "1 + 2" },
      { id: 3, equation: "5 - 2" },
      { id: 4, equation: "4 + 3" },
      { id: 2, equation: "5 + 2" },
    ],
  },
  {
    id: 3,
    taskType: "mathTaskWithResult",
    result: 6,
    level: 1,
    taskNumberInLevel: 3,
    options: [
      { id: 1, equation: "5 - 2" },
      { id: 3, equation: "7 - 2" },
      { id: 4, equation: "6 - 0" },
      { id: 2, equation: "8 - 3" },
    ],
  },
  {
    id: 4,
    taskType: "mathTaskWithResult",
    result: 10,
    level: 1,
    taskNumberInLevel: 4,
    options: [
      { id: 1, equation: "5 + 5" },
      { id: 3, equation: "7 + 3" },
      { id: 4, equation: "6 - 0" },
      { id: 2, equation: "7 + 2" },
    ],
  },
];
