import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 36: Intro to division - dividing by 2
export const LEVEL_36: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 2,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "4 ÷ 2" },
      { id: 2, equation: "6 ÷ 2" },
      { id: 3, equation: "8 ÷ 2" },
      { id: 4, equation: "2 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "6 ÷ 2" },
      { id: 2, equation: "8 ÷ 2" },
      { id: 3, equation: "4 ÷ 2" },
      { id: 4, equation: "10 ÷ 2" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 8 cepumi. Es gribu tos sadalīt 2 draugiem vienādi. Cik cepumus dabūs katrs?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 5,
    operation: "÷",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "2" },
      { id: 3, number: "5" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "8 ÷ 2" },
      { id: 2, equation: "10 ÷ 2" },
      { id: 3, equation: "6 ÷ 2" },
      { id: 4, equation: "12 ÷ 2" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "12 ÷ 2" },
      { id: 2, equation: "14 ÷ 2" },
      { id: 3, equation: "10 ÷ 2" },
      { id: 4, equation: "16 ÷ 2" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Mamma sadalīja 14 ābolus 2 bērniem vienādi. Cik ābolu dabūja katrs bērns?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 8,
    operation: "÷",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "16" },
      { id: 2, number: "2" },
      { id: 3, number: "8" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "14 ÷ 2" },
      { id: 2, equation: "16 ÷ 2" },
      { id: 3, equation: "12 ÷ 2" },
      { id: 4, equation: "18 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "18 ÷ 2" },
      { id: 2, equation: "20 ÷ 2" },
      { id: 3, equation: "16 ÷ 2" },
      { id: 4, equation: "14 ÷ 2" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 10,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "20" },
      { id: 2, number: "2" },
      { id: 3, number: "10" },
      { id: 4, number: "5" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "16 ÷ 2" },
      { id: 2, equation: "18 ÷ 2" },
      { id: 3, equation: "14 ÷ 2" },
      { id: 4, equation: "12 ÷ 2" },
    ],
  },
];
