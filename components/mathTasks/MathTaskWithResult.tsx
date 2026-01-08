import { MainButton } from "@/components/MainButton";
import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import type {
  CreateMathTaskOptionType,
  LevelsEnum,
  MultiAnswerMathTaskType,
  TaskAnswerType,
  TaskOptionType,
} from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import { getAnswersOfTask, getGradientColor, isEquationCorrect } from "@/utils/utils";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

interface MathTaskWithResultProps {
  level: LevelsEnum;
  maxLevelStep: number;
  isFinalTaskInLevel: boolean;
  task: MultiAnswerMathTaskType;
}

export default function MathTaskWithResult({ level, task, maxLevelStep, isFinalTaskInLevel }: MathTaskWithResultProps) {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";

  const {
    dispatch,
    state: { availableLevels, lives, currentTaskAttemptCount },
  } = useAppContext();

  const router = useRouter();
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();

  const [answers, setAnswer] = useState<TaskAnswerType[]>([]);
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const [hasAppliedLifePenalty, setHasAppliedLifePenalty] = useState(false);
  const hasAppliedLifePenaltyRef = useRef(false);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const calculatePercentageInTask = (
    answers: TaskAnswerType[],
    options: TaskOptionType[],
    maxLevelStep: number,
    attempts: number
  ): number => {
    const totalCorrectOptions = options.filter((o) => isEquationCorrect(o.equation, task.result)).length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;

    if (totalCorrectOptions === 0) {
      return 0;
    }

    // Calculate base percentage
    let taskPercentage = (correctAnswers / totalCorrectOptions) * 100;

    // Apply penalty for multiple attempts (reduce by 20% per additional attempt, minimum 0%)
    if (attempts > 1) {
      const penalty = (attempts - 1) * 20;
      taskPercentage = Math.max(0, taskPercentage - penalty);
    }

    const weightedPercentage = taskPercentage / maxLevelStep;

    return parseFloat(weightedPercentage.toFixed(2));
  };

  const finalizeTaskProgress = () => {
    const correctnessPercentage = calculatePercentageInTask(answers, task.options, maxLevelStep, currentTaskAttemptCount);

    dispatch({
      type: "GET_NEXT_TASK",
      payload: {
        correctnessPercentage,
        maxLevelStep,
      },
    });

    setAnswer([]);
    setDisplayTaskResults(false);
    setHasAppliedLifePenalty(false);
    hasAppliedLifePenaltyRef.current = false;
  };

  const nextLevelValue = (levelNumber + 1).toString();

  const { goToNextTask, handleGoHome, handleNextLevel } = createLevelNavigationHandlers({
    isFinalTaskInLevel,
    hasNextLevel,
    finalizeTaskProgress,
    router,
    nextLevelValue,
  });

  const getCountOfCorrectAnswersAndWrong = (options: TaskOptionType[] | CreateMathTaskOptionType[]) => {
    const currentTaskCorrectAnswers = (options as TaskOptionType[]).filter((o) =>
      "equation" in o ? isEquationCorrect(o.equation, task.result) : false
    ).length;
    const currentTaskWrongAnswers = (options as TaskOptionType[]).filter((o) =>
      "equation" in o ? !isEquationCorrect(o.equation, task.result) : false
    ).length;

    return {
      currentTaskWrongAnswers,
      currentTaskCorrectAnswers,
    };
  };

  const getCountOfLevelCorrectAnswersAndWrong = (answers: TaskAnswerType[]) => {
    const levelAnswerCorrectAnswers = answers.filter((o) => o.isCorrect).length;
    const levelAnswerWrongAnswers = answers.filter((o) => !o.isCorrect).length;

    return {
      levelAnswerWrongAnswers,
      levelAnswerCorrectAnswers,
    };
  };

  const { currentTaskCorrectAnswers } = getCountOfCorrectAnswersAndWrong(task?.options || []);
  const { levelAnswerWrongAnswers } = getCountOfLevelCorrectAnswersAndWrong(answers);

  const isAtLeastOneTaskAnswered = (answers?.length ?? 0) > 0;
  const isAllAnswersCorrect = currentTaskCorrectAnswers === answers.length && levelAnswerWrongAnswers === 0;

  const handleCheckAnswers = () => {
    // Use ref for synchronous check to prevent double life loss on rapid taps
    if (hasAppliedLifePenaltyRef.current) {
      setDisplayTaskResults(true);
      return;
    }

    const isCorrect = currentTaskCorrectAnswers === answers.length && levelAnswerWrongAnswers === 0;

    if (!isCorrect) {
      hasAppliedLifePenaltyRef.current = true;
      dispatch({ type: "LOSE_LIFE" }); // This will increment currentTaskAttemptCount in the reducer
      setHasAppliedLifePenalty(true);
    }

    setDisplayTaskResults(true);
  };

  const handleTryAgain = () => {
    setAnswer([]);
    setDisplayTaskResults(false);
    hasAppliedLifePenaltyRef.current = false;
  };

  return (
    <>
      <View
        style={{
          paddingVertical: 16,
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            gap: 6,
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ThemedText type="subtitle">Izvēlies</ThemedText>
          <ThemedText
            type="subtitle"
            style={{
              color: "#D81E5B",
            }}
          >
            visas
          </ThemedText>
          <ThemedText type="subtitle">pareizās atbildes</ThemedText>
        </View>
        <View
          style={{
            paddingTop: 10,
            display: "flex",
            paddingBottom: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText
            type="title"
            style={{
              fontSize: 60,
            }}
          >
            {task.result}
          </ThemedText>
        </View>
        <View style={styles.itemsWrap}>
          {task.options.map((option, i) => {
            const gradientColor = getGradientColor(option, answers, isDarkMode, displayTaskResults);

            if (isDarkMode) {
              gradientColor.background.reverse();
              gradientColor.shadow.reverse();
            }

            return (
              <MathTaskButton
                key={`${option.id}-${i}`}
                gradientColor={gradientColor}
                onPress={() => {
                  const foundAnswer = getAnswersOfTask(answers, option);

                  if (foundAnswer) {
                    setAnswer((prev) => prev.filter((a) => a.optionId !== option.id));
                  } else {
                    const isCorrect = isEquationCorrect(option.equation, task.result);
                    setAnswer((prev) => [...prev, { optionId: option.id, isCorrect }]);
                  }
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: 30,
                  }}
                >
                  {option.equation}
                </ThemedText>
              </MathTaskButton>
            );
          })}
        </View>
      </View>
      {!displayTaskResults ? (
        <View
          style={{
            display: "flex",
            marginBottom: 26,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainButton disabled={!isAtLeastOneTaskAnswered} onPress={handleCheckAnswers}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 20,
              }}
            >
              {displayTaskResults ? "Nākamais uzdevums" : "Pārbaudīt"}
            </ThemedText>
          </MainButton>
        </View>
      ) : (
        <ShowResults
          lives={lives}
          adLoaded={adLoaded}
          onGoHomePress={handleGoHome}
          onNextTaskPress={goToNextTask}
          onTryAgainPress={handleTryAgain}
          isAllAnswersCorrect={isAllAnswersCorrect}
          onWatchAdPress={() => {
            showAdForReward(() => {
              dispatch({ type: "RESTORE_LIFE_FROM_AD" });
              // Reset task and close modal - free retry after watching ad
              setAnswer([]);
              setDisplayTaskResults(false);
              setHasAppliedLifePenalty(false);
              hasAppliedLifePenaltyRef.current = false;
            });
          }}
          levelCompletionState={
            isFinalTaskInLevel
              ? {
                  hasNextLevel,
                  isCompleted: true,
                  onGoHomePress: handleGoHome,
                  onNextLevelPress: handleNextLevel,
                }
              : undefined
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  itemsWrap: {
    rowGap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
