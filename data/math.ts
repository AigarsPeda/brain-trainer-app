import type { MathTaskType } from "@/context/app.context.reducer";

export const MATH_TASK: MathTaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 8,
    variants: [
      {
        id: 1,
        equation: "4 + 4",
        result: 8,
        isCorrect: true,
      },
      {
        id: 2,
        equation: "5 + 2",
        result: 7,
        isCorrect: false,
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
    ],
  },
];

// export const AVAILABLE_LEVEL_COUNT = Object.keys(MATH_TASKS).length * 10;
export const AVAILABLE_LEVEL_COUNT = 50;
