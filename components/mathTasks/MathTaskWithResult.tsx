import { MainButton } from "@/components/MainButton";
import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import type {
  MultiAnswerMathTaskType,
  TaskAnswerType,
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
  level: string;
  maxLevelStep: number;
  isFinalTaskInLevel: boolean;
  task: MultiAnswerMathTaskType;
  removedAnswerIds?: number[];
}

export default function MathTaskWithResult({ level, task, maxLevelStep, isFinalTaskInLevel, removedAnswerIds = [] }: MathTaskWithResultProps) {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";

  const {
    dispatch,
    state: { availableLevels, lives },
  } = useAppContext();

  const router = useRouter();
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();

  const [answers, setAnswer] = useState<TaskAnswerType[]>([]);
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const [hasAppliedLifePenalty, setHasAppliedLifePenalty] = useState(false);
  const hasAppliedLifePenaltyRef = useRef(false);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const checkIfAllAnswersCorrect = (): boolean => {
    const totalCorrectOptions = task.options.filter((o) => isEquationCorrect(o.equation, task.result)).length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = answers.filter((a) => !a.isCorrect).length;

    return totalCorrectOptions === correctAnswers && wrongAnswers === 0;
  };

  const finalizeTaskProgress = () => {
    const isCorrect = checkIfAllAnswersCorrect();

    dispatch({
      type: "GET_NEXT_TASK",
      payload: {
        isCorrect,
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

  const isAtLeastOneTaskAnswered = (answers?.length ?? 0) > 0;
  const isAllAnswersCorrect = checkIfAllAnswersCorrect();

  const handleCheckAnswers = () => {
    // Use ref for synchronous check to prevent double life loss on rapid taps
    if (hasAppliedLifePenaltyRef.current) {
      setDisplayTaskResults(true);
      return;
    }

    const isCorrect = checkIfAllAnswersCorrect();

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
          {task.options
            .filter((option) => !removedAnswerIds.includes(option.id))
            .map((option, i) => {
              const gradientColor = getGradientColor(option, answers, isDarkMode, displayTaskResults);

              // Create a new object with reversed arrays for dark mode
              const finalGradientColor = isDarkMode
                ? {
                    background: [...gradientColor.background].reverse(),
                    shadow: [...gradientColor.shadow].reverse(),
                  }
                : gradientColor;

              return (
                <MathTaskButton
                  key={`${option.id}-${i}`}
                  gradientColor={finalGradientColor}
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
            showAdForReward(
              () => {
                // Called when user earns reward
                dispatch({ type: "RESTORE_LIFE_FROM_AD" });
                // Reset task - free retry after watching ad
                setAnswer([]);
                setHasAppliedLifePenalty(false);
                hasAppliedLifePenaltyRef.current = false;
              },
              () => {
                // Called when ad closes (regardless of reward)
                setDisplayTaskResults(false);
              }
            );
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
