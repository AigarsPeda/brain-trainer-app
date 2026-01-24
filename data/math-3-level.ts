import BananaIcon from "@/assets/images/banana.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 3: Numbers 1-12, Mixed addition and subtraction
export const LEVEL_3: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "6 + 5" },
      { id: 2, equation: "7 + 4" },
      { id: 3, equation: "8 + 4" },
      { id: 4, equation: "5 + 5" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "10 - 4" },
      { id: 2, equation: "11 - 5" },
      { id: 3, equation: "9 - 4" },
      { id: 4, equation: "8 - 3" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 7,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 4 banāni. Mamma iedeva vēl 3 banānus. Cik banānu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 12,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "5" },
      { id: 3, number: "6" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 5,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "12 - 7" },
      { id: 2, equation: "11 - 6" },
      { id: 3, equation: "10 - 4" },
      { id: 4, equation: "9 - 5" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 9,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "5 + 4" },
      { id: 2, equation: "6 + 3" },
      { id: 3, equation: "7 + 3" },
      { id: 4, equation: "4 + 4" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 5,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā bija 11 āboli. Nokrita 6 āboli. Cik ābolu palika kokā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 4,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "11" },
      { id: 2, number: "7" },
      { id: 3, number: "6" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 10,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "6 + 4" },
      { id: 2, equation: "7 + 3" },
      { id: 3, equation: "8 + 3" },
      { id: 4, equation: "5 + 4" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 3,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "11 - 8" },
      { id: 2, equation: "10 - 7" },
      { id: 3, equation: "12 - 8" },
      { id: 4, equation: "9 - 7" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 8,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "5" },
      { id: 2, number: "3" },
      { id: 3, number: "4" },
      { id: 4, number: "6" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 7,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "12 - 5" },
      { id: 2, equation: "11 - 4" },
      { id: 3, equation: "10 - 4" },
      { id: 4, equation: "9 - 3" },
    ],
  },
];
