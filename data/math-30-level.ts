import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 30: Mixed 2×, 3×, 4×, 5× tables review
export const LEVEL_30: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "2 × 6" },
      { id: 2, equation: "5 × 3" },
      { id: 3, equation: "3 × 4" },
      { id: 4, equation: "4 × 4" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "2 × 10" },
      { id: 2, equation: "5 × 4" },
      { id: 3, equation: "3 × 7" },
      { id: 4, equation: "4 × 5" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 18,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Mamma cepa 3 paplātes ar 6 cepumiem katrā. Cik cepumu viņa izcepa?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 24,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "4" },
      { id: 2, number: "3" },
      { id: 3, number: "6" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "5 × 3" },
      { id: 2, equation: "2 × 8" },
      { id: 3, equation: "4 × 4" },
      { id: 4, equation: "3 × 5" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 35,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "6 × 6" },
      { id: 2, equation: "5 × 7" },
      { id: 3, equation: "7 × 5" },
      { id: 4, equation: "4 × 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 32,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Dārzā ir 4 rindas ar 8 ābelēm katrā. Cik ābeļu ir dārzā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 27,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "27" },
      { id: 2, number: "9" },
      { id: 3, number: "1" },
      { id: 4, number: "3" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "2 × 8" },
      { id: 2, equation: "5 × 4" },
      { id: 3, equation: "4 × 4" },
      { id: 4, equation: "3 × 6" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 45,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "6 × 8" },
      { id: 2, equation: "9 × 5" },
      { id: 3, equation: "7 × 7" },
      { id: 4, equation: "5 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 36,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "4" },
      { id: 3, number: "6" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "3 × 10" },
      { id: 2, equation: "6 × 6" },
      { id: 3, equation: "4 × 8" },
      { id: 4, equation: "5 × 6" },
    ],
  },
];
