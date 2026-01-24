import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 39: Division by 6, 7, 8
export const LEVEL_39: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 2,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "12 ÷ 6" },
      { id: 2, equation: "6 ÷ 6" },
      { id: 3, equation: "18 ÷ 6" },
      { id: 4, equation: "24 ÷ 6" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "14 ÷ 7" },
      { id: 2, equation: "28 ÷ 7" },
      { id: 3, equation: "35 ÷ 7" },
      { id: 4, equation: "21 ÷ 7" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Mamma sadalīja 24 cepumus 6 bērniem vienādi. Cik cepumu dabūja katrs?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 5,
    operation: "÷",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "40" },
      { id: 2, number: "4" },
      { id: 3, number: "8" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "35 ÷ 7" },
      { id: 2, equation: "21 ÷ 7" },
      { id: 3, equation: "42 ÷ 7" },
      { id: 4, equation: "28 ÷ 7" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "64 ÷ 8" },
      { id: 2, equation: "48 ÷ 8" },
      { id: 3, equation: "56 ÷ 8" },
      { id: 4, equation: "40 ÷ 8" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Dārznieks sadalīja 42 ābolus 6 kastēs vienādi. Cik ābolu ir katrā kastē?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 8,
    operation: "÷",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "28" },
      { id: 2, number: "7" },
      { id: 3, number: "2" },
      { id: 4, number: "56" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "56 ÷ 8" },
      { id: 2, equation: "72 ÷ 8" },
      { id: 3, equation: "64 ÷ 8" },
      { id: 4, equation: "48 ÷ 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "48 ÷ 6" },
      { id: 2, equation: "60 ÷ 6" },
      { id: 3, equation: "42 ÷ 6" },
      { id: 4, equation: "54 ÷ 6" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 10,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "70" },
      { id: 3, number: "2" },
      { id: 4, number: "35" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "72 ÷ 8" },
      { id: 2, equation: "56 ÷ 8" },
      { id: 3, equation: "48 ÷ 8" },
      { id: 4, equation: "64 ÷ 8" },
    ],
  },
];
