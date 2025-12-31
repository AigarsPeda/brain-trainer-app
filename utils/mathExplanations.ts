import {
  MathOperation,
  TaskType,
  isCreateMathTask,
  isMultiAnswerMathTask,
  isTextTask,
} from "@/context/app.context.reducer";

export type MathExplanation = {
  title: string;
  description: string;
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
  tip: string;
};

/**
 * Generates a kid-friendly explanation for a math task based on its type and operation.
 * The explanation includes a simple example with visual representation.
 */
export const getMathExplanation = (task: TaskType): MathExplanation => {
  // For "textTask" type - provide a generic reading comprehension hint
  if (isTextTask(task)) {
    return getTextTaskExplanation(task.result);
  }

  // For "createMathTask" type - we know the operation
  if (isCreateMathTask(task)) {
    return getExplanationForOperation(task.operation, task.result);
  }

  // For "mathTaskWithResult" type - we need to detect the operation from the equations
  if (isMultiAnswerMathTask(task)) {
    const firstOption = task.options[0];
    if (firstOption) {
      const operation = detectOperationFromEquation(firstOption.equation);
      return getExplanationForOperation(operation, task.result);
    }
  }

  // Default fallback
  return getExplanationForOperation("+", 5);
};

/**
 * Returns an explanation for text-based tasks
 */
const getTextTaskExplanation = (result: number): MathExplanation => {
  return {
    title: "📖 Teksta uzdevums",
    description: "Izlasi uzdevumu uzmanīgi un atrodi pareizo atbildi!",
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
    tip: "Izlasi vēlreiz un padomā, kas notiek uzdevumā!",
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
    title: "Saskaitīšana (+)",
    description: "Saskaitot mēs saliekam visu kopā! Iedomājies, ka tev ir āboli un tu dabū vēl.",
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
    tip: "Pamēģini saskaitīt visus ābolus!",
  };
};

const getSubtractionExplanation = (targetResult?: number): MathExplanation => {
  const left = 5;
  const right = 2;
  const result = left - right;

  return {
    title: "Atņemšana (-)",
    description: "Atņemot mēs kaut ko atdodam vai apēdam! Tev ir 5 banāni 🍌, bet 2 atdod draugam.",
    example: {
      left,
      right,
      operation: "-",
      result,
    },
    visualItems: {
      // First show all items, then show which ones are "going away"
      leftItems: ["🍌", "🍌", "🍌", "🍌", "🍌"],
      rightItems: ["🍌", "🍌"], // These will be shown as "taken away"
      operationSymbol: "-",
    },
    tip: "Saskaiti, cik banānu tev vēl paliek!",
  };
};

const getMultiplicationExplanation = (targetResult?: number): MathExplanation => {
  const left = 3;
  const right = 2;
  const result = left * right;

  return {
    title: "Reizināšana (×)",
    description: "Reizinot mēs ņemam vairākas grupas! Iedomājies, ka tev ir 3 maisiņi ar 2 cepumiem katrā.",
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
    tip: "Saskaiti visus cepumus no visiem maisiņiem!",
  };
};

const getDivisionExplanation = (targetResult?: number): MathExplanation => {
  const left = 6;
  const right = 2;
  const result = left / right;

  return {
    title: "Dalīšana (÷)",
    description: "Dalot mēs sadalām vienādi! Iedomājies, ka 6 picas šķēles jāsadala 2 draugiem.",
    example: {
      left,
      right,
      operation: "÷",
      result,
    },
    visualItems: {
      leftItems: ["🍕🍕🍕", "🍕🍕🍕"],
      rightItems: [],
      operationSymbol: "÷",
    },
    tip: "Cik šķēles katrs draugs dabūs?",
  };
};
