import { ALL_TASKS, LevelsEnum, MathOperation } from "@/context/app.context.reducer";

export const getLevelTaskData = (level: LevelsEnum, currentTaskInLevel: number) => {
  const levelTasks = ALL_TASKS[level];
  const currentTask = levelTasks?.find((t) => t.taskNumberInLevel === currentTaskInLevel);
  const maxLevelStep = levelTasks?.length || 0;
  return { levelTasks, currentTask, maxLevelStep };
};

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
  return isCorrect;
};
