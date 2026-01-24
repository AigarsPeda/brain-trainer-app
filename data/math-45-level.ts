import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 45: All operations mastery
export const LEVEL_45: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 60,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "6 × 10" },
      { id: 2, equation: "72 - 12" },
      { id: 3, equation: "10 × 6" },
      { id: 4, equation: "120 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "63 ÷ 7" },
      { id: 2, equation: "72 ÷ 8" },
      { id: 3, equation: "54 ÷ 6" },
      { id: 4, equation: "81 ÷ 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 84,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Mamma izcepa 7 paplātes ar 12 cepumiem katrā. Cik cepumu viņa izcepa?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 78,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "45" },
      { id: 2, number: "29" },
      { id: 3, number: "33" },
      { id: 4, number: "37" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 40,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "8 × 5" },
      { id: 2, equation: "80 ÷ 2" },
      { id: 3, equation: "48 - 8" },
      { id: 4, equation: "5 × 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "42 ÷ 6" },
      { id: 2, equation: "63 ÷ 9" },
      { id: 3, equation: "56 ÷ 8" },
      { id: 4, equation: "49 ÷ 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 48,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Grozā bija 100 āboli. Mamma paņēma 52 ābolus. Cik ābolu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 88,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "22" },
      { id: 2, number: "11" },
      { id: 3, number: "4" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "3 × 9" },
      { id: 2, equation: "35 - 8" },
      { id: 3, equation: "9 × 3" },
      { id: 4, equation: "54 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "88 ÷ 8" },
      { id: 2, equation: "99 ÷ 9" },
      { id: 3, equation: "77 ÷ 7" },
      { id: 4, equation: "110 ÷ 10" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 53,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "47" },
      { id: 2, number: "100" },
      { id: 3, number: "45" },
      { id: 4, number: "51" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 96,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "12 × 8" },
      { id: 2, equation: "48 + 48" },
      { id: 3, equation: "100 - 4" },
      { id: 4, equation: "8 × 12" },
    ],
  },
];
