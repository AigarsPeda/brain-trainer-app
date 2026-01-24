import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 25: Numbers 85-100, Addition and subtraction (final +/- level)
export const LEVEL_25: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 100,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "85 + 15" },
      { id: 2, equation: "82 + 18" },
      { id: 3, equation: "88 + 13" },
      { id: 4, equation: "80 + 19" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 85,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "100 - 15" },
      { id: 2, equation: "98 - 13" },
      { id: 3, equation: "96 - 12" },
      { id: 4, equation: "94 - 10" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 92,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Grozā ir 80 banāni. Mamma ielika vēl 12 banānus. Cik banānu tagad ir grozā?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 98,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "85" },
      { id: 2, number: "13" },
      { id: 3, number: "14" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 82,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "98 - 16" },
      { id: 2, equation: "96 - 14" },
      { id: 3, equation: "100 - 17" },
      { id: 4, equation: "94 - 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 97,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "84 + 13" },
      { id: 2, equation: "82 + 15" },
      { id: 3, equation: "86 + 12" },
      { id: 4, equation: "80 + 16" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 83,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 100 cepumi. Es apēdu 17 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 80,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "100" },
      { id: 2, number: "20" },
      { id: 3, number: "18" },
      { id: 4, number: "22" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 95,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "82 + 13" },
      { id: 2, equation: "84 + 11" },
      { id: 3, equation: "80 + 14" },
      { id: 4, equation: "86 + 10" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 87,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "100 - 13" },
      { id: 2, equation: "98 - 11" },
      { id: 3, equation: "96 - 10" },
      { id: 4, equation: "94 - 8" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 99,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "86" },
      { id: 2, number: "13" },
      { id: 3, number: "14" },
      { id: 4, number: "12" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 90,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "100 - 10" },
      { id: 2, equation: "98 - 8" },
      { id: 3, equation: "96 - 7" },
      { id: 4, equation: "94 - 5" },
    ],
  },
];
