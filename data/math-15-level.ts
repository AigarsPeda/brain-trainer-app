import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 15: Numbers 32-40, Addition and subtraction
export const LEVEL_15: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 40,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "31 + 9" },
      { id: 2, equation: "29 + 11" },
      { id: 3, equation: "32 + 9" },
      { id: 4, equation: "28 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "40 - 10" },
      { id: 2, equation: "39 - 9" },
      { id: 3, equation: "38 - 9" },
      { id: 4, equation: "37 - 8" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 32,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 23 cepumi. Vecmāmiņa iedeva vēl 9 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 39,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "30" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "40 - 13" },
      { id: 2, equation: "39 - 12" },
      { id: 3, equation: "38 - 12" },
      { id: 4, equation: "37 - 11" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 38,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "30 + 8" },
      { id: 2, equation: "29 + 9" },
      { id: 3, equation: "31 + 8" },
      { id: 4, equation: "28 + 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 28,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā bija 40 āboli. Nokrita 12 āboli. Cik ābolu palika kokā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 24,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "40" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 37,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "29 + 8" },
      { id: 2, equation: "30 + 7" },
      { id: 3, equation: "28 + 8" },
      { id: 4, equation: "31 + 7" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 26,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "40 - 14" },
      { id: 2, equation: "39 - 13" },
      { id: 3, equation: "38 - 13" },
      { id: 4, equation: "37 - 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 36,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "27" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 31,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "40 - 9" },
      { id: 2, equation: "39 - 8" },
      { id: 3, equation: "38 - 8" },
      { id: 4, equation: "37 - 7" },
    ],
  },
];
