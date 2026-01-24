import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 14: Numbers 30-39, Addition and subtraction
export const LEVEL_14: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 38,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "29 + 9" },
      { id: 2, equation: "26 + 11" },
      { id: 3, equation: "27 + 11" },
      { id: 4, equation: "30 + 9" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 28,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "39 - 10" },
      { id: 2, equation: "37 - 9" },
      { id: 3, equation: "36 - 9" },
      { id: 4, equation: "38 - 10" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 30,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 21 ābols. Mamma ielika vēl 9 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 39,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "28" },
      { id: 2, number: "10" },
      { id: 3, number: "11" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 25,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "37 - 12" },
      { id: 2, equation: "39 - 13" },
      { id: 3, equation: "36 - 12" },
      { id: 4, equation: "38 - 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 37,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "26 + 10" },
      { id: 2, equation: "28 + 9" },
      { id: 3, equation: "27 + 10" },
      { id: 4, equation: "29 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 26,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 39 banāni. Pārdeva 13 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 22,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "15" },
      { id: 2, number: "16" },
      { id: 3, number: "17" },
      { id: 4, number: "38" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "27 + 9" },
      { id: 2, equation: "29 + 8" },
      { id: 3, equation: "28 + 8" },
      { id: 4, equation: "26 + 9" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "37 - 14" },
      { id: 2, equation: "38 - 14" },
      { id: 3, equation: "36 - 13" },
      { id: 4, equation: "39 - 15" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 34,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "25" },
      { id: 3, number: "8" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 29,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "38 - 9" },
      { id: 2, equation: "37 - 9" },
      { id: 3, equation: "36 - 8" },
      { id: 4, equation: "39 - 10" },
    ],
  },
];
