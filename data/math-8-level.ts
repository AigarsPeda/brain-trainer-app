import AppleIcon from "@/assets/images/apple.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 8: Numbers 15-27, Addition and subtraction
export const LEVEL_8: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 26,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "17 + 9" },
      { id: 2, equation: "15 + 11" },
      { id: 3, equation: "18 + 9" },
      { id: 4, equation: "14 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "26 - 10" },
      { id: 2, equation: "25 - 9" },
      { id: 3, equation: "27 - 10" },
      { id: 4, equation: "24 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 18,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Kokā ir 11 āboli. Mamma pielika vēl 7 ābolus. Cik ābolu tagad ir kokā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 27,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "16" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "26 - 12" },
      { id: 2, equation: "25 - 11" },
      { id: 3, equation: "27 - 12" },
      { id: 4, equation: "24 - 11" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 25,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "16 + 9" },
      { id: 2, equation: "15 + 10" },
      { id: 3, equation: "17 + 9" },
      { id: 4, equation: "14 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 15,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 27 cepumi. Es apēdu 12 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 11,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "26" },
      { id: 2, number: "15" },
      { id: 3, number: "14" },
      { id: 4, number: "16" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "15 + 9" },
      { id: 2, equation: "16 + 8" },
      { id: 3, equation: "14 + 9" },
      { id: 4, equation: "17 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 13,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "27 - 14" },
      { id: 2, equation: "26 - 13" },
      { id: 3, equation: "25 - 13" },
      { id: 4, equation: "24 - 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 23,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "14" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 19,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "27 - 8" },
      { id: 2, equation: "26 - 7" },
      { id: 3, equation: "25 - 7" },
      { id: 4, equation: "24 - 6" },
    ],
  },
];
