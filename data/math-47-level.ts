import AppleIcon from "@/assets/images/apple.png";
import BananaIcon from "@/assets/images/banana.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 47: Advanced operations with 12× table
export const LEVEL_47: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "12 × 2" },
      { id: 2, equation: "2 × 12" },
      { id: 3, equation: "48 ÷ 2" },
      { id: 4, equation: "30 - 6" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 36,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "12 × 3" },
      { id: 2, equation: "3 × 12" },
      { id: 3, equation: "72 ÷ 2" },
      { id: 4, equation: "42 - 6" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 48,
    taskNumberInLevel: 3,
    icon: AppleIcon,
    question: "Gadā ir 12 mēneši. Ja katru mēnesi nopērku 4 ābolus, cik ābolus nopirkšu gadā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 60,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "12" },
      { id: 2, number: "5" },
      { id: 3, number: "15" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 72,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "12 × 6" },
      { id: 2, equation: "6 × 12" },
      { id: 3, equation: "144 ÷ 2" },
      { id: 4, equation: "80 - 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "84 ÷ 12" },
      { id: 2, equation: "77 ÷ 11" },
      { id: 3, equation: "70 ÷ 10" },
      { id: 4, equation: "63 ÷ 9" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 67,
    taskNumberInLevel: 7,
    icon: BananaIcon,
    question: "Grozā bija 132 banāni. Pārdeva 65 banānus. Cik banānu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 96,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "12" },
      { id: 2, number: "8" },
      { id: 3, number: "24" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 84,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "12 × 7" },
      { id: 2, equation: "7 × 12" },
      { id: 3, equation: "168 ÷ 2" },
      { id: 4, equation: "90 - 6" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "108 ÷ 12" },
      { id: 2, equation: "99 ÷ 11" },
      { id: 3, equation: "90 ÷ 10" },
      { id: 4, equation: "81 ÷ 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 10,
    operation: "÷",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "120" },
      { id: 2, number: "12" },
      { id: 3, number: "60" },
      { id: 4, number: "2" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 144,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "12 × 12" },
      { id: 2, equation: "72 + 72" },
      { id: 3, equation: "288 ÷ 2" },
      { id: 4, equation: "150 - 6" },
    ],
  },
];
