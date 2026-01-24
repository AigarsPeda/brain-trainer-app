import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 48: Challenge level - all operations
export const LEVEL_48: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 132,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "11 × 12" },
      { id: 2, equation: "12 × 11" },
      { id: 3, equation: "66 + 66" },
      { id: 4, equation: "140 - 8" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "96 ÷ 12" },
      { id: 2, equation: "88 ÷ 11" },
      { id: 3, equation: "80 ÷ 10" },
      { id: 4, equation: "72 ÷ 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 110,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Mamma cepa 10 paplātes ar 11 cepumiem katrā. Cik cepumu viņa izcepa?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 143,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "78" },
      { id: 2, number: "65" },
      { id: 3, number: "71" },
      { id: 4, number: "59" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 88,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "8 × 11" },
      { id: 2, equation: "11 × 8" },
      { id: 3, equation: "176 ÷ 2" },
      { id: 4, equation: "96 - 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "132 ÷ 12" },
      { id: 2, equation: "121 ÷ 11" },
      { id: 3, equation: "110 ÷ 10" },
      { id: 4, equation: "99 ÷ 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 78,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Dārzā bija 150 āboli. Novāca 72 ābolus. Cik ābolu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 117,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "13" },
      { id: 3, number: "39" },
      { id: 4, number: "3" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 99,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "9 × 11" },
      { id: 2, equation: "11 × 9" },
      { id: 3, equation: "198 ÷ 2" },
      { id: 4, equation: "108 - 9" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "144 ÷ 12" },
      { id: 2, equation: "132 ÷ 11" },
      { id: 3, equation: "120 ÷ 10" },
      { id: 4, equation: "108 ÷ 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 86,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "150" },
      { id: 2, number: "64" },
      { id: 3, number: "58" },
      { id: 4, number: "52" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 120,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "10 × 12" },
      { id: 2, equation: "12 × 10" },
      { id: 3, equation: "60 + 60" },
      { id: 4, equation: "240 ÷ 2" },
    ],
  },
];
