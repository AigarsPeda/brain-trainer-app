import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

export const LEVEL_1: TaskType[] = [
  {
    id: 8,
    taskType: "createMathTask",
    result: 2,
    operation: "÷",
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
        number: "2",
      },
    ],
  },
  {
    id: 100,
    taskType: "textTask",
    result: 5,
    taskNumberInLevel: 2,
    icon: AppleIcon,
    question: "Man ir 3 āboli. Mamma iedeva vēl 2 ābolus. Cik ābolu man tagad ir?",
  },
  {
    id: 5,
    taskType: "createMathTask",
    result: 8,
    operation: "+",
    taskNumberInLevel: 3,
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
    taskNumberInLevel: 4,
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
    taskNumberInLevel: 5,
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
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "5 + 5" },
      { id: 3, equation: "7 + 3" },
      { id: 4, equation: "6 - 0" },
      { id: 2, equation: "7 + 2" },
    ],
  },
];
