import CookieIcon from "@/assets/images/cookie.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 10: Numbers 20-30, Addition and subtraction
export const LEVEL_10: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "21 + 9" },
      { id: 2, equation: "19 + 11" },
      { id: 3, equation: "22 + 9" },
      { id: 4, equation: "18 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "30 - 10" },
      { id: 2, equation: "29 - 9" },
      { id: 3, equation: "28 - 9" },
      { id: 4, equation: "27 - 8" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 22,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 14 cepumi. Mamma iedeva vēl 8 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 29,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "20" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 17,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "30 - 13" },
      { id: 2, equation: "29 - 12" },
      { id: 3, equation: "28 - 12" },
      { id: 4, equation: "27 - 11" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 28,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "20 + 8" },
      { id: 2, equation: "19 + 9" },
      { id: 3, equation: "21 + 8" },
      { id: 4, equation: "18 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 18,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 30 banāni. Pārdeva 12 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 14,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "30" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "19 + 8" },
      { id: 2, equation: "20 + 7" },
      { id: 3, equation: "18 + 8" },
      { id: 4, equation: "21 + 7" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "30 - 14" },
      { id: 2, equation: "29 - 13" },
      { id: 3, equation: "28 - 13" },
      { id: 4, equation: "27 - 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 26,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "18" },
      { id: 2, number: "8" },
      { id: 3, number: "9" },
      { id: 4, number: "7" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 21,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "30 - 9" },
      { id: 2, equation: "29 - 8" },
      { id: 3, equation: "28 - 8" },
      { id: 4, equation: "27 - 7" },
    ],
  },
];
