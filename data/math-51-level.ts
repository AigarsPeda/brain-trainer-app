import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 51: Grand Master level - final challenge
export const LEVEL_51: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 225,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "15 × 15" },
      { id: 2, equation: "112 + 113" },
      { id: 3, equation: "450 ÷ 2" },
      { id: 4, equation: "240 - 15" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "225 ÷ 15" },
      { id: 2, equation: "210 ÷ 14" },
      { id: 3, equation: "195 ÷ 13" },
      { id: 4, equation: "180 ÷ 12" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 180,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Mamma cepa 12 paplātes ar 15 cepumiem katrā. Cik cepumu viņa izcepa?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 215,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "118" },
      { id: 2, number: "97" },
      { id: 3, number: "103" },
      { id: 4, number: "91" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 135,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "9 × 15" },
      { id: 2, equation: "15 × 9" },
      { id: 3, equation: "270 ÷ 2" },
      { id: 4, equation: "144 - 9" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 17,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "255 ÷ 15" },
      { id: 2, equation: "238 ÷ 14" },
      { id: 3, equation: "221 ÷ 13" },
      { id: 4, equation: "204 ÷ 12" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 127,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Dārzā bija 250 āboli. Novāca 123 ābolus. Cik ābolu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 195,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "13" },
      { id: 2, number: "15" },
      { id: 3, number: "39" },
      { id: 4, number: "5" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 150,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "10 × 15" },
      { id: 2, equation: "15 × 10" },
      { id: 3, equation: "300 ÷ 2" },
      { id: 4, equation: "160 - 10" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "270 ÷ 15" },
      { id: 2, equation: "252 ÷ 14" },
      { id: 3, equation: "234 ÷ 13" },
      { id: 4, equation: "216 ÷ 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 138,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "250" },
      { id: 2, number: "112" },
      { id: 3, number: "106" },
      { id: 4, number: "100" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 210,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "14 × 15" },
      { id: 2, equation: "15 × 14" },
      { id: 3, equation: "105 + 105" },
      { id: 4, equation: "420 ÷ 2" },
    ],
  },
];
