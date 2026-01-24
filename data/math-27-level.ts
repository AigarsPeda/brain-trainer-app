import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 27: 5× table basics
export const LEVEL_27: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 10,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "5 × 2" },
      { id: 2, equation: "4 × 3" },
      { id: 3, equation: "2 × 5" },
      { id: 4, equation: "5 × 3" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "5 × 4" },
      { id: 2, equation: "3 × 5" },
      { id: 3, equation: "4 × 4" },
      { id: 4, equation: "5 × 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 20,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 4 paciņas ar 5 cepumiem katrā. Cik cepumu man ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 25,
    operation: "×",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "5" },
      { id: 2, number: "6" },
      { id: 3, number: "5" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "4 × 5" },
      { id: 2, equation: "5 × 5" },
      { id: 3, equation: "4 × 6" },
      { id: 4, equation: "5 × 4" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 30,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "4 × 8" },
      { id: 2, equation: "5 × 6" },
      { id: 3, equation: "6 × 5" },
      { id: 4, equation: "5 × 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 35,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā ir 7 zari. Uz katra zara ir 5 āboli. Cik ābolu ir pavisam?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 40,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "8" },
      { id: 3, number: "4" },
      { id: 4, number: "5" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 35,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "5 × 7" },
      { id: 2, equation: "6 × 6" },
      { id: 3, equation: "7 × 5" },
      { id: 4, equation: "5 × 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 45,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "5 × 10" },
      { id: 2, equation: "9 × 5" },
      { id: 3, equation: "6 × 8" },
      { id: 4, equation: "5 × 9" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 50,
    operation: "×",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "5" },
      { id: 3, number: "2" },
      { id: 4, number: "25" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 40,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "8 × 5" },
      { id: 2, equation: "4 × 9" },
      { id: 3, equation: "6 × 7" },
      { id: 4, equation: "5 × 8" },
    ],
  },
];
