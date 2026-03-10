import { MathTypeType, TaskResultType, TaskType } from "@/context/app.context.reducer";

type TaskFeedbackEntry = {
  taskType: MathTypeType;
  taskNumber: string;
  correctnessPercentage: number;
};

export type WeakTaskTypeSummary = {
  averageScore: number;
  label: string;
  taskType: MathTypeType;
};

export type LevelFeedbackSummary = {
  accuracy: number;
  bestStreak: number;
  completionTimeMs: number;
  weakTaskTypes: WeakTaskTypeSummary[];
  recommendedNextStep: string;
};

const TASK_TYPE_LABELS: Record<MathTypeType, string> = {
  mathTaskWithResult: "Atbilžu izvēle",
  createMathTask: "Vienādojumu veidošana",
  textTask: "Teksta uzdevumi",
};

const TASK_TYPE_RECOMMENDATIONS: Record<MathTypeType, string> = {
  mathTaskWithResult: "Nākamajā līmenī pievērs uzmanību visām pareizajām atbildēm, ne tikai pirmajai.",
  createMathTask: "Nākamreiz trenē vienādojuma salikšanu lēnāk un pārbaudi abas puses pirms apstiprināšanas.",
  textTask: "Nākamajā līmenī vispirms nosaki, vai stāsts prasa saskaitīt vai atņemt, un tikai tad rēķini.",
};

const getTaskScore = (correctnessPercentage: number, maxLevelStep: number) => {
  return Math.max(0, Math.min(100, Math.round(correctnessPercentage * maxLevelStep)));
};

const getWeakTaskTypes = (entries: TaskFeedbackEntry[], maxLevelStep: number): WeakTaskTypeSummary[] => {
  const grouped = new Map<MathTypeType, number[]>();

  entries.forEach((entry) => {
    const scores = grouped.get(entry.taskType) ?? [];
    scores.push(getTaskScore(entry.correctnessPercentage, maxLevelStep));
    grouped.set(entry.taskType, scores);
  });

  return Array.from(grouped.entries())
    .map(([taskType, scores]) => ({
      taskType,
      label: TASK_TYPE_LABELS[taskType],
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    }))
    .sort((left, right) => left.averageScore - right.averageScore)
    .slice(0, 2);
};

const getBestFirstTryStreak = (entries: TaskFeedbackEntry[], maxLevelStep: number) => {
  const sortedEntries = [...entries].sort((left, right) => Number(left.taskNumber) - Number(right.taskNumber));
  let bestStreak = 0;
  let currentStreak = 0;

  sortedEntries.forEach((entry) => {
    const score = getTaskScore(entry.correctnessPercentage, maxLevelStep);

    if (score === 100) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
      return;
    }

    currentStreak = 0;
  });

  return bestStreak;
};

const getRecommendedNextStep = (weakTaskTypes: WeakTaskTypeSummary[], accuracy: number) => {
  const weakestTaskType = weakTaskTypes[0];

  if (weakestTaskType && weakestTaskType.averageScore < 85) {
    return TASK_TYPE_RECOMMENDATIONS[weakestTaskType.taskType];
  }

  if (accuracy === 100) {
    return "Ideāls līmenis. Mēģini nākamo pabeigt bez palīdzības un nezaudējot nevienu dzīvību.";
  }

  return "Rezultāts ir stabils. Mēģini nākamajā līmenī noturēt garāku pirmā mēģinājuma sēriju.";
};

export const formatCompletionTime = (completionTimeMs: number): string => {
  const totalSeconds = Math.max(1, Math.round(completionTimeMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds.toString().padStart(2, "0")} sek`;
  }

  return `${seconds} sek`;
};

export const buildLevelFeedbackSummary = (
  entries: TaskFeedbackEntry[],
  maxLevelStep: number,
  completionTimeMs: number
): LevelFeedbackSummary => {
  const accuracy = Math.round(entries.reduce((sum, entry) => sum + entry.correctnessPercentage, 0));
  const weakTaskTypes = getWeakTaskTypes(entries, maxLevelStep);

  return {
    accuracy,
    completionTimeMs,
    weakTaskTypes,
    bestStreak: getBestFirstTryStreak(entries, maxLevelStep),
    recommendedNextStep: getRecommendedNextStep(weakTaskTypes, accuracy),
  };
};

export const buildTaskFeedbackEntries = (
  levelTasks: TaskType[],
  taskResults: TaskResultType[]
): TaskFeedbackEntry[] => {
  return taskResults
    .map((taskResult) => {
      const task = levelTasks.find((levelTask) => levelTask.taskNumberInLevel.toString() === taskResult.taskNumber);

      if (!task) {
        return null;
      }

      return {
        taskType: task.taskType,
        taskNumber: taskResult.taskNumber,
        correctnessPercentage: taskResult.correctnessPercentage,
      };
    })
    .filter((entry): entry is TaskFeedbackEntry => entry !== null);
};
