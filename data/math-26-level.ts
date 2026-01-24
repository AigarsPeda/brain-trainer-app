import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 26: Intro to multiplication - 2× table basics
export const LEVEL_26: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "2 × 2" },
      { id: 2, equation: "2 + 2" },
      { id: 3, equation: "3 × 2" },
      { id: 4, equation: "1 × 4" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "2 × 3" },
      { id: 2, equation: "3 × 2" },
      { id: 3, equation: "2 × 4" },
      { id: 4, equation: "3 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 8,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Man ir 2 grozos pa 4 āboliem katrā. Cik ābolu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 10,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "2" },
      { id: 2, number: "5" },
      { id: 3, number: "4" },
      { id: 4, number: "3" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "2 × 4" },
      { id: 2, equation: "4 × 2" },
      { id: 3, equation: "2 × 5" },
      { id: 4, equation: "3 × 3" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "2 × 6" },
      { id: 2, equation: "6 × 2" },
      { id: 3, equation: "3 × 5" },
      { id: 4, equation: "4 × 4" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 14,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Katram no 2 draugiem ir 7 banāni. Cik banānu ir kopā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 16,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "2" },
      { id: 2, number: "8" },
      { id: 3, number: "4" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "2 × 7" },
      { id: 2, equation: "7 × 2" },
      { id: 3, equation: "2 × 8" },
      { id: 4, equation: "3 × 5" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "2 × 9" },
      { id: 2, equation: "9 × 2" },
      { id: 3, equation: "3 × 7" },
      { id: 4, equation: "2 × 8" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 20,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "2" },
      { id: 2, number: "10" },
      { id: 3, number: "5" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "2 × 8" },
      { id: 2, equation: "8 × 2" },
      { id: 3, equation: "4 × 5" },
      { id: 4, equation: "3 × 6" },
    ],
  },
];
