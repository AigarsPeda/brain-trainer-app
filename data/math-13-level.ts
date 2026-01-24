import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 13: Numbers 28-37, Addition and subtraction
export const LEVEL_13: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "27 + 9" },
      { id: 2, equation: "25 + 11" },
      { id: 3, equation: "28 + 9" },
      { id: 4, equation: "24 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 26,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "36 - 10" },
      { id: 2, equation: "35 - 9" },
      { id: 3, equation: "37 - 10" },
      { id: 4, equation: "34 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 28,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Grozā ir 19 banāni. Mamma ielika vēl 9 banānus. Cik banānu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 37,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "26" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 23,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "36 - 13" },
      { id: 2, equation: "35 - 12" },
      { id: 3, equation: "37 - 13" },
      { id: 4, equation: "34 - 12" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 35,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "26 + 9" },
      { id: 2, equation: "25 + 10" },
      { id: 3, equation: "27 + 9" },
      { id: 4, equation: "24 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 24,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 37 cepumi. Es apēdu 13 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 20,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "36" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 34,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "25 + 9" },
      { id: 2, equation: "26 + 8" },
      { id: 3, equation: "24 + 9" },
      { id: 4, equation: "27 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 22,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "37 - 15" },
      { id: 2, equation: "36 - 14" },
      { id: 3, equation: "35 - 14" },
      { id: 4, equation: "34 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 32,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "23" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "37 - 10" },
      { id: 2, equation: "36 - 9" },
      { id: 3, equation: "35 - 9" },
      { id: 4, equation: "34 - 8" },
    ],
  },
];
