import { MainButton } from "@/components/MainButton";
import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { TextTaskType } from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { createLevelNavigationHandlers } from "@/utils/levelNavigation";
import { getButtonStateColor } from "@/utils/utils";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";

interface TextTaskProps {
  level: string;
  task: TextTaskType;
  maxLevelStep: number;
  removedAnswerIds?: number[];
  isFinalTaskInLevel: boolean;
  showAsMultipleChoice?: boolean;
}

export function TextTask({
  task,
  level,
  maxLevelStep,
  isFinalTaskInLevel,
  removedAnswerIds = [],
  showAsMultipleChoice = false,
}: TextTaskProps) {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = Colors[isDarkMode ? "dark" : "light"];

  const {
    dispatch,
    state: { availableLevels, lives },
  } = useAppContext();

  const router = useRouter();
  const { loaded: adLoaded, showAdForReward } = useGoogleAd();

  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [displayTaskResults, setDisplayTaskResults] = useState(false);
  const hasAppliedLifePenaltyRef = useRef(false);

  const levelNumber = Number(level);
  const hasNextLevel = levelNumber < availableLevels;

  const allOptions = useMemo(() => {
    if (!showAsMultipleChoice) return [];

    const correctAnswer = task.result;
    const wrongValues = new Set<number>();

    const generateWrong = (generator: () => number): number => {
      for (let i = 0; i < 10; i++) {
        const value = generator();
        if (value >= 0 && value !== correctAnswer && !wrongValues.has(value)) {
          wrongValues.add(value);
          return value;
        }
      }
      let fallback = correctAnswer + wrongValues.size + 1;
      while (wrongValues.has(fallback)) fallback++;
      wrongValues.add(fallback);
      return fallback;
    };

    const wrong1 = generateWrong(() => correctAnswer + Math.floor(Math.random() * 5) + 1);
    const wrong2 = generateWrong(() => correctAnswer - Math.floor(Math.random() * 5) - 1);
    const wrong3 = generateWrong(() => correctAnswer + Math.floor(Math.random() * 10) + 6);

    return [
      { id: 1, value: correctAnswer, isCorrect: true },
      { id: 2, value: wrong1, isCorrect: false },
      { id: 3, value: wrong2, isCorrect: false },
      { id: 4, value: wrong3, isCorrect: false },
    ];
  }, [showAsMultipleChoice, task.result]);

  // Filter and shuffle separately so removing an answer doesn't regenerate all values
  const multipleChoiceOptions = useMemo(() => {
    return allOptions.filter((opt) => !removedAnswerIds.includes(opt.id)).sort(() => Math.random() - 0.5);
  }, [allOptions, removedAnswerIds]);

  const isAnswerCorrect = showAsMultipleChoice
    ? (multipleChoiceOptions.find((opt) => opt.id === selectedOptionId)?.isCorrect ?? false)
    : Number(userAnswer) === task.result;
  const hasAnswer = showAsMultipleChoice ? selectedOptionId !== null : userAnswer.trim().length > 0;

  const finalizeTaskProgress = () => {
    dispatch({
      type: "GET_NEXT_TASK",
      payload: {
        isCorrect: isAnswerCorrect,
        maxLevelStep,
      },
    });

    setUserAnswer("");
    setSelectedOptionId(null);
    setDisplayTaskResults(false);
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

    if (hasAppliedLifePenaltyRef.current) {
      setDisplayTaskResults(true);
      return;
    }

    if (!isAnswerCorrect) {
      hasAppliedLifePenaltyRef.current = true;
      dispatch({ type: "LOSE_LIFE" });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setDisplayTaskResults(true);
  };

  const handleTryAgain = () => {
    setUserAnswer("");
    setSelectedOptionId(null);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 125 : 0}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <View style={styles.iconContainer}>
              <Image source={task.icon} style={styles.icon} resizeMode="contain" />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText type="subtitle" style={styles.questionText}>
                {task.question}
              </ThemedText>
            </View>

            {showAsMultipleChoice ? (
              <View style={styles.multipleChoiceContainer}>
                {multipleChoiceOptions.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const showResult = displayTaskResults;
                  const isCorrectOption = option.isCorrect;

                  const gradientColor = getButtonStateColor(isSelected, isCorrectOption, showResult, isDarkMode);

                  return (
                    <MathTaskButton
                      key={option.id}
                      gradientColor={gradientColor}
                      onPress={() => {
                        if (!displayTaskResults) {
                          setSelectedOptionId(isSelected ? null : option.id);
                        }
                      }}
                    >
                      <ThemedText type="defaultSemiBold" style={{ fontSize: 30 }}>
                        {option.value}
                      </ThemedText>
                    </MathTaskButton>
                  );
                })}
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: getInputBorderColor(),
                      backgroundColor: colors.inputBackground,
                    },
                  ]}
                  maxLength={10}
                  placeholder="?"
                  autoFocus={true}
                  keyboardType="numeric"
                  editable={!displayTaskResults}
                  placeholderTextColor={colors.placeholder}
                  onSubmitEditing={hasAnswer ? handleCheckAnswer : undefined}
                />
              </View>
            )}
          </View>

          {!displayTaskResults && (
            <View style={styles.buttonContainer}>
              <MainButton disabled={!hasAnswer} onPress={handleCheckAnswer}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Pārbaudīt
                </ThemedText>
              </MainButton>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {displayTaskResults && (
        <ShowResults
          lives={lives}
          adLoaded={adLoaded}
          onGoHomePress={handleGoHome}
          onNextTaskPress={goToNextTask}
          onTryAgainPress={handleTryAgain}
          isAllAnswersCorrect={isAnswerCorrect}
          onWatchAdPress={() => {
            showAdForReward(
              () => {
                dispatch({ type: "RESTORE_LIFE_FROM_AD" });
                setUserAnswer("");
                setSelectedOptionId(null);
                hasAppliedLifePenaltyRef.current = false;
              },
              () => {
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
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginTop: 20,
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
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: 150,
    height: 80,
    fontSize: 40,
    borderWidth: 3,
    borderRadius: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  multipleChoiceContainer: {
    rowGap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
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
