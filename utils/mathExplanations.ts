import books from "@/assets/images/books.png";
import banana from "@/assets/images/banana.png";
import apple from "@/assets/images/apple.png";
import cookie from "@/assets/images/cookie.png";
import pica from "@/assets/images/pica.png";
import {
  MathOperation,
  TaskType,
  isCreateMathTask,
  isMultiAnswerMathTask,
  isTextTask,
} from "@/context/app.context.reducer";

export type MathExplanation = {
  title: string;
  example: {
    left: number;
    right: number;
    operation: MathOperation;
    result: number;
  };
  visualItems: {
    leftItems: string[];
    rightItems: string[];
    operationSymbol: string;
  };
};

export const getMathExplanation = (task: TaskType): MathExplanation => {
  if (isTextTask(task)) {
    return getTextTaskExplanation(task.result);
  }

  if (isCreateMathTask(task)) {
    return getExplanationForOperation(task.operation, task.result);
  }

  if (isMultiAnswerMathTask(task)) {
    const firstOption = task.options[0];

    if (firstOption) {
      const operation = detectOperationFromEquation(firstOption.equation);
      return getExplanationForOperation(operation, task.result);
    }
  }

  return getExplanationForOperation("+", 5);
};

/**
 * Returns an explanation for text-based tasks
 */
const getTextTaskExplanation = (_result: number): MathExplanation => {
  const left = 3;
  const right = 2;
  const exampleResult = left + right;

  return {
    title: "Ja kaut ko iedod vai pievieno - saskaiti!",
    example: {
      left,
      right,
      operation: "+",
      result: exampleResult,
    },
    visualItems: {
      leftItems: [books, books, books],
      rightItems: [books, books],
      operationSymbol: "+",
    },
  };
};

/**
 * Detects the math operation from an equation string
 */
const detectOperationFromEquation = (equation: string): MathOperation => {
  if (equation.includes("+")) return "+";
  if (equation.includes("-")) return "-";
  if (equation.includes("×") || equation.includes("*")) return "×";
  if (equation.includes("÷") || equation.includes("/")) return "÷";
  return "+"; // default
};

/**
 * Returns an explanation based on the operation type
 */
const getExplanationForOperation = (operation: MathOperation, targetResult?: number): MathExplanation => {
  switch (operation) {
    case "+":
      return getAdditionExplanation(targetResult);
    case "-":
      return getSubtractionExplanation(targetResult);
    case "×":
    case "*":
      return getMultiplicationExplanation(targetResult);
    case "÷":
    case "/":
      return getDivisionExplanation(targetResult);
    default:
      return getAdditionExplanation(targetResult);
  }
};

const getAdditionExplanation = (targetResult?: number): MathExplanation => {
  // Use simple numbers for kids
  const left = 3;
  const right = 2;
  const result = left + right;

  return {
    title: "Saskaiti abus skaitļus kopā!",
    example: {
      left,
      right,
      operation: "+",
      result,
    },
    visualItems: {
      leftItems: Array(left).fill(apple),
      rightItems: Array(right).fill(apple),
      operationSymbol: "+",
    },
  };
};

const getSubtractionExplanation = (targetResult?: number): MathExplanation => {
  const left = 5;
  const right = 2;
  const result = left - right;

  return {
    title: "Atņem otro skaitli no pirmā!",
    example: {
      left,
      right,
      operation: "-",
      result,
    },
    visualItems: {
      leftItems: Array(left).fill(banana),
      rightItems: Array(right).fill(banana),
      operationSymbol: "-",
    },
  };
};

const getMultiplicationExplanation = (targetResult?: number): MathExplanation => {
  const left = 3;
  const right = 2;
  const result = left * right;

  return {
    title: "Saskaiti skaitli vairākas reizes!",
    example: {
      left,
      right,
      operation: "×",
      result,
    },
    visualItems: {
      leftItems: Array(left).fill(cookie.repeat(right)),
      rightItems: [],
      operationSymbol: "×",
    },
  };
};

const getDivisionExplanation = (targetResult?: number): MathExplanation => {
  const left = 6;
  const right = 2;
  const result = left / right;

  return {
    title: "Sadali vienādās daļās!",
    example: {
      left,
      right,
      operation: "÷",
      result,
    },
    visualItems: {
      leftItems: Array(left).fill(pica),
      rightItems: [],
      operationSymbol: "÷",
    },
  };
};
