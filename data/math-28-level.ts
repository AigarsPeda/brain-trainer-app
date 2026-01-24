import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 28: 3× table basics
export const LEVEL_28: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "3 × 2" },
      { id: 2, equation: "2 × 4" },
      { id: 3, equation: "2 × 3" },
      { id: 4, equation: "3 × 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "2 × 5" },
      { id: 2, equation: "3 × 4" },
      { id: 3, equation: "4 × 2" },
      { id: 4, equation: "3 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 12,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 3 ķekari ar 4 banāniem katrā. Cik banānu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 15,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "3" },
      { id: 2, number: "6" },
      { id: 3, number: "5" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 × 3" },
      { id: 2, equation: "3 × 5" },
      { id: 3, equation: "2 × 7" },
      { id: 4, equation: "3 × 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 18,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "4 × 5" },
      { id: 2, equation: "3 × 6" },
      { id: 3, equation: "6 × 3" },
      { id: 4, equation: "3 × 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 21,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Uz galda ir 3 šķīvji. Katrā šķīvī ir 7 cepumi. Cik cepumu ir pavisam?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 24,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "6" },
      { id: 2, number: "8" },
      { id: 3, number: "4" },
      { id: 4, number: "3" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 21,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "3 × 7" },
      { id: 2, equation: "4 × 6" },
      { id: 3, equation: "7 × 3" },
      { id: 4, equation: "3 × 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 27,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "3 × 10" },
      { id: 2, equation: "9 × 3" },
      { id: 3, equation: "4 × 7" },
      { id: 4, equation: "3 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 30,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "3" },
      { id: 3, number: "5" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "8 × 3" },
      { id: 2, equation: "4 × 7" },
      { id: 3, equation: "6 × 5" },
      { id: 4, equation: "3 × 8" },
    ],
  },
];
