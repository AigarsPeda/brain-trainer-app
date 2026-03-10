import books from "@/assets/images/books.png";
import banana from "@/assets/images/banana.png";
import apple from "@/assets/images/apple.png";
import cookie from "@/assets/images/cookie.png";
import pica from "@/assets/images/pica.png";
import {
  MathOperation,
  TaskType,
  TextTaskType,
  isCreateMathTask,
  isMultiAnswerMathTask,
  isTextTask,
} from "@/context/app.context.reducer";
import type { ImageSourcePropType } from "react-native";

export type MathVisualItem = string | ImageSourcePropType;

export type MathExplanation = {
  title: string;
  example: {
    left: number;
    right: number;
    operation: MathOperation;
    result: number;
  };
  visualItems: {
    leftItems: MathVisualItem[];
    rightItems: MathVisualItem[];
    operationSymbol: string;
  };
};

export const getMathExplanation = (task: TaskType): MathExplanation => {
  if (isTextTask(task)) {
    return getTextTaskExplanation(task);
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
const getTextTaskExplanation = (task: TextTaskType): MathExplanation => {
  if (isSubtractionTextTask(task.question)) {
    return getTextSubtractionExplanation(task.icon);
  }

  return getTextAdditionExplanation(task.icon);
};

const isSubtractionTextTask = (question: string): boolean => {
  const normalizedQuestion = question.toLowerCase();

  return ["apēdu", "atdevu", "pārdeva", "paņēma", "nokrita", "novāca", "palika"].some((keyword) =>
    normalizedQuestion.includes(keyword)
  );
};

const getTextAdditionExplanation = (itemIcon?: ImageSourcePropType): MathExplanation => {
  const left = 3;
  const right = 2;
  const exampleResult = left + right;
  const visualItem = itemIcon ?? books;

  return {
    title: "Ja kaut ko iedod vai pievieno - saskaiti!",
    example: {
      left,
      right,
      operation: "+",
      result: exampleResult,
    },
    visualItems: {
      leftItems: Array(left).fill(visualItem),
      rightItems: Array(right).fill(visualItem),
      operationSymbol: "+",
    },
  };
};

const getTextSubtractionExplanation = (itemIcon?: ImageSourcePropType): MathExplanation => {
  const left = 5;
  const right = 2;
  const exampleResult = left - right;
  const visualItem = itemIcon ?? banana;

  return {
    title: "Ja kaut ko noņem, apēd vai atdod - atņem!",
    example: {
      left,
      right,
      operation: "-",
      result: exampleResult,
    },
    visualItems: {
      leftItems: Array(left).fill(visualItem),
      rightItems: Array(right).fill(visualItem),
      operationSymbol: "-",
    },
  };
};

/**
 * Detects the math operation from an equation string
 */
const detectOperationFromEquation = (equation: string): MathOperation => {
  if (equation.includes("+")) {
    return "+";
  }
  if (equation.includes("-")) {
    return "-";
  }
  if (equation.includes("×") || equation.includes("*")) {
    return "×";
  }
  if (equation.includes("÷") || equation.includes("/")) {
    return "÷";
  }
  return "+"; // default
};

/**
 * Returns an explanation based on the operation type
 */
const getExplanationForOperation = (operation: MathOperation): MathExplanation => {
  switch (operation) {
    case "+":
      return getAdditionExplanation();
    case "-":
      return getSubtractionExplanation();
    case "×":
    case "*":
      return getMultiplicationExplanation();
    case "÷":
    case "/":
      return getDivisionExplanation();
    default:
      return getAdditionExplanation();
  }
};

const getAdditionExplanation = (): MathExplanation => {
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

const getSubtractionExplanation = (): MathExplanation => {
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

const getMultiplicationExplanation = (): MathExplanation => {
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

const getDivisionExplanation = (): MathExplanation => {
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
