import CookieIcon from "@/assets/images/cookie.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 4: Numbers 5-15, Addition and subtraction
export const LEVEL_4: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 13,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "8 + 5" },
      { id: 2, equation: "6 + 6" },
      { id: 3, equation: "7 + 6" },
      { id: 4, equation: "9 + 5" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "12 - 5" },
      { id: 2, equation: "14 - 6" },
      { id: 3, equation: "15 - 6" },
      { id: 4, equation: "13 - 5" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 9,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 6 cepumi. Vecmāmiņa iedeva vēl 3 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 14,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "8" },
      { id: 2, number: "5" },
      { id: 3, number: "6" },
      { id: 4, number: "7" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "13 - 7" },
      { id: 2, equation: "15 - 8" },
      { id: 3, equation: "12 - 7" },
      { id: 4, equation: "14 - 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "10 + 6" },
      { id: 2, equation: "9 + 6" },
      { id: 3, equation: "8 + 7" },
      { id: 4, equation: "7 + 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Grozā bija 13 banāni. Pārdeva 6 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 5,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "8" },
      { id: 3, number: "9" },
      { id: 4, number: "13" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "6 + 5" },
      { id: 2, equation: "5 + 5" },
      { id: 3, equation: "7 + 4" },
      { id: 4, equation: "8 + 4" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "13 - 5" },
      { id: 2, equation: "14 - 5" },
      { id: 3, equation: "12 - 4" },
      { id: 4, equation: "15 - 6" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 12,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "5" },
      { id: 2, number: "7" },
      { id: 3, number: "8" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "14 - 7" },
      { id: 2, equation: "13 - 5" },
      { id: 3, equation: "12 - 6" },
      { id: 4, equation: "15 - 8" },
    ],
  },
];
