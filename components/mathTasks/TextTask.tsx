import { MainButton } from "@/components/MainButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { LevelsEnum, TextTaskType } from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, Keyboard, StyleSheet, TextInput, View } from "react-native";

interface TextTaskProps {
  level: LevelsEnum;
  maxLevelStep: number;
  task: TextTaskType;
  isFinalTaskInLevel: boolean;
}

export function TextTask({ level, task, maxLevelStep, isFinalTaskInLevel }: TextTaskProps) {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = Colors[isDarkMode ? "dark" : "light"];

  const {
    dispatch,
    state: { availableLevels, lives, currentTaskAttemptCount },
  } = useAppContext();

  const router = useRouter();
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();

  const [userAnswer, setUserAnswer] = useState("");
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const [hasAppliedLifePenalty, setHasAppliedLifePenalty] = useState(false);
  const hasAppliedLifePenaltyRef = useRef(false);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const isAnswerCorrect = Number(userAnswer) === task.result;
  const hasAnswer = userAnswer.trim().length > 0;

  const calculatePercentageInTask = (): number => {
    let taskPercentage = isAnswerCorrect ? 100 : 0;

    // Apply penalty for multiple attempts (reduce by 20% per additional attempt, minimum 0%)
    if (taskPercentage > 0 && currentTaskAttemptCount > 1) {
      const penalty = (currentTaskAttemptCount - 1) * 20;
      taskPercentage = Math.max(0, taskPercentage - penalty);
    }

    const weightedPercentage = taskPercentage / maxLevelStep;

    return parseFloat(weightedPercentage.toFixed(2));
  };

  const finalizeTaskProgress = () => {
    const correctnessPercentage = calculatePercentageInTask();

    dispatch({
      type: "GET_NEXT_TASK",
      payload: {
        correctnessPercentage,
        maxLevelStep,
      },
    });

    setUserAnswer("");
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

  const handleCheckAnswer = () => {
    Keyboard.dismiss();

    // Use ref for synchronous check to prevent double life loss on rapid taps
    if (hasAppliedLifePenaltyRef.current) {
      setDisplayTaskResults(true);
      return;
    }

    if (!isAnswerCorrect) {
      hasAppliedLifePenaltyRef.current = true;
      dispatch({ type: "LOSE_LIFE" });
      setHasAppliedLifePenalty(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setDisplayTaskResults(true);
  };

  const handleTryAgain = () => {
    setUserAnswer("");
    setDisplayTaskResults(false);
    hasAppliedLifePenaltyRef.current = false;
  };

  const getInputBorderColor = () => {
    if (!displayTaskResults) {
      return colors.border;
    }
    return isAnswerCorrect ? colors.correctAnswer : colors.incorrectAnswer;
  };

  return (
    <>
      <View style={styles.contentContainer}>
        {/* Icon display */}
        <View style={styles.iconContainer}>
          <Image source={task.icon} style={styles.icon} resizeMode="contain" />
        </View>

        {/* Question text */}
        <View style={styles.questionContainer}>
          <ThemedText type="subtitle" style={styles.questionText}>
            {task.question}
          </ThemedText>
        </View>

        {/* Answer input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={userAnswer}
            onChangeText={setUserAnswer}
            style={[
              styles.input,
              {
                borderColor: getInputBorderColor(),
                backgroundColor: colors.inputBackground,
                color: colors.text,
              },
            ]}
            keyboardType="numeric"
            placeholder="?"
            placeholderTextColor={colors.placeholder}
            maxLength={10}
            editable={!displayTaskResults}
            onSubmitEditing={hasAnswer ? handleCheckAnswer : undefined}
            returnKeyType="done"
          />
        </View>

        {/* Show correct answer when wrong */}
        {displayTaskResults && !isAnswerCorrect && (
          <View style={styles.correctAnswerContainer}>
            <ThemedText style={styles.correctAnswerLabel}>Pareizā atbilde:</ThemedText>
            <ThemedText style={[styles.correctAnswerValue, { color: colors.correctAnswer }]}>{task.result}</ThemedText>
          </View>
        )}
      </View>

      {!displayTaskResults ? (
        <View style={styles.buttonContainer}>
          <MainButton disabled={!hasAnswer} onPress={handleCheckAnswer}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Pārbaudīt
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
          isAllAnswersCorrect={isAnswerCorrect}
          onWatchAdPress={() => {
            showAdForReward(() => {
              dispatch({ type: "RESTORE_LIFE_FROM_AD" });
              // Reset task and close modal - free retry after watching ad
              setUserAnswer("");
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
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 100,
    height: 100,
  },
  questionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  questionText: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 32,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: 150,
    height: 80,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 16,
    borderWidth: 3,
  },
  correctAnswerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  correctAnswerLabel: {
    fontSize: 18,
  },
  correctAnswerValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    marginBottom: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
  },
});
