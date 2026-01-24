import BananaIcon from "@/assets/images/banana.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 9: Numbers 18-29, Addition and subtraction
export const LEVEL_9: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 28,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "19 + 9" },
      { id: 2, equation: "16 + 11" },
      { id: 3, equation: "17 + 11" },
      { id: 4, equation: "20 + 9" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "29 - 10" },
      { id: 2, equation: "27 - 9" },
      { id: 3, equation: "26 - 9" },
      { id: 4, equation: "28 - 10" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 19,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 12 banāni. Draugs iedeva vēl 7 banānus. Cik banānu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 29,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "18" },
      { id: 2, number: "10" },
      { id: 3, number: "11" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "27 - 12" },
      { id: 2, equation: "29 - 13" },
      { id: 3, equation: "26 - 12" },
      { id: 4, equation: "28 - 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "16 + 10" },
      { id: 2, equation: "18 + 9" },
      { id: 3, equation: "17 + 10" },
      { id: 4, equation: "19 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 16,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Grozā bija 29 āboli. Pārdeva 13 ābolus. Cik ābolu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 12,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "15" },
      { id: 2, number: "16" },
      { id: 3, number: "17" },
      { id: 4, number: "28" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 26,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "17 + 9" },
      { id: 2, equation: "19 + 8" },
      { id: 3, equation: "18 + 8" },
      { id: 4, equation: "16 + 9" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "27 - 14" },
      { id: 2, equation: "28 - 14" },
      { id: 3, equation: "26 - 13" },
      { id: 4, equation: "29 - 15" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 25,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "16" },
      { id: 3, number: "8" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "28 - 8" },
      { id: 2, equation: "27 - 8" },
      { id: 3, equation: "26 - 7" },
      { id: 4, equation: "29 - 9" },
    ],
  },
];
