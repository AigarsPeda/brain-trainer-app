import { MathOperation } from "@/context/app.context.reducer";

export const checkAnswers = (
  value1: number | null,
  value2: number | null,
  operation: MathOperation,
  result: number | null
): boolean => {
  if (value1 === null || value2 === null) {
    return false;
  }

  let calculatedResult: number;
  switch (operation) {
    case "+":
      calculatedResult = value1 + value2;
      break;
    case "-":
      calculatedResult = value1 - value2;
      break;
    case "×":
    case "*":
      calculatedResult = value1 * value2;
      break;
    case "÷":
    case "/":
      calculatedResult = value1 / value2;
      break;
    default:
      calculatedResult = 0;
  }

  const isCorrect = calculatedResult === result;
  //   console.log(`Task ID: ${task.id}, Is Correct: ${isCorrect}`);
  return isCorrect;
};
