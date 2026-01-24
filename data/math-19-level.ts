import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 19: Numbers 41-49, Addition and subtraction
export const LEVEL_19: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 48,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "39 + 9" },
      { id: 2, equation: "37 + 11" },
      { id: 3, equation: "40 + 9" },
      { id: 4, equation: "36 + 11" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 38,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "48 - 10" },
      { id: 2, equation: "47 - 9" },
      { id: 3, equation: "49 - 10" },
      { id: 4, equation: "46 - 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 40,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Grozā ir 31 banāns. Mamma ielika vēl 9 banānus. Cik banānu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 49,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "38" },
      { id: 2, number: "11" },
      { id: 3, number: "12" },
      { id: 4, number: "10" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 35,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "48 - 13" },
      { id: 2, equation: "47 - 12" },
      { id: 3, equation: "49 - 13" },
      { id: 4, equation: "46 - 12" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 47,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "38 + 9" },
      { id: 2, equation: "37 + 10" },
      { id: 3, equation: "39 + 9" },
      { id: 4, equation: "36 + 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 36,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 49 cepumi. Es apēdu 13 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 32,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "48" },
      { id: 2, number: "16" },
      { id: 3, number: "15" },
      { id: 4, number: "17" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 46,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "37 + 9" },
      { id: 2, equation: "38 + 8" },
      { id: 3, equation: "36 + 9" },
      { id: 4, equation: "39 + 8" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 34,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "49 - 15" },
      { id: 2, equation: "48 - 14" },
      { id: 3, equation: "47 - 14" },
      { id: 4, equation: "46 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 44,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "35" },
      { id: 2, number: "9" },
      { id: 3, number: "10" },
      { id: 4, number: "8" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 39,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "49 - 10" },
      { id: 2, equation: "48 - 9" },
      { id: 3, equation: "47 - 9" },
      { id: 4, equation: "46 - 8" },
    ],
  },
];
