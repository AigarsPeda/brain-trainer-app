import { TaskAnswerType } from "@/context/app.context.reducer";

export const calculateStars = (taskResults: TaskAnswerType[]): number => {
  const correctAnswersCount = taskResults.filter(
    (answer) => answer.isCorrect
  ).length;

  const totalAnswersCount = taskResults.length;

  if (totalAnswersCount === 0) return 0;

  const correctPercentage = (correctAnswersCount / totalAnswersCount) * 100;

  if (correctPercentage === 100) {
    return 5;
  }

  if (correctPercentage >= 75) {
    return 4;
  }

  if (correctPercentage >= 50) {
    return 3;
  }

  if (correctPercentage >= 25) {
    return 2;
  }

  return 0;
};
