import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 32: 7× table basics
export const LEVEL_32: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "7 × 2" },
      { id: 2, equation: "4 × 4" },
      { id: 3, equation: "2 × 7" },
      { id: 4, equation: "7 × 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 21,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "7 × 4" },
      { id: 2, equation: "3 × 7" },
      { id: 3, equation: "6 × 4" },
      { id: 4, equation: "7 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 28,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Dārzā ir 7 koki. Uz katra koka ir 4 āboli. Cik ābolu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 35,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "1" },
      { id: 3, number: "5" },
      { id: 4, number: "35" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 28,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 × 7" },
      { id: 2, equation: "7 × 5" },
      { id: 3, equation: "6 × 5" },
      { id: 4, equation: "7 × 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 42,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "6 × 8" },
      { id: 2, equation: "7 × 6" },
      { id: 3, equation: "6 × 7" },
      { id: 4, equation: "7 × 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 49,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Nedēļā ir 7 dienas. Cik banānu apēdīšu, ja katru dienu ēdīšu 7 banānus?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 56,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "14" },
      { id: 2, number: "8" },
      { id: 3, number: "4" },
      { id: 4, number: "7" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 49,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "7 × 7" },
      { id: 2, equation: "8 × 6" },
      { id: 3, equation: "7 × 8" },
      { id: 4, equation: "6 × 9" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 63,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "7 × 10" },
      { id: 2, equation: "9 × 7" },
      { id: 3, equation: "8 × 8" },
      { id: 4, equation: "7 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 70,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "7" },
      { id: 3, number: "5" },
      { id: 4, number: "14" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 56,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "8 × 7" },
      { id: 2, equation: "9 × 6" },
      { id: 3, equation: "6 × 10" },
      { id: 4, equation: "7 × 8" },
    ],
  },
];
