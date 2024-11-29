import type { MultiAnswerMathTaskType } from "@/context/app.context.reducer";

// export const MULTI_ANSWER_MATH_TASK: MultiAnswerMathTaskType[] = [
//   {
//     id: 1,
//     taskType: "mathTaskWithResult",
//     result: 8,
//     correctAnswer: 2,
//     level: 0,
//     options: [
//       {
//         id: 1,
//         equation: "4 + 4",
//         result: 8,
//         isCorrect: true,
//       },
//       {
//         id: 3,
//         equation: "10 - 2",
//         result: 8,
//         isCorrect: true,
//       },
//       {
//         id: 4,
//         equation: "6 + 3",
//         result: 9,
//         isCorrect: false,
//       },
//       {
//         id: 2,
//         equation: "5 + 2",
//         result: 7,
//         isCorrect: false,
//       },
//     ],
//   },
//   {
//     id: 1,
//     taskType: "mathTaskWithResult",
//     result: 3,
//     correctAnswer: 2,
//     level: 0,
//     options: [
//       {
//         id: 1,
//         equation: "1 + 2",
//         result: 8,
//         isCorrect: true,
//       },
//       {
//         id: 3,
//         equation: "5 - 2",
//         result: 8,
//         isCorrect: true,
//       },
//       {
//         id: 4,
//         equation: "4 + 3",
//         result: 9,
//         isCorrect: false,
//       },
//       {
//         id: 2,
//         equation: "5 + 2",
//         result: 7,
//         isCorrect: false,
//       },
//     ],
//   },
// ];

// export const AVAILABLE_LEVEL_COUNT = Object.keys(MATH_TASKS).length * 10;
// export const AVAILABLE_LEVEL_COUNT = 50;

export const FIRST_LEVEL: MultiAnswerMathTaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 8,
    correctAnswer: 2,
    level: 0,
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
    level: 0,
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
