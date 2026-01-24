import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 37: Division by 5
export const LEVEL_37: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 2,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "10 ÷ 5" },
      { id: 2, equation: "15 ÷ 5" },
      { id: 3, equation: "20 ÷ 5" },
      { id: 4, equation: "5 ÷ 5" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "15 ÷ 5" },
      { id: 2, equation: "20 ÷ 5" },
      { id: 3, equation: "10 ÷ 5" },
      { id: 4, equation: "25 ÷ 5" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 20 banāni. Es gribu tos sadalīt 5 draugiem vienādi. Cik banānus dabūs katrs?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 5,
    operation: "÷",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "25" },
      { id: 2, number: "5" },
      { id: 3, number: "10" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "20 ÷ 5" },
      { id: 2, equation: "25 ÷ 5" },
      { id: 3, equation: "15 ÷ 5" },
      { id: 4, equation: "30 ÷ 5" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "30 ÷ 5" },
      { id: 2, equation: "35 ÷ 5" },
      { id: 3, equation: "25 ÷ 5" },
      { id: 4, equation: "40 ÷ 5" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Skolotāja sadalīja 35 cepumus 5 grupās vienādi. Cik cepumu ir katrā grupā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 8,
    operation: "÷",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "40" },
      { id: 2, number: "5" },
      { id: 3, number: "20" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "35 ÷ 5" },
      { id: 2, equation: "40 ÷ 5" },
      { id: 3, equation: "30 ÷ 5" },
      { id: 4, equation: "45 ÷ 5" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "45 ÷ 5" },
      { id: 2, equation: "50 ÷ 5" },
      { id: 3, equation: "40 ÷ 5" },
      { id: 4, equation: "35 ÷ 5" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 10,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "50" },
      { id: 2, number: "5" },
      { id: 3, number: "25" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "40 ÷ 5" },
      { id: 2, equation: "45 ÷ 5" },
      { id: 3, equation: "35 ÷ 5" },
      { id: 4, equation: "30 ÷ 5" },
    ],
  },
];
