import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 21: Numbers 50-65, Addition and subtraction
export const LEVEL_21: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 60,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "45 + 15" },
      { id: 2, equation: "40 + 19" },
      { id: 3, equation: "42 + 18" },
      { id: 4, equation: "48 + 13" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 45,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "62 - 16" },
      { id: 2, equation: "58 - 13" },
      { id: 3, equation: "55 - 11" },
      { id: 4, equation: "60 - 15" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 52,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 40 cepumi. Vecmāmiņa iedeva vēl 12 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 65,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "50" },
      { id: 2, number: "14" },
      { id: 3, number: "15" },
      { id: 4, number: "16" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 42,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "56 - 14" },
      { id: 2, equation: "60 - 17" },
      { id: 3, equation: "54 - 13" },
      { id: 4, equation: "58 - 16" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 58,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "41 + 16" },
      { id: 2, equation: "45 + 13" },
      { id: 3, equation: "43 + 15" },
      { id: 4, equation: "47 + 12" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 48,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā bija 65 āboli. Nokrita 17 āboli. Cik ābolu palika kokā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 40,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "18" },
      { id: 2, number: "20" },
      { id: 3, number: "22" },
      { id: 4, number: "60" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 55,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "42 + 13" },
      { id: 2, equation: "46 + 10" },
      { id: 3, equation: "44 + 11" },
      { id: 4, equation: "40 + 14" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 47,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "61 - 15" },
      { id: 2, equation: "63 - 16" },
      { id: 3, equation: "59 - 13" },
      { id: 4, equation: "65 - 18" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 62,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "14" },
      { id: 2, number: "48" },
      { id: 3, number: "13" },
      { id: 4, number: "15" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 50,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "63 - 13" },
      { id: 2, equation: "61 - 12" },
      { id: 3, equation: "59 - 10" },
      { id: 4, equation: "65 - 15" },
    ],
  },
];
