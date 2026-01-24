import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 41: Mixed operations - all four basic operations
export const LEVEL_41: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "18 + 6" },
      { id: 2, equation: "4 × 6" },
      { id: 3, equation: "30 - 6" },
      { id: 4, equation: "48 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "35 ÷ 5" },
      { id: 2, equation: "21 ÷ 3" },
      { id: 3, equation: "14 ÷ 2" },
      { id: 4, equation: "28 ÷ 4" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 36,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Dārzā ir 6 rindas ar 6 ābelēm katrā. Cik ābeļu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 45,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "28" },
      { id: 2, number: "17" },
      { id: 3, number: "19" },
      { id: 4, number: "15" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "8 × 4" },
      { id: 2, equation: "4 × 8" },
      { id: 3, equation: "64 ÷ 2" },
      { id: 4, equation: "40 - 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "63 ÷ 7" },
      { id: 2, equation: "72 ÷ 8" },
      { id: 3, equation: "81 ÷ 9" },
      { id: 4, equation: "54 ÷ 6" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 15,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Man bija 42 banāni. Es atdevu 27 banānus. Cik banānu man palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 56,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "8" },
      { id: 3, number: "14" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 48,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "6 × 8" },
      { id: 2, equation: "32 + 16" },
      { id: 3, equation: "96 ÷ 2" },
      { id: 4, equation: "60 - 12" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "42 ÷ 7" },
      { id: 2, equation: "48 ÷ 8" },
      { id: 3, equation: "36 ÷ 6" },
      { id: 4, equation: "54 ÷ 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 8,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "72" },
      { id: 2, number: "9" },
      { id: 3, number: "36" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 63,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "7 × 9" },
      { id: 2, equation: "9 × 7" },
      { id: 3, equation: "45 + 18" },
      { id: 4, equation: "8 × 8" },
    ],
  },
];
