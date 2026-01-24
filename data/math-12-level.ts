import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 12: Numbers 25-35, Addition and subtraction
export const LEVEL_12: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 34,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "25 + 9" },
      { id: 2, equation: "23 + 11" },
      { id: 3, equation: "26 + 9" },
      { id: 4, equation: "22 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "34 - 10" },
      { id: 2, equation: "33 - 9" },
      { id: 3, equation: "35 - 10" },
      { id: 4, equation: "32 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 26,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 18 cepumi. Vecmāmiņa iedeva vēl 8 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 35,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "24" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 21,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "34 - 13" },
      { id: 2, equation: "33 - 12" },
      { id: 3, equation: "35 - 13" },
      { id: 4, equation: "32 - 12" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 33,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "24 + 9" },
      { id: 2, equation: "23 + 10" },
      { id: 3, equation: "25 + 9" },
      { id: 4, equation: "22 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 22,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā bija 35 āboli. Nokrita 13 āboli. Cik ābolu palika kokā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 18,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "34" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "23 + 9" },
      { id: 2, equation: "24 + 8" },
      { id: 3, equation: "22 + 9" },
      { id: 4, equation: "25 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "35 - 15" },
      { id: 2, equation: "34 - 14" },
      { id: 3, equation: "33 - 14" },
      { id: 4, equation: "32 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 30,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "21" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 25,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "35 - 10" },
      { id: 2, equation: "34 - 9" },
      { id: 3, equation: "33 - 9" },
      { id: 4, equation: "32 - 8" },
    ],
  },
];
