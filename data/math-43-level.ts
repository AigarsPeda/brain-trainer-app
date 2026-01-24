import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 43: Mixed operations with larger numbers
export const LEVEL_43: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 45,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "9 × 5" },
      { id: 2, equation: "50 - 5" },
      { id: 3, equation: "5 × 9" },
      { id: 4, equation: "90 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 6,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "42 ÷ 7" },
      { id: 2, equation: "48 ÷ 8" },
      { id: 3, equation: "36 ÷ 6" },
      { id: 4, equation: "54 ÷ 9" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 72,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Veikalā ir 8 kastes ar 9 banāniem katrā. Cik banānu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 85,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "47" },
      { id: 2, number: "35" },
      { id: 3, number: "38" },
      { id: 4, number: "42" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 56,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "8 × 7" },
      { id: 2, equation: "112 ÷ 2" },
      { id: 3, equation: "63 - 7" },
      { id: 4, equation: "7 × 8" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 4,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "24 ÷ 6" },
      { id: 2, equation: "36 ÷ 9" },
      { id: 3, equation: "32 ÷ 8" },
      { id: 4, equation: "28 ÷ 7" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 34,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 82 cepumi. Mamma paņēma 48 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 63,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "21" },
      { id: 2, number: "7" },
      { id: 3, number: "3" },
      { id: 4, number: "9" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 49,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "7 × 7" },
      { id: 2, equation: "56 - 7" },
      { id: 3, equation: "25 + 24" },
      { id: 4, equation: "98 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 10,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "70 ÷ 7" },
      { id: 2, equation: "90 ÷ 9" },
      { id: 3, equation: "100 ÷ 10" },
      { id: 4, equation: "80 ÷ 8" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 37,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "47" },
      { id: 2, number: "84" },
      { id: 3, number: "45" },
      { id: 4, number: "51" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 90,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "10 × 9" },
      { id: 2, equation: "45 + 45" },
      { id: 3, equation: "100 - 10" },
      { id: 4, equation: "9 × 10" },
    ],
  },
];
