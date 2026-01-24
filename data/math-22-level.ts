import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 22: Numbers 55-75, Addition and subtraction
export const LEVEL_22: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 70,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "55 + 15" },
      { id: 2, equation: "52 + 18" },
      { id: 3, equation: "58 + 13" },
      { id: 4, equation: "50 + 19" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 55,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "70 - 15" },
      { id: 2, equation: "68 - 13" },
      { id: 3, equation: "72 - 16" },
      { id: 4, equation: "65 - 11" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 62,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Grozā ir 50 banāni. Mamma ielika vēl 12 banānus. Cik banānu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 75,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "60" },
      { id: 2, number: "15" },
      { id: 3, number: "16" },
      { id: 4, number: "14" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 52,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "68 - 16" },
      { id: 2, equation: "66 - 14" },
      { id: 3, equation: "70 - 17" },
      { id: 4, equation: "64 - 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 68,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "55 + 13" },
      { id: 2, equation: "53 + 15" },
      { id: 3, equation: "57 + 12" },
      { id: 4, equation: "51 + 16" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 58,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 75 cepumi. Es apēdu 17 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 50,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "70" },
      { id: 2, number: "20" },
      { id: 3, number: "18" },
      { id: 4, number: "22" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 65,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "52 + 13" },
      { id: 2, equation: "54 + 11" },
      { id: 3, equation: "50 + 14" },
      { id: 4, equation: "56 + 10" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 57,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "75 - 18" },
      { id: 2, equation: "73 - 16" },
      { id: 3, equation: "71 - 15" },
      { id: 4, equation: "69 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 72,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "58" },
      { id: 2, number: "14" },
      { id: 3, number: "15" },
      { id: 4, number: "13" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 60,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "75 - 15" },
      { id: 2, equation: "73 - 13" },
      { id: 3, equation: "71 - 12" },
      { id: 4, equation: "69 - 10" },
    ],
  },
];
