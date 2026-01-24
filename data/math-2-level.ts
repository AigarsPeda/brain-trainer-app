import AppleIcon from "@/assets/images/apple.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 2: Numbers 1-10, Addition and Subtraction intro
export const LEVEL_2: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 2,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "4 - 2" },
      { id: 2, equation: "4 - 1" },
      { id: 3, equation: "3 - 1" },
      { id: 4, equation: "5 - 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "6 - 2" },
      { id: 2, equation: "4 - 1" },
      { id: 3, equation: "5 - 1" },
      { id: 4, equation: "5 - 2" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 3,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Man ir 5 āboli. Es apēdu 2 ābolus. Cik ābolu man palika?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 4,
    operation: "-",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "6" },
      { id: 2, number: "5" },
      { id: 3, number: "2" },
      { id: 4, number: "3" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "5 - 1" },
      { id: 2, equation: "7 - 2" },
      { id: 3, equation: "8 - 3" },
      { id: 4, equation: "6 - 2" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 5,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "9 - 3" },
      { id: 2, equation: "7 - 2" },
      { id: 3, equation: "8 - 3" },
      { id: 4, equation: "6 - 2" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 4,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Man ir 7 cepumi. Es atdevu draugam 3 cepumus. Cik cepumu man palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 3,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "4" },
      { id: 2, number: "5" },
      { id: 3, number: "6" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "9 - 3" },
      { id: 2, equation: "10 - 3" },
      { id: 3, equation: "8 - 2" },
      { id: 4, equation: "7 - 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 5,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "8 - 2" },
      { id: 2, equation: "9 - 4" },
      { id: 3, equation: "7 - 3" },
      { id: 4, equation: "10 - 5" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 2,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "5" },
      { id: 2, number: "7" },
      { id: 3, number: "3" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "9 - 5" },
      { id: 2, equation: "8 - 3" },
      { id: 3, equation: "7 - 4" },
      { id: 4, equation: "10 - 6" },
    ],
  },
];
