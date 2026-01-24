import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 31: 6× table basics
export const LEVEL_31: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "6 × 2" },
      { id: 2, equation: "4 × 4" },
      { id: 3, equation: "2 × 6" },
      { id: 4, equation: "6 × 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "6 × 4" },
      { id: 2, equation: "3 × 6" },
      { id: 3, equation: "5 × 4" },
      { id: 4, equation: "6 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 24,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 6 ķekari ar 4 banāniem katrā. Cik banānu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 30,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "6" },
      { id: 2, number: "3" },
      { id: 3, number: "5" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 × 6" },
      { id: 2, equation: "6 × 5" },
      { id: 3, equation: "5 × 5" },
      { id: 4, equation: "6 × 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "4 × 10" },
      { id: 2, equation: "6 × 6" },
      { id: 3, equation: "6 × 7" },
      { id: 4, equation: "5 × 8" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 42,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē ir 6 rindas ar 7 cepumiem katrā. Cik cepumu ir kastē?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 48,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "12" },
      { id: 2, number: "8" },
      { id: 3, number: "4" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 42,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "6 × 7" },
      { id: 2, equation: "5 × 9" },
      { id: 3, equation: "7 × 6" },
      { id: 4, equation: "6 × 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 54,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "6 × 10" },
      { id: 2, equation: "9 × 6" },
      { id: 3, equation: "7 × 8" },
      { id: 4, equation: "6 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 60,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "6" },
      { id: 3, number: "5" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 48,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "8 × 6" },
      { id: 2, equation: "7 × 7" },
      { id: 3, equation: "5 × 10" },
      { id: 4, equation: "6 × 8" },
    ],
  },
];
