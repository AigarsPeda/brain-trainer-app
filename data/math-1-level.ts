import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 1: Numbers 1-10, Addition only (easiest)
export const LEVEL_1: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "1 + 2" },
      { id: 2, equation: "1 + 1" },
      { id: 3, equation: "2 + 1" },
      { id: 4, equation: "2 + 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "1 + 2" },
      { id: 2, equation: "3 + 1" },
      { id: 3, equation: "2 + 3" },
      { id: 4, equation: "2 + 2" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Man ir 2 āboli. Mamma iedeva vēl 2 ābolus. Cik ābolu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 5,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "3" },
      { id: 2, number: "1" },
      { id: 3, number: "2" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 5,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 + 1" },
      { id: 2, equation: "2 + 2" },
      { id: 3, equation: "3 + 3" },
      { id: 4, equation: "3 + 2" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "4 + 3" },
      { id: 2, equation: "4 + 2" },
      { id: 3, equation: "3 + 3" },
      { id: 4, equation: "5 + 2" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 5,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Man ir 3 banāni. Draugs iedeva vēl 2 banānus. Cik banānu man tagad ir?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 7,
    operation: "+",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "5" },
      { id: 2, number: "3" },
      { id: 3, number: "2" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "5 + 2" },
      { id: 2, equation: "3 + 3" },
      { id: 3, equation: "4 + 3" },
      { id: 4, equation: "6 + 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "4 + 3" },
      { id: 2, equation: "6 + 2" },
      { id: 3, equation: "7 + 2" },
      { id: 4, equation: "5 + 3" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 9,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "4" },
      { id: 2, number: "5" },
      { id: 3, number: "2" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 10,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "6 + 4" },
      { id: 2, equation: "7 + 2" },
      { id: 3, equation: "8 + 3" },
      { id: 4, equation: "5 + 5" },
    ],
  },
];
