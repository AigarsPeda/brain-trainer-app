import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 35: 10× table and multiplication review
export const LEVEL_35: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "10 × 2" },
      { id: 2, equation: "2 × 10" },
      { id: 3, equation: "10 × 3" },
      { id: 4, equation: "5 × 5" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "10 × 3" },
      { id: 2, equation: "3 × 10" },
      { id: 3, equation: "10 × 4" },
      { id: 4, equation: "6 × 6" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 40,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Kastē ir 10 rindas ar 4 āboliem katrā. Cik ābolu ir kastē?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 50,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "5" },
      { id: 3, number: "25" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 60,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "10 × 6" },
      { id: 2, equation: "6 × 10" },
      { id: 3, equation: "10 × 7" },
      { id: 4, equation: "8 × 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 70,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "10 × 7" },
      { id: 2, equation: "7 × 10" },
      { id: 3, equation: "10 × 8" },
      { id: 4, equation: "9 × 8" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 80,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Veikalā ir 10 kastes ar 8 banāniem katrā. Cik banānu ir pavisam?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 90,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "9" },
      { id: 3, number: "45" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 100,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "10 × 10" },
      { id: 2, equation: "5 × 20" },
      { id: 3, equation: "4 × 25" },
      { id: 4, equation: "9 × 11" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 45,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "9 × 5" },
      { id: 2, equation: "5 × 9" },
      { id: 3, equation: "6 × 8" },
      { id: 4, equation: "7 × 7" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 56,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "8" },
      { id: 3, number: "14" },
      { id: 4, number: "4" },
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
      { id: 3, equation: "8 × 8" },
      { id: 4, equation: "6 × 11" },
    ],
  },
];
