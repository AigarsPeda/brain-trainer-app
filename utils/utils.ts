import { TaskAnswerType, TaskOptionType } from "@/context/app.context.reducer";

// export const calculateStars = (taskResults: number, usedStars: number): number => {
//   if (taskResults === 0) {
//     return 0;
//   }

//   const stars = Math.floor(taskResults / usedStars);

//   return Math.max(0, Math.min(stars, 3));
// };

export const getAnswersOfTask = (answers: TaskAnswerType[] | undefined, option: TaskOptionType) => {
  const foundTask = answers?.find((r) => r.optionId === option.id);
  return foundTask;
};

// Evaluate a simple binary equation like "4 + 4" or "10 - 2" or with ×/÷. Returns null if invalid.
export const evaluateEquation = (equation: string): number | null => {
  if (!equation) return null;

  const normalized = equation.replace(/×/g, "*").replace(/÷/g, "/").trim();
  const match = normalized.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);

  if (!match) return null;

  const [, aStr, op, bStr] = match;
  const a = Number(aStr);
  const b = Number(bStr);

  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? null : a / b;
    default:
      return null;
  }
};

export const isEquationCorrect = (equation: string, expectedResult: number): boolean => {
  const value = evaluateEquation(equation);
  return value !== null && value === expectedResult;
};

export const getGradientColor = (
  option: TaskOptionType,
  answers: TaskAnswerType[] | undefined,
  isDarkMode: boolean,
  displayTaskResults: boolean
) => {
  const foundAnswer = getAnswersOfTask(answers, option);

  if (!foundAnswer) {
    return {
      background: isDarkMode ? ["#64748b", "#475569"] : ["#f1f5f9", "#e2e8f0"],
      shadow: isDarkMode ? ["#334155", "#1e293b"] : ["#cbd5e1", "#94a3b8"],
    };
  }

  if (foundAnswer.isCorrect && displayTaskResults) {
    return {
      background: isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"],
      shadow: isDarkMode ? ["#15803d", "#166534"] : ["#4ade80", "#22c55e"],
    };
  }

  if (!foundAnswer.isCorrect && displayTaskResults) {
    return {
      background: isDarkMode ? ["#ef4444", "#dc2626"] : ["#fecaca", "#fca5a5"],
      shadow: isDarkMode ? ["#b91c1c", "#991b1b"] : ["#f87171", "#ef4444"],
    };
  }

  return {
    background: isDarkMode ? ["#fb923c", "#f97316"] : ["#fed7aa", "#fdba74"],
    shadow: isDarkMode ? ["#ea580c", "#c2410c"] : ["#fb923c", "#f97316"],
  };
};
