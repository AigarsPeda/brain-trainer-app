import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 23: Numbers 65-85, Addition and subtraction
export const LEVEL_23: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 80,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "65 + 15" },
      { id: 2, equation: "60 + 19" },
      { id: 3, equation: "62 + 18" },
      { id: 4, equation: "68 + 13" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 65,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "82 - 16" },
      { id: 2, equation: "78 - 13" },
      { id: 3, equation: "75 - 11" },
      { id: 4, equation: "80 - 15" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 72,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 60 āboli. Mamma ielika vēl 12 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 85,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "70" },
      { id: 2, number: "14" },
      { id: 3, number: "15" },
      { id: 4, number: "16" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 62,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "76 - 14" },
      { id: 2, equation: "80 - 17" },
      { id: 3, equation: "74 - 13" },
      { id: 4, equation: "78 - 16" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 78,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "61 + 16" },
      { id: 2, equation: "65 + 13" },
      { id: 3, equation: "63 + 15" },
      { id: 4, equation: "67 + 12" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 68,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 85 banāni. Pārdeva 17 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 60,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "18" },
      { id: 2, number: "20" },
      { id: 3, number: "22" },
      { id: 4, number: "80" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 75,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "62 + 13" },
      { id: 2, equation: "66 + 10" },
      { id: 3, equation: "64 + 11" },
      { id: 4, equation: "60 + 14" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 67,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "81 - 15" },
      { id: 2, equation: "83 - 16" },
      { id: 3, equation: "79 - 13" },
      { id: 4, equation: "85 - 18" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 82,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "14" },
      { id: 2, number: "68" },
      { id: 3, number: "13" },
      { id: 4, number: "15" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 70,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "83 - 13" },
      { id: 2, equation: "81 - 12" },
      { id: 3, equation: "79 - 10" },
      { id: 4, equation: "85 - 15" },
    ],
  },
];
