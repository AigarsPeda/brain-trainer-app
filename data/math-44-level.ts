import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 44: All operations challenge
export const LEVEL_44: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 54,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "6 × 9" },
      { id: 2, equation: "60 - 6" },
      { id: 3, equation: "9 × 6" },
      { id: 4, equation: "108 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "77 ÷ 7" },
      { id: 2, equation: "88 ÷ 8" },
      { id: 3, equation: "66 ÷ 6" },
      { id: 4, equation: "99 ÷ 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 80,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Dārzā ir 10 rindas ar 8 ābelēm katrā. Cik ābeļu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 93,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "56" },
      { id: 2, number: "35" },
      { id: 3, number: "37" },
      { id: 4, number: "41" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 48,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "8 × 6" },
      { id: 2, equation: "96 ÷ 2" },
      { id: 3, equation: "54 - 6" },
      { id: 4, equation: "6 × 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "72 ÷ 6" },
      { id: 2, equation: "84 ÷ 7" },
      { id: 3, equation: "96 ÷ 8" },
      { id: 4, equation: "108 ÷ 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 41,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā bija 95 banāni. Pārdeva 54 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 70,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "14" },
      { id: 2, number: "10" },
      { id: 3, number: "5" },
      { id: 4, number: "7" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "6 × 6" },
      { id: 2, equation: "42 - 6" },
      { id: 3, equation: "4 × 9" },
      { id: 4, equation: "72 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "56 ÷ 7" },
      { id: 2, equation: "72 ÷ 9" },
      { id: 3, equation: "48 ÷ 6" },
      { id: 4, equation: "64 ÷ 8" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 42,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "56" },
      { id: 2, number: "98" },
      { id: 3, number: "48" },
      { id: 4, number: "52" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 100,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "50 + 50" },
      { id: 2, equation: "200 ÷ 2" },
      { id: 3, equation: "110 - 10" },
      { id: 4, equation: "10 × 10" },
    ],
  },
];
