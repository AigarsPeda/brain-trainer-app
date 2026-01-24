import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 17: Numbers 37-45, Addition and subtraction
export const LEVEL_17: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 44,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "35 + 9" },
      { id: 2, equation: "32 + 11" },
      { id: 3, equation: "33 + 11" },
      { id: 4, equation: "36 + 9" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 34,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "45 - 10" },
      { id: 2, equation: "43 - 9" },
      { id: 3, equation: "42 - 9" },
      { id: 4, equation: "44 - 10" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 36,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 27 āboli. Mamma ielika vēl 9 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 45,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "34" },
      { id: 2, number: "10" },
      { id: 3, number: "11" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 31,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "43 - 12" },
      { id: 2, equation: "45 - 13" },
      { id: 3, equation: "42 - 12" },
      { id: 4, equation: "44 - 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 43,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "32 + 10" },
      { id: 2, equation: "34 + 9" },
      { id: 3, equation: "33 + 10" },
      { id: 4, equation: "35 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 32,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 45 banāni. Pārdeva 13 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 28,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "15" },
      { id: 2, number: "16" },
      { id: 3, number: "17" },
      { id: 4, number: "44" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 42,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "33 + 9" },
      { id: 2, equation: "35 + 8" },
      { id: 3, equation: "34 + 8" },
      { id: 4, equation: "32 + 9" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "43 - 14" },
      { id: 2, equation: "44 - 14" },
      { id: 3, equation: "42 - 13" },
      { id: 4, equation: "45 - 15" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 40,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "31" },
      { id: 3, number: "8" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 35,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "44 - 9" },
      { id: 2, equation: "43 - 9" },
      { id: 3, equation: "42 - 8" },
      { id: 4, equation: "45 - 10" },
    ],
  },
];
