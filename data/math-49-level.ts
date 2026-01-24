import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import type { TaskType } from "@/context/app.context.reducer";

// Level 49: Expert level
export const LEVEL_49: TaskType[] = [
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 156,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "12 × 13" },
      { id: 2, equation: "312 ÷ 2" },
      { id: 3, equation: "13 × 12" },
      { id: 4, equation: "78 + 78" },
    ],
  },
  {
    id: 2,
    taskType: "mathTaskWithResult",
    result: 13,
    taskNumberInLevel: 2,
    options: [
      { id: 1, equation: "130 ÷ 10" },
      { id: 2, equation: "143 ÷ 11" },
      { id: 3, equation: "117 ÷ 9" },
      { id: 4, equation: "156 ÷ 12" },
    ],
  },
  {
    id: 3,
    taskType: "textTask",
    result: 126,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Veikalā ir 9 kastes ar 14 banāniem katrā. Cik banānu ir pavisam?",
  },
  {
    id: 4,
    taskType: "createMathTask",
    result: 168,
    operation: "+",
    taskNumberInLevel: 4,
    options: [
      { id: 1, number: "89" },
      { id: 2, number: "73" },
      { id: 3, number: "79" },
      { id: 4, number: "85" },
    ],
  },
  {
    id: 5,
    taskType: "mathTaskWithResult",
    result: 91,
    taskNumberInLevel: 5,
    options: [
      { id: 1, equation: "13 × 7" },
      { id: 2, equation: "182 ÷ 2" },
      { id: 3, equation: "98 - 7" },
      { id: 4, equation: "7 × 13" },
    ],
  },
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 14,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "126 ÷ 9" },
      { id: 2, equation: "168 ÷ 12" },
      { id: 3, equation: "154 ÷ 11" },
      { id: 4, equation: "140 ÷ 10" },
    ],
  },
  {
    id: 7,
    taskType: "textTask",
    result: 89,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 175 cepumi. Apēda 86 cepumus. Cik cepumu palika?",
  },
  {
    id: 8,
    taskType: "createMathTask",
    result: 143,
    operation: "×",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "143" },
      { id: 2, number: "13" },
      { id: 3, number: "1" },
      { id: 4, number: "11" },
    ],
  },
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 104,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "8 × 13" },
      { id: 2, equation: "112 - 8" },
      { id: 3, equation: "13 × 8" },
      { id: 4, equation: "208 ÷ 2" },
    ],
  },
  {
    id: 10,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 10,
    options: [
      { id: 1, equation: "150 ÷ 10" },
      { id: 2, equation: "165 ÷ 11" },
      { id: 3, equation: "135 ÷ 9" },
      { id: 4, equation: "180 ÷ 12" },
    ],
  },
  {
    id: 11,
    taskType: "createMathTask",
    result: 97,
    operation: "-",
    taskNumberInLevel: 11,
    options: [
      { id: 1, number: "83" },
      { id: 2, number: "180" },
      { id: 3, number: "71" },
      { id: 4, number: "77" },
    ],
  },
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 169,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "84 + 85" },
      { id: 2, equation: "338 ÷ 2" },
      { id: 3, equation: "180 - 11" },
      { id: 4, equation: "13 × 13" },
    ],
  },
];
