import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 34: 9× table basics
export const LEVEL_34: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "9 × 2" },
      { id: 2, equation: "2 × 9" },
      { id: 3, equation: "9 × 3" },
      { id: 4, equation: "6 × 4" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "9 × 3" },
      { id: 2, equation: "3 × 9" },
      { id: 3, equation: "9 × 4" },
      { id: 4, equation: "7 × 4" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 36,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 9 ķekari ar 4 banāniem katrā. Cik banānu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 45,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "5" },
      { id: 3, number: "15" },
      { id: 4, number: "3" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "9 × 4" },
      { id: 2, equation: "4 × 9" },
      { id: 3, equation: "9 × 5" },
      { id: 4, equation: "6 × 7" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 54,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "9 × 6" },
      { id: 2, equation: "6 × 9" },
      { id: 3, equation: "9 × 7" },
      { id: 4, equation: "7 × 8" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 63,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē ir 9 rindas ar 7 cepumiem katrā. Cik cepumu ir kastē?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 72,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "8" },
      { id: 3, number: "18" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 63,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "9 × 7" },
      { id: 2, equation: "7 × 9" },
      { id: 3, equation: "9 × 8" },
      { id: 4, equation: "8 × 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 81,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "9 × 9" },
      { id: 2, equation: "9 × 10" },
      { id: 3, equation: "8 × 10" },
      { id: 4, equation: "7 × 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 90,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "10" },
      { id: 3, number: "18" },
      { id: 4, number: "5" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 72,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "9 × 8" },
      { id: 2, equation: "8 × 9" },
      { id: 3, equation: "6 × 12" },
      { id: 4, equation: "7 × 11" },
    ],
  },
];
