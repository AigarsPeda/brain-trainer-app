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
const getTextTaskExplanation = (result: number): MathExplanation => {
  return {
    title: "Ja kaut ko iedod vai pievieno - saskaiti!",
    example: {
      left: 3,
      right: 2,
      operation: "+",
      result: result,
    },
    visualItems: {
      leftItems: ["📚", "📚", "📚"],
      rightItems: ["📚", "📚"],
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
      leftItems: Array(left).fill("🍎"),
      rightItems: Array(right).fill("🍎"),
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
      leftItems: ["🍌", "🍌", "🍌", "🍌", "🍌"],
      rightItems: ["🍌", "🍌"],
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
      leftItems: ["🍪🍪", "🍪🍪", "🍪🍪"],
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
      leftItems: Array(left).fill("🍕"),
      rightItems: [],
      operationSymbol: "÷",
    },
  };
};
