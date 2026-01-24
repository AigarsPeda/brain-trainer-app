import AppleIcon from "@/assets/images/apple.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 5: Numbers 10-20, Addition and subtraction
export const LEVEL_5: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 17,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "9 + 8" },
      { id: 2, equation: "10 + 7" },
      { id: 3, equation: "11 + 7" },
      { id: 4, equation: "8 + 8" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "18 - 6" },
      { id: 2, equation: "17 - 5" },
      { id: 3, equation: "19 - 6" },
      { id: 4, equation: "16 - 5" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 11,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Grozā ir 7 āboli. Mamma ielika vēl 4 ābolus. Cik ābolu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 18,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "8" },
      { id: 3, number: "9" },
      { id: 4, number: "7" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "17 - 9" },
      { id: 2, equation: "16 - 8" },
      { id: 3, equation: "18 - 9" },
      { id: 4, equation: "15 - 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 19,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "10 + 9" },
      { id: 2, equation: "11 + 8" },
      { id: 3, equation: "12 + 8" },
      { id: 4, equation: "9 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 9,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 16 cepumi. Es apēdu 7 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 6,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "17" },
      { id: 2, number: "11" },
      { id: 3, number: "10" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "9 + 7" },
      { id: 2, equation: "8 + 8" },
      { id: 3, equation: "10 + 7" },
      { id: 4, equation: "7 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 10,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "19 - 9" },
      { id: 2, equation: "18 - 8" },
      { id: 3, equation: "17 - 8" },
      { id: 4, equation: "20 - 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 20,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "11" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "20 - 9" },
      { id: 2, equation: "19 - 8" },
      { id: 3, equation: "18 - 8" },
      { id: 4, equation: "17 - 7" },
    ],
  },
];
