import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 38: Division by 3 and 4
export const LEVEL_38: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 2,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "6 ÷ 3" },
      { id: 2, equation: "3 ÷ 3" },
      { id: 3, equation: "9 ÷ 3" },
      { id: 4, equation: "12 ÷ 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "8 ÷ 4" },
      { id: 2, equation: "16 ÷ 4" },
      { id: 3, equation: "20 ÷ 4" },
      { id: 4, equation: "12 ÷ 4" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Mamma sadalīja 12 ābolus 3 bērniem vienādi. Cik ābolu dabūja katrs?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 5,
    operation: "÷",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "15" },
      { id: 2, number: "6" },
      { id: 3, number: "3" },
      { id: 4, number: "5" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "20 ÷ 4" },
      { id: 2, equation: "12 ÷ 4" },
      { id: 3, equation: "24 ÷ 4" },
      { id: 4, equation: "16 ÷ 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "21 ÷ 3" },
      { id: 2, equation: "18 ÷ 3" },
      { id: 3, equation: "24 ÷ 3" },
      { id: 4, equation: "15 ÷ 3" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā sadalīja 28 banānus 4 kastēs vienādi. Cik banānu ir katrā kastē?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 8,
    operation: "÷",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "12" },
      { id: 2, number: "3" },
      { id: 3, number: "2" },
      { id: 4, number: "24" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "21 ÷ 3" },
      { id: 2, equation: "27 ÷ 3" },
      { id: 3, equation: "24 ÷ 3" },
      { id: 4, equation: "18 ÷ 3" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "32 ÷ 4" },
      { id: 2, equation: "40 ÷ 4" },
      { id: 3, equation: "28 ÷ 4" },
      { id: 4, equation: "36 ÷ 4" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 10,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "3" },
      { id: 2, number: "30" },
      { id: 3, number: "2" },
      { id: 4, number: "15" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "36 ÷ 4" },
      { id: 2, equation: "28 ÷ 4" },
      { id: 3, equation: "24 ÷ 4" },
      { id: 4, equation: "32 ÷ 4" },
    ],
  },
];
