import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 42: Mixed operations - increasing difficulty
export const LEVEL_42: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 35,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "5 × 7" },
      { id: 2, equation: "42 - 7" },
      { id: 3, equation: "7 × 5" },
      { id: 4, equation: "70 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "72 ÷ 9" },
      { id: 2, equation: "64 ÷ 8" },
      { id: 3, equation: "48 ÷ 6" },
      { id: 4, equation: "56 ÷ 7" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 54,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 9 paciņas ar 6 cepumiem katrā. Cik cepumu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 67,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "38" },
      { id: 2, number: "25" },
      { id: 3, number: "29" },
      { id: 4, number: "31" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 42,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "7 × 6" },
      { id: 2, equation: "84 ÷ 2" },
      { id: 3, equation: "50 - 8" },
      { id: 4, equation: "6 × 7" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 5,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "30 ÷ 6" },
      { id: 2, equation: "45 ÷ 9" },
      { id: 3, equation: "40 ÷ 8" },
      { id: 4, equation: "35 ÷ 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 27,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Grozā bija 65 āboli. Mamma paņēma 38 ābolus. Cik ābolu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 72,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "12" },
      { id: 2, number: "9" },
      { id: 3, number: "6" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 64,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "8 × 8" },
      { id: 2, equation: "80 - 16" },
      { id: 3, equation: "32 + 32" },
      { id: 4, equation: "128 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "63 ÷ 9" },
      { id: 2, equation: "56 ÷ 8" },
      { id: 3, equation: "42 ÷ 6" },
      { id: 4, equation: "49 ÷ 7" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 9,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "81" },
      { id: 3, number: "3" },
      { id: 4, number: "27" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 81,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "54 + 27" },
      { id: 2, equation: "162 ÷ 2" },
      { id: 3, equation: "90 - 9" },
      { id: 4, equation: "9 × 9" },
    ],
  },
];
