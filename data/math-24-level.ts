import CookieIcon from "@/assets/images/cookie.png";
import AppleIcon from "@/assets/images/apple.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 24: Numbers 75-95, Addition and subtraction
export const LEVEL_24: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 90,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "75 + 15" },
      { id: 2, equation: "72 + 18" },
      { id: 3, equation: "78 + 13" },
      { id: 4, equation: "70 + 19" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 75,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "90 - 15" },
      { id: 2, equation: "88 - 13" },
      { id: 3, equation: "92 - 16" },
      { id: 4, equation: "85 - 11" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 82,
    taskNumberInLevel: 3,
    icon: CookieIcon,
    question: "Man ir 70 cepumi. Vecmāmiņa iedeva vēl 12 cepumus. Cik cepumu man tagad ir?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 95,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "80" },
      { id: 2, number: "15" },
      { id: 3, number: "16" },
      { id: 4, number: "14" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 72,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "88 - 16" },
      { id: 2, equation: "86 - 14" },
      { id: 3, equation: "90 - 17" },
      { id: 4, equation: "84 - 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 88,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "75 + 13" },
      { id: 2, equation: "73 + 15" },
      { id: 3, equation: "77 + 12" },
      { id: 4, equation: "71 + 16" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 78,
    taskNumberInLevel: 7,
    icon: AppleIcon,
    question: "Kokā bija 95 āboli. Nokrita 17 āboli. Cik ābolu palika kokā?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 70,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "90" },
      { id: 2, number: "20" },
      { id: 3, number: "18" },
      { id: 4, number: "22" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 85,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "72 + 13" },
      { id: 2, equation: "74 + 11" },
      { id: 3, equation: "70 + 14" },
      { id: 4, equation: "76 + 10" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 77,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "95 - 18" },
      { id: 2, equation: "93 - 16" },
      { id: 3, equation: "91 - 15" },
      { id: 4, equation: "89 - 13" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 92,
    operation: "+",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "78" },
      { id: 2, number: "14" },
      { id: 3, number: "15" },
      { id: 4, number: "13" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 80,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "95 - 15" },
      { id: 2, equation: "93 - 13" },
      { id: 3, equation: "91 - 12" },
      { id: 4, equation: "89 - 10" },
    ],
  },
];
