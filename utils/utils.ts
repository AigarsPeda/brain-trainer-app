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

export const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex = (x: string) => parseInt(x, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const calculateTaskCorrectnessPercentage = (
  isCorrect: boolean,
  attemptCount: number,
  maxLevelStep: number
): number => {
  if (!isCorrect || maxLevelStep <= 0) {
    return 0;
  }

  let taskPercentage = 100;

  if (attemptCount === 2) {
    taskPercentage = 30;
  } else if (attemptCount === 3) {
    taskPercentage = 15;
  } else if (attemptCount === 4) {
    taskPercentage = 5;
  } else if (attemptCount >= 5) {
    taskPercentage = 0;
  }

  const weightedPercentage = taskPercentage / maxLevelStep;

  return parseFloat(weightedPercentage.toFixed(2));
};
