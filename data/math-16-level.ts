import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 16: Numbers 35-43, Addition and subtraction
export const LEVEL_16: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 42,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "33 + 9" },
      { id: 2, equation: "31 + 11" },
      { id: 3, equation: "34 + 9" },
      { id: 4, equation: "30 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "42 - 10" },
      { id: 2, equation: "41 - 9" },
      { id: 3, equation: "43 - 10" },
      { id: 4, equation: "40 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 34,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Grozā ir 25 banāni. Mamma ielika vēl 9 banānus. Cik banānu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 43,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "32" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 29,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "42 - 13" },
      { id: 2, equation: "41 - 12" },
      { id: 3, equation: "43 - 13" },
      { id: 4, equation: "40 - 12" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 41,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "32 + 9" },
      { id: 2, equation: "31 + 10" },
      { id: 3, equation: "33 + 9" },
      { id: 4, equation: "30 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 30,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 43 cepumi. Es apēdu 13 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 26,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "42" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 40,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "31 + 9" },
      { id: 2, equation: "32 + 8" },
      { id: 3, equation: "30 + 9" },
      { id: 4, equation: "33 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 28,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "43 - 15" },
      { id: 2, equation: "42 - 14" },
      { id: 3, equation: "41 - 14" },
      { id: 4, equation: "40 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 38,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "29" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 33,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "43 - 10" },
      { id: 2, equation: "42 - 9" },
      { id: 3, equation: "41 - 9" },
      { id: 4, equation: "40 - 8" },
    ],
  },
];
