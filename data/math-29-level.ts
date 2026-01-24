import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 29: 4× table basics
export const LEVEL_29: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 8,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "4 × 2" },
      { id: 2, equation: "3 × 3" },
      { id: 3, equation: "2 × 4" },
      { id: 4, equation: "4 × 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "4 × 4" },
      { id: 2, equation: "3 × 4" },
      { id: 3, equation: "3 × 5" },
      { id: 4, equation: "4 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 16,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Man ir 4 maisi ar 4 āboliem katrā. Cik ābolu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 20,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "4" },
      { id: 2, number: "2" },
      { id: 3, number: "5" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 16,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 × 5" },
      { id: 2, equation: "3 × 6" },
      { id: 3, equation: "2 × 9" },
      { id: 4, equation: "4 × 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "5 × 5" },
      { id: 2, equation: "4 × 6" },
      { id: 3, equation: "6 × 4" },
      { id: 4, equation: "4 × 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 28,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā ir 4 kastes. Katrā kastē ir 7 banāni. Cik banānu ir pavisam?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 32,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "16" },
      { id: 2, number: "8" },
      { id: 3, number: "2" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 28,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "4 × 7" },
      { id: 2, equation: "5 × 6" },
      { id: 3, equation: "7 × 4" },
      { id: 4, equation: "4 × 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "4 × 10" },
      { id: 2, equation: "9 × 4" },
      { id: 3, equation: "6 × 6" },
      { id: 4, equation: "4 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 40,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "4" },
      { id: 3, number: "5" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 32,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "8 × 4" },
      { id: 2, equation: "6 × 6" },
      { id: 3, equation: "5 × 7" },
      { id: 4, equation: "4 × 8" },
    ],
  },
];
