import BananaIcon from "@/assets/images/banana.png";
import CookieIcon from "@/assets/images/cookie.png";
import BooksIcon from "@/assets/images/books.png";
import type { TaskType } from "@/context/app.context.reducer";

export const LEVEL_4: TaskType[] = [
  // Task 1: mathTaskWithResult - Addition (15 + 5 = 20)
  {
    id: 1,
    taskType: "mathTaskWithResult",
    result: 20,
    taskNumberInLevel: 1,
    options: [
      { id: 1, equation: "15 + 5" },
      { id: 2, equation: "14 + 5" },
      { id: 3, equation: "12 + 8" },
      { id: 4, equation: "18 + 3" },
    ],
  },
  // Task 2: createMathTask - Division (24 ÷ 4 = 6... wait, result should be in 15-25 range)
  // Let's do multiplication: ? × ? = 18
  {
    id: 2,
    taskType: "createMathTask",
    result: 18,
    operation: "×",
    taskNumberInLevel: 2,
    options: [
      { id: 1, number: "4" },
      { id: 2, number: "3" },
      { id: 3, number: "5" },
      { id: 4, number: "6" },
    ],
  },
  // Task 3: textTask - Word problem with bananas
  {
    id: 3,
    taskType: "textTask",
    result: 17,
    taskNumberInLevel: 3,
    icon: BananaIcon,
    question: "Man ir 12 banāni. Draugs iedeva vēl 5 banānus. Cik banānu man tagad ir?",
  },
  // Task 4: mathTaskWithResult - Subtraction (25 - 6 = 19)
  {
    id: 4,
    taskType: "mathTaskWithResult",
    result: 19,
    taskNumberInLevel: 4,
    options: [
      { id: 1, equation: "25 - 6" },
      { id: 2, equation: "24 - 4" },
      { id: 3, equation: "22 - 3" },
      { id: 4, equation: "20 - 2" },
    ],
  },
  // Task 5: createMathTask - Addition (? + ? = 22)
  {
    id: 5,
    taskType: "createMathTask",
    result: 22,
    operation: "+",
    taskNumberInLevel: 5,
    options: [
      { id: 1, number: "7" },
      { id: 2, number: "9" },
      { id: 3, number: "6" },
      { id: 4, number: "15" },
    ],
  },
  // Task 6: mathTaskWithResult - Multiplication (3 × 5 = 15)
  {
    id: 6,
    taskType: "mathTaskWithResult",
    result: 15,
    taskNumberInLevel: 6,
    options: [
      { id: 1, equation: "2 × 8" },
      { id: 2, equation: "3 × 5" },
      { id: 3, equation: "5 × 3" },
      { id: 4, equation: "4 × 4" },
    ],
  },
  // Task 7: textTask - Word problem with cookies
  {
    id: 7,
    taskType: "textTask",
    result: 16,
    taskNumberInLevel: 7,
    icon: CookieIcon,
    question: "Kastē bija 24 cepumi. Es apēdu 8 cepumus. Cik cepumu palika kastē?",
  },
  // Task 8: createMathTask - Subtraction (? - ? = 17)
  {
    id: 8,
    taskType: "createMathTask",
    result: 17,
    operation: "-",
    taskNumberInLevel: 8,
    options: [
      { id: 1, number: "10" },
      { id: 2, number: "8" },
      { id: 3, number: "6" },
      { id: 4, number: "25" },
    ],
  },
  // Task 9: mathTaskWithResult - Division (20 ÷ 4 = 5... let's use result 4 with 24 ÷ 6)
  // Actually let's keep results higher: find equations that equal 24
  {
    id: 9,
    taskType: "mathTaskWithResult",
    result: 24,
    taskNumberInLevel: 9,
    options: [
      { id: 1, equation: "6 × 4" },
      { id: 2, equation: "5 × 5" },
      { id: 3, equation: "30 - 6" },
      { id: 4, equation: "19 + 6" },
    ],
  },
  // Task 10: createMathTask - Division (? ÷ ? = 5 using 20 ÷ 4)
  {
    id: 10,
    taskType: "createMathTask",
    result: 5,
    operation: "÷",
    taskNumberInLevel: 10,
    options: [
      { id: 1, number: "6" },
      { id: 2, number: "4" },
      { id: 3, number: "3" },
      { id: 4, number: "20" },
    ],
  },
  // Task 11: textTask - Word problem with books
  {
    id: 11,
    taskType: "textTask",
    result: 21,
    taskNumberInLevel: 11,
    icon: BooksIcon,
    question: "Plauktā ir 14 grāmatas. Mamma nopirka vēl 7 grāmatas. Cik grāmatu tagad ir plauktā?",
  },
  // Task 12: mathTaskWithResult - Mixed operations (final challenge)
  {
    id: 12,
    taskType: "mathTaskWithResult",
    result: 25,
    taskNumberInLevel: 12,
    options: [
      { id: 1, equation: "30 - 5" },
      { id: 2, equation: "5 × 5" },
      { id: 3, equation: "4 × 6" },
      { id: 4, equation: "20 + 6" },
    ],
  },
];
