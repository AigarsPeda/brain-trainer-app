import { MainButton } from "@/components/MainButton";
import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { TextTaskType } from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useTaskLifecycle } from "@/hooks/useTaskLifecycle";
import { getButtonStateColor } from "@/utils/utils";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useRef, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";

interface TextTaskProps {
  level: string;
  task: TextTaskType;
  maxLevelStep: number;
  removedAnswerIds?: number[];
  isFinalTaskInLevel: boolean;
  showAsMultipleChoice?: boolean;
  getLevelCompletionDurationMs?: () => number;
}

export function TextTask({
  task,
  level,
  maxLevelStep,
  isFinalTaskInLevel,
  removedAnswerIds = [],
  showAsMultipleChoice = false,
  getLevelCompletionDurationMs,
}: TextTaskProps) {
  const colorScheme = useAppColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = Colors[isDarkMode ? "dark" : "light"];
  const iconShellBackground = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.32)";
  const iconShellBorder = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.22)";

  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  // Generate options once and store in a ref so removing an answer doesn't re-shuffle
  const shuffledOptionsRef = useRef<Array<{ id: number; value: number; isCorrect: boolean }> | null>(null);

  const allOptions = useMemo(() => {
    if (!showAsMultipleChoice) {
      return [];
    }

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
      while (wrongValues.has(fallback)) {
        fallback++;
      }
      wrongValues.add(fallback);
      return fallback;
    };

    const wrong1 = generateWrong(() => correctAnswer + Math.floor(Math.random() * 5) + 1);
    const wrong2 = generateWrong(() => correctAnswer - Math.floor(Math.random() * 5) - 1);
    const wrong3 = generateWrong(() => correctAnswer + Math.floor(Math.random() * 10) + 6);

    const options = [
      { id: 1, value: correctAnswer, isCorrect: true },
      { id: 2, value: wrong1, isCorrect: false },
      { id: 3, value: wrong2, isCorrect: false },
      { id: 4, value: wrong3, isCorrect: false },
    ];

    // Shuffle once and store
    shuffledOptionsRef.current = options.sort(() => Math.random() - 0.5);

    return shuffledOptionsRef.current;
  }, [showAsMultipleChoice, task.result]);

  // Filter removed answers without re-shuffling the order
  const multipleChoiceOptions = useMemo(() => {
    const source = shuffledOptionsRef.current ?? allOptions;
    return source.filter((opt) => !removedAnswerIds.includes(opt.id));
  }, [allOptions, removedAnswerIds]);

  const isAnswerCorrect = showAsMultipleChoice
    ? (multipleChoiceOptions.find((opt) => opt.id === selectedOptionId)?.isCorrect ?? false)
    : Number(userAnswer) === task.result;
  const hasAnswer = showAsMultipleChoice ? selectedOptionId !== null : userAnswer.trim().length > 0;

  const checkIfCorrect = useCallback((): boolean => {
    return isAnswerCorrect;
  }, [isAnswerCorrect]);

  const resetTaskState = useCallback(() => {
    setUserAnswer("");
    setSelectedOptionId(null);
  }, []);

  const {
    displayTaskResults,
    handleCheckAnswers: handleCheckFromHook,
    showResultsProps,
  } = useTaskLifecycle({
    level,
    maxLevelStep,
    isFinalTaskInLevel,
    taskNumberInLevel: task.taskNumberInLevel,
    checkIfCorrect,
    resetTaskState,
    getLevelCompletionDurationMs,
  });

  const handleCheckAnswer = useCallback(() => {
    if (!hasAnswer) {
      return;
    }

    Keyboard.dismiss();
    handleCheckFromHook();

    if (isAnswerCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [handleCheckFromHook, hasAnswer, isAnswerCorrect]);

  const getInputBorderColor = () => {
    if (!displayTaskResults) {
      return colors.border;
    }
    return isAnswerCorrect ? colors.correctAnswer : colors.incorrectAnswer;
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 125 : 0}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.taskContent}>
            <View style={styles.questionBlock}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconShell,
                    {
                      backgroundColor: iconShellBackground,
                      borderColor: iconShellBorder,
                    },
                  ]}
                >
                  <View style={styles.iconBadge}>
                    <Image source={task.icon} style={styles.icon} resizeMode="contain" />
                  </View>
                </View>
              </View>

              <View style={styles.questionContainer}>
                <ThemedText type="subtitle" style={styles.questionText}>
                  {task.question}
                </ThemedText>
              </View>
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
                      <ThemedText type="defaultSemiBold" style={styles.optionText}>
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
                  keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
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
        </ScrollView>
      </KeyboardAvoidingView>

      {displayTaskResults && <ShowResults isAllAnswersCorrect={isAnswerCorrect} {...showResultsProps} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  taskContent: {
    gap: 24,
    paddingTop: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  questionBlock: {
    width: "100%",
    gap: 18,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconShell: {
    width: 88,
    height: 88,
    borderWidth: 1,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 54,
    height: 54,
  },
  questionContainer: {
    width: "100%",
  },
  questionText: {
    fontSize: 24,
    lineHeight: 38,
    textAlign: "left",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
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
    width: "100%",
    rowGap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 30,
  },
  buttonContainer: {
    display: "flex",
    marginBottom: 26,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 20,
    elevation: 20,
  },
  buttonText: {
    fontSize: 20,
  },
});
