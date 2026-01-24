import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 46: Advanced mixed operations
export const LEVEL_46: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 77,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "7 × 11" },
      { id: 2, equation: "11 × 7" },
      { id: 3, equation: "84 - 7" },
      { id: 4, equation: "154 ÷ 2" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 12,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "96 ÷ 8" },
      { id: 2, equation: "108 ÷ 9" },
      { id: 3, equation: "84 ÷ 7" },
      { id: 4, equation: "72 ÷ 6" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 99,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Veikalā ir 9 kastes ar 11 banāniem katrā. Cik banānu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 115,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "68" },
      { id: 2, number: "47" },
      { id: 3, number: "52" },
      { id: 4, number: "43" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 66,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "6 × 11" },
      { id: 2, equation: "11 × 6" },
      { id: 3, equation: "132 ÷ 2" },
      { id: 4, equation: "72 - 6" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 11,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "88 ÷ 8" },
      { id: 2, equation: "99 ÷ 9" },
      { id: 3, equation: "77 ÷ 7" },
      { id: 4, equation: "66 ÷ 6" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 57,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 120 cepumi. Mamma paņēma 63 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 108,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "9" },
      { id: 2, number: "12" },
      { id: 3, number: "27" },
      { id: 4, number: "4" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 55,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "5 × 11" },
      { id: 2, equation: "11 × 5" },
      { id: 3, equation: "110 ÷ 2" },
      { id: 4, equation: "60 - 5" },
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
      { id: 3, equation: "81 ÷ 9" },
      { id: 4, equation: "72 ÷ 8" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 64,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "125" },
      { id: 2, number: "61" },
      { id: 3, number: "57" },
      { id: 4, number: "53" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 121,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "11 × 11" },
      { id: 2, equation: "60 + 61" },
      { id: 3, equation: "242 ÷ 2" },
      { id: 4, equation: "130 - 9" },
    ],
  },
];
