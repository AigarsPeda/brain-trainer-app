import type {
  CreateMathTaskOptionType,
  CreateMathTaskType,
  MathOperation,
  MultiAnswerMathTaskType,
  TaskOptionType,
} from "@/context/app.context.reducer";
import { isEquationCorrect } from "./utils";

/**
 * Finds all incorrect options for a multi-answer math task
 */
export const findIncorrectMultiAnswerOptions = (
  task: MultiAnswerMathTaskType,
  removedAnswerIds: number[]
): TaskOptionType[] => {
  return task.options.filter((option) => {
    if (removedAnswerIds.includes(option.id)) return false;
    return !isEquationCorrect(option.equation, task.result);
  });
};

/**
 * Calculates the result of a math operation
 */
const calculateOperation = (num1: number, num2: number, operation: MathOperation): number => {
  switch (operation) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "×":
    case "*":
      return num1 * num2;
    case "÷":
    case "/":
      return num2 !== 0 ? num1 / num2 : NaN;
    default:
      return NaN;
  }
};

/**
 * Finds all correct numbers that can be used in a create math task
 */
const findCorrectNumbers = (task: CreateMathTaskType): Set<number> => {
  const correctNumbers = new Set<number>();
  const { options, operation, result } = task;

  options.forEach((opt1) => {
    options.forEach((opt2) => {
      const num1 = Number(opt1.number);
      const num2 = Number(opt2.number);
      const calcResult = calculateOperation(num1, num2, operation);

      if (calcResult === result) {
        correctNumbers.add(num1);
        correctNumbers.add(num2);
      }
    });
  });

  return correctNumbers;
};

/**
 * Finds all incorrect number options for a create math task
 */
export const findIncorrectCreateMathOptions = (
  task: CreateMathTaskType,
  removedAnswerIds: number[]
): CreateMathTaskOptionType[] => {
  const correctNumbers = findCorrectNumbers(task);

  return task.options.filter((option) => {
    if (removedAnswerIds.includes(option.id)) return false;
    return !correctNumbers.has(Number(option.number));
  });
};

/**
 * Selects and returns a random item from an array
 */
export const selectRandomItem = <T>(items: T[]): T | null => {
  if (items.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};
