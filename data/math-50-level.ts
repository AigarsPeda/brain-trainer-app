import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 50: Master level
export const LEVEL_50: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 182,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "13 × 14" },
      { id: 2, equation: "364 ÷ 2" },
      { id: 3, equation: "14 × 13" },
      { id: 4, equation: "91 + 91" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "154 ÷ 11" },
      { id: 2, equation: "168 ÷ 12" },
      { id: 3, equation: "140 ÷ 10" },
      { id: 4, equation: "182 ÷ 13" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 144,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Dārzā ir 12 rindas ar 12 ābelēm katrā. Cik ābeļu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 189,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "98" },
      { id: 2, number: "87" },
      { id: 3, number: "91" },
      { id: 4, number: "95" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 112,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "14 × 8" },
      { id: 2, equation: "224 ÷ 2" },
      { id: 3, equation: "120 - 8" },
      { id: 4, equation: "8 × 14" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "150 ÷ 10" },
      { id: 2, equation: "195 ÷ 13" },
      { id: 3, equation: "180 ÷ 12" },
      { id: 4, equation: "165 ÷ 11" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 108,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Grozā bija 200 banāni. Pārdeva 92 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 168,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "42" },
      { id: 2, number: "14" },
      { id: 3, number: "4" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 126,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "9 × 14" },
      { id: 2, equation: "135 - 9" },
      { id: 3, equation: "14 × 9" },
      { id: 4, equation: "252 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "176 ÷ 11" },
      { id: 2, equation: "192 ÷ 12" },
      { id: 3, equation: "160 ÷ 10" },
      { id: 4, equation: "208 ÷ 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 115,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "85" },
      { id: 2, number: "200" },
      { id: 3, number: "73" },
      { id: 4, number: "79" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 196,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "98 + 98" },
      { id: 2, equation: "392 ÷ 2" },
      { id: 3, equation: "200 - 4" },
      { id: 4, equation: "14 × 14" },
    ],
  },
];
