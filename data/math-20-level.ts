import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 20: Numbers 43-50, Addition and subtraction
export const LEVEL_20: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 50,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "41 + 9" },
      { id: 2, equation: "39 + 11" },
      { id: 3, equation: "42 + 9" },
      { id: 4, equation: "38 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 40,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "50 - 10" },
      { id: 2, equation: "49 - 9" },
      { id: 3, equation: "48 - 9" },
      { id: 4, equation: "47 - 8" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 42,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 33 āboli. Mamma ielika vēl 9 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 49,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "40" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 37,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "50 - 13" },
      { id: 2, equation: "49 - 12" },
      { id: 3, equation: "48 - 12" },
      { id: 4, equation: "47 - 11" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 48,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "40 + 8" },
      { id: 2, equation: "39 + 9" },
      { id: 3, equation: "41 + 8" },
      { id: 4, equation: "38 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 38,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 50 banāni. Pārdeva 12 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 34,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "50" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 47,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "39 + 8" },
      { id: 2, equation: "40 + 7" },
      { id: 3, equation: "38 + 8" },
      { id: 4, equation: "41 + 7" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "50 - 14" },
      { id: 2, equation: "49 - 13" },
      { id: 3, equation: "48 - 13" },
      { id: 4, equation: "47 - 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 46,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "37" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 41,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "50 - 9" },
      { id: 2, equation: "49 - 8" },
      { id: 3, equation: "48 - 8" },
      { id: 4, equation: "47 - 7" },
    ],
  },
];
