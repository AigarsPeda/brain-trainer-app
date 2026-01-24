import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 40: Division by 9 and 10, division review
export const LEVEL_40: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 2,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "18 ÷ 9" },
      { id: 2, equation: "27 ÷ 9" },
      { id: 3, equation: "36 ÷ 9" },
      { id: 4, equation: "9 ÷ 9" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "30 ÷ 10" },
      { id: 2, equation: "40 ÷ 10" },
      { id: 3, equation: "20 ÷ 10" },
      { id: 4, equation: "50 ÷ 10" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Veikalā sadalīja 36 banānus 9 kastēs vienādi. Cik banānu ir katrā kastē?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 5,
    operation: "÷",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "50" },
      { id: 2, number: "10" },
      { id: 3, number: "25" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 5,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "45 ÷ 9" },
      { id: 2, equation: "54 ÷ 9" },
      { id: 3, equation: "36 ÷ 9" },
      { id: 4, equation: "63 ÷ 9" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "60 ÷ 10" },
      { id: 2, equation: "70 ÷ 10" },
      { id: 3, equation: "50 ÷ 10" },
      { id: 4, equation: "80 ÷ 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Mamma sadalīja 63 cepumus 9 bērniem vienādi. Cik cepumu dabūja katrs?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 8,
    operation: "÷",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "72" },
      { id: 2, number: "9" },
      { id: 3, number: "36" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "80 ÷ 10" },
      { id: 2, equation: "90 ÷ 10" },
      { id: 3, equation: "70 ÷ 10" },
      { id: 4, equation: "100 ÷ 10" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "81 ÷ 9" },
      { id: 2, equation: "90 ÷ 9" },
      { id: 3, equation: "72 ÷ 9" },
      { id: 4, equation: "63 ÷ 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 10,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "100" },
      { id: 2, number: "10" },
      { id: 3, number: "50" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "90 ÷ 10" },
      { id: 2, equation: "100 ÷ 10" },
      { id: 3, equation: "80 ÷ 10" },
      { id: 4, equation: "70 ÷ 10" },
    ],
  },
];
