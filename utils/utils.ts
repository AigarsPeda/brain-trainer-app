import { TaskButtonStateColors } from "@/constants/Colors";
import { MAX_LIVES, LIFE_RESTORE_INTERVAL_MS } from "@/constants/GameSettings";
import { TaskAnswerType, TaskOptionType } from "@/context/app.context.reducer";

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
  const theme = isDarkMode ? "dark" : "light";

  if (!foundAnswer) {
    return TaskButtonStateColors[theme].unselected;
  }

  if (foundAnswer.isCorrect && displayTaskResults) {
    return TaskButtonStateColors[theme].correct;
  }

  if (!foundAnswer.isCorrect && displayTaskResults) {
    return TaskButtonStateColors[theme].incorrect;
  }

  return TaskButtonStateColors[theme].selected;
};

// Generic helper for getting button colors based on selection state
export const getButtonStateColor = (
  isSelected: boolean,
  isCorrect: boolean,
  showResult: boolean,
  isDarkMode: boolean
) => {
  const theme = isDarkMode ? "dark" : "light";

  if (!isSelected) {
    return TaskButtonStateColors[theme].unselected;
  }

  if (isSelected && showResult && isCorrect) {
    return TaskButtonStateColors[theme].correct;
  }

  if (isSelected && showResult && !isCorrect) {
    return TaskButtonStateColors[theme].incorrect;
  }

  return TaskButtonStateColors[theme].selected;
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

export const updateDaysInARow = (
  lastPlayedDate: string | null,
  currentDaysInARow: number
): { daysInARow: number; lastPlayedDate: string } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split("T")[0];

  if (lastPlayedDate === todayString) {
    const fixedDaysInARow = currentDaysInARow === 0 ? 1 : currentDaysInARow;
    return { daysInARow: fixedDaysInARow, lastPlayedDate: todayString };
  }

  if (!lastPlayedDate) {
    return { daysInARow: 1, lastPlayedDate: todayString };
  }

  const lastPlayed = new Date(lastPlayedDate);
  lastPlayed.setHours(0, 0, 0, 0);
  const diffInMs = today.getTime() - lastPlayed.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 1) {
    return { daysInARow: currentDaysInARow + 1, lastPlayedDate: todayString };
  }

  return { daysInARow: 1, lastPlayedDate: todayString };
};

export const calculateRestoredLives = (
  currentLives: number,
  lastLifeLostAt: number | null
): { lives: number; newLastLifeLostAt: number | null } => {
  if (lastLifeLostAt === null || currentLives >= MAX_LIVES) {
    return { lives: currentLives, newLastLifeLostAt: null };
  }

  const elapsed = Date.now() - lastLifeLostAt;
  const livesToRestore = Math.floor(elapsed / LIFE_RESTORE_INTERVAL_MS);

  if (livesToRestore <= 0) {
    return { lives: currentLives, newLastLifeLostAt: lastLifeLostAt };
  }

  const newLives = Math.min(MAX_LIVES, currentLives + livesToRestore);

  if (newLives >= MAX_LIVES) {
    return { lives: newLives, newLastLifeLostAt: null };
  }

  // Otherwise, update timestamp to account for partial intervals
  const remainingTime = elapsed % LIFE_RESTORE_INTERVAL_MS;
  const newLastLifeLostAt = Date.now() - remainingTime;

  return { lives: newLives, newLastLifeLostAt };
};
