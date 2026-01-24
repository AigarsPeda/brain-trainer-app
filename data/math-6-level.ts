import BananaIcon from "@/assets/images/banana.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 6: Numbers 10-22, Addition and subtraction
export const LEVEL_6: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 21,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "12 + 9" },
      { id: 2, equation: "13 + 8" },
      { id: 3, equation: "14 + 8" },
      { id: 4, equation: "11 + 9" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 13,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "21 - 8" },
      { id: 2, equation: "20 - 7" },
      { id: 3, equation: "22 - 8" },
      { id: 4, equation: "19 - 7" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 14,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 9 āboli. Mamma ielika vēl 5 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 22,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "13" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "20 - 9" },
      { id: 2, equation: "19 - 8" },
      { id: 3, equation: "21 - 9" },
      { id: 4, equation: "18 - 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 19,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "11 + 8" },
      { id: 2, equation: "12 + 7" },
      { id: 3, equation: "10 + 8" },
      { id: 4, equation: "13 + 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 12,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 21 banāns. Pārdeva 9 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 8,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "20" },
      { id: 2, number: "12" },
      { id: 3, number: "11" },
      { id: 4, number: "13" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "12 + 8" },
      { id: 2, equation: "11 + 9" },
      { id: 3, equation: "13 + 8" },
      { id: 4, equation: "10 + 9" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "22 - 13" },
      { id: 2, equation: "21 - 12" },
      { id: 3, equation: "20 - 12" },
      { id: 4, equation: "19 - 11" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 18,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "8" },
      { id: 3, number: "9" },
      { id: 4, number: "7" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "22 - 8" },
      { id: 2, equation: "21 - 7" },
      { id: 3, equation: "20 - 7" },
      { id: 4, equation: "19 - 6" },
    ],
  },
];
