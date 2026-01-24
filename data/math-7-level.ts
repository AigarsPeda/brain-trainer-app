import CookieIcon from "@/assets/images/cookie.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 7: Numbers 12-25, Addition and subtraction
export const LEVEL_7: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "15 + 9" },
      { id: 2, equation: "14 + 10" },
      { id: 3, equation: "16 + 9" },
      { id: 4, equation: "13 + 10" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "24 - 9" },
      { id: 2, equation: "23 - 8" },
      { id: 3, equation: "25 - 9" },
      { id: 4, equation: "22 - 8" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 16,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 9 cepumi. Vecmāmiņa iedeva vēl 7 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 25,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "14" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "23 - 11" },
      { id: 2, equation: "22 - 10" },
      { id: 3, equation: "24 - 11" },
      { id: 4, equation: "21 - 10" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 23,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "14 + 9" },
      { id: 2, equation: "13 + 10" },
      { id: 3, equation: "15 + 9" },
      { id: 4, equation: "12 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 13,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Grozā bija 25 banāni. Pārdeva 12 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 10,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "24" },
      { id: 2, number: "14" },
      { id: 3, number: "13" },
      { id: 4, number: "15" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 22,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "13 + 9" },
      { id: 2, equation: "14 + 8" },
      { id: 3, equation: "12 + 9" },
      { id: 4, equation: "15 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "25 - 14" },
      { id: 2, equation: "24 - 13" },
      { id: 3, equation: "23 - 13" },
      { id: 4, equation: "22 - 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 21,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "12" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 17,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "25 - 8" },
      { id: 2, equation: "24 - 7" },
      { id: 3, equation: "23 - 7" },
      { id: 4, equation: "22 - 6" },
    ],
  },
];
