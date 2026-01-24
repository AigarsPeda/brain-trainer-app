import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 11: Numbers 22-33, Addition and subtraction
export const LEVEL_11: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "23 + 9" },
      { id: 2, equation: "21 + 11" },
      { id: 3, equation: "24 + 9" },
      { id: 4, equation: "20 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 22,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "32 - 10" },
      { id: 2, equation: "31 - 9" },
      { id: 3, equation: "33 - 10" },
      { id: 4, equation: "30 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 24,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 16 āboli. Mamma ielika vēl 8 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 33,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "22" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 19,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "32 - 13" },
      { id: 2, equation: "31 - 12" },
      { id: 3, equation: "33 - 13" },
      { id: 4, equation: "30 - 12" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 31,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "22 + 9" },
      { id: 2, equation: "21 + 10" },
      { id: 3, equation: "23 + 9" },
      { id: 4, equation: "20 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 20,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 33 banāni. Pārdeva 13 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 16,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "32" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "21 + 9" },
      { id: 2, equation: "22 + 8" },
      { id: 3, equation: "20 + 9" },
      { id: 4, equation: "23 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "33 - 15" },
      { id: 2, equation: "32 - 14" },
      { id: 3, equation: "31 - 14" },
      { id: 4, equation: "30 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 28,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "19" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 23,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "33 - 10" },
      { id: 2, equation: "32 - 9" },
      { id: 3, equation: "31 - 9" },
      { id: 4, equation: "30 - 8" },
    ],
  },
];
