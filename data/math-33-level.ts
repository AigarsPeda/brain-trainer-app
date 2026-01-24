import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 33: 8× table basics
export const LEVEL_33: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "8 × 2" },
      { id: 2, equation: "4 × 5" },
      { id: 3, equation: "2 × 8" },
      { id: 4, equation: "8 × 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "8 × 4" },
      { id: 2, equation: "3 × 8" },
      { id: 3, equation: "6 × 5" },
      { id: 4, equation: "8 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 32,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 8 paciņas ar 4 cepumiem katrā. Cik cepumu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 40,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "8" },
      { id: 2, number: "4" },
      { id: 3, number: "5" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 × 8" },
      { id: 2, equation: "8 × 5" },
      { id: 3, equation: "6 × 6" },
      { id: 4, equation: "8 × 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 48,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "7 × 7" },
      { id: 2, equation: "8 × 6" },
      { id: 3, equation: "6 × 8" },
      { id: 4, equation: "8 × 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 56,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Dārzā ir 8 rindas ar 7 ābelēm katrā. Cik ābeļu ir dārzā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 64,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "16" },
      { id: 2, number: "8" },
      { id: 3, number: "4" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 56,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "8 × 7" },
      { id: 2, equation: "9 × 6" },
      { id: 3, equation: "7 × 8" },
      { id: 4, equation: "8 × 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 72,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "8 × 10" },
      { id: 2, equation: "9 × 8" },
      { id: 3, equation: "7 × 10" },
      { id: 4, equation: "8 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 80,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "8" },
      { id: 3, number: "5" },
      { id: 4, number: "16" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 64,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "9 × 7" },
      { id: 2, equation: "7 × 10" },
      { id: 3, equation: "6 × 11" },
      { id: 4, equation: "8 × 8" },
    ],
  },
];
