import type { MultiAnswerMathTaskType } from "@/context/app.context.reducer";

export const LEVEL_3: MultiAnswerMathTaskType[] = [
  {
    id: 1,
    taskNumberInLevel: 1,
    taskType: "mathTaskWithResult",
    result: 14,
    options: [
      {
        id: 1,
        equation: "4 + 10",
      },
      {
        id: 2,
        equation: "6 + 6",
      },
      {
        id: 3,
        equation: "21 - 7",
      },
      {
        id: 4,
        equation: "10 + 5",
      },
    ],
  },
];
