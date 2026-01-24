import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 18: Numbers 39-47, Addition and subtraction
export const LEVEL_18: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 46,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "37 + 9" },
      { id: 2, equation: "35 + 11" },
      { id: 3, equation: "38 + 9" },
      { id: 4, equation: "34 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "46 - 10" },
      { id: 2, equation: "45 - 9" },
      { id: 3, equation: "47 - 10" },
      { id: 4, equation: "44 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 38,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 29 cepumi. Vecmāmiņa iedeva vēl 9 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 47,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "36" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 33,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "46 - 13" },
      { id: 2, equation: "45 - 12" },
      { id: 3, equation: "47 - 13" },
      { id: 4, equation: "44 - 12" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 45,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "36 + 9" },
      { id: 2, equation: "35 + 10" },
      { id: 3, equation: "37 + 9" },
      { id: 4, equation: "34 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 34,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā bija 47 āboli. Nokrita 13 āboli. Cik ābolu palika kokā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 30,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "46" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 44,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "35 + 9" },
      { id: 2, equation: "36 + 8" },
      { id: 3, equation: "34 + 9" },
      { id: 4, equation: "37 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "47 - 15" },
      { id: 2, equation: "46 - 14" },
      { id: 3, equation: "45 - 14" },
      { id: 4, equation: "44 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 42,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "33" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 37,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "47 - 10" },
      { id: 2, equation: "46 - 9" },
      { id: 3, equation: "45 - 9" },
      { id: 4, equation: "44 - 8" },
    ],
  },
];
