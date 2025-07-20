import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type {
  CreateMathTaskOptionType,
  LevelsEnum,
  MultiAnswerMathTaskType,
  TaskAnswerType,
  TaskOptionType,
} from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useRouter } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { ShowResults } from "../ShowResults";
import { MainButton } from "../MainButton";

interface MathTaskWithResultProps {
  level: LevelsEnum;
  // isLevelChecked: boolean;
  maxLevelStep: number;
  task: MultiAnswerMathTaskType;
}

export default function MathTaskWithResult({ level, task, maxLevelStep }: MathTaskWithResultProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const {
    dispatch,
    state: {
      results,
      availableLevels,
      game: { currentTaskInLevel },
    },
  } = useAppContext();

  const levelAnswer = results?.find((r) => r.level === level)?.tasks[currentTaskInLevel];
  const isTaskChecked = levelAnswer?.isTaskChecked || false;

  const getAnswersOfTask = (answers: TaskAnswerType[] | undefined, option: TaskOptionType) => {
    const foundTask = answers?.find((r) => r.optionId === option.id);
    return foundTask;
  };

  const getGradientColor = (option: TaskOptionType, answers: TaskAnswerType[] | undefined) => {
    const foundAnswer = getAnswersOfTask(answers, option);

    if (!foundAnswer) {
      return {
        background: isDarkMode ? ["#64748b", "#475569"] : ["#f1f5f9", "#e2e8f0"],
        shadow: isDarkMode ? ["#334155", "#1e293b"] : ["#cbd5e1", "#94a3b8"],
      };
    }

    if (foundAnswer.isCorrect && isTaskChecked) {
      return {
        background: isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"],
        shadow: isDarkMode ? ["#15803d", "#166534"] : ["#4ade80", "#22c55e"],
      };
    }

    if (!foundAnswer.isCorrect && isTaskChecked) {
      return {
        background: isDarkMode ? ["#ef4444", "#dc2626"] : ["#fecaca", "#fca5a5"],
        shadow: isDarkMode ? ["#b91c1c", "#991b1b"] : ["#f87171", "#ef4444"],
      };
    }

    // Default case - improved orange colors with better gradients
    return {
      background: isDarkMode ? ["#fb923c", "#f97316"] : ["#fed7aa", "#fdba74"],
      shadow: isDarkMode ? ["#ea580c", "#c2410c"] : ["#fb923c", "#f97316"],
    };
  };

  const setAnswer = (optionId: number, isCorrect: boolean) => {
    dispatch({
      type: "SET_RESULT_FOR_TASK",
      payload: {
        level,
        answer: {
          optionId,
          isCorrect,
        },
      },
    });
  };

  const goToNextLevel = () => {
    const currentLevel = Number(level);
    const nextLevel = currentLevel + 1;

    dispatch({
      type: "GET_NEXT_LEVEL",
      payload: {
        nextLevel,
      },
    });

    const isLastAvailableLevel = availableLevels === currentLevel;

    router.replace({
      pathname: isLastAvailableLevel ? "/" : "/game/[level]",
      params: { level: isLastAvailableLevel ? 1 : nextLevel },
    });
  };

  const getCountOfCorrectAnswersAndWrong = (options: TaskOptionType[] | CreateMathTaskOptionType[]) => {
    const currentTaskCorrectAnswers = options.filter((o) => o.isCorrect).length;
    const currentTaskWrongAnswers = options.filter((o) => !o.isCorrect).length;

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

  const getNextTaskInLevel = () => {
    dispatch({
      type: "GET_NEXT_TASK_IN_LEVEL",
    });
  };

  const { currentTaskCorrectAnswers } = getCountOfCorrectAnswersAndWrong(task?.options || []);
  const { levelAnswerWrongAnswers } = getCountOfLevelCorrectAnswersAndWrong(levelAnswer?.answers || []);

  const isAtLeastOneTaskAnswered = (levelAnswer?.answers?.length ?? 0) > 0;

  const isAllAnswersCorrect =
    currentTaskCorrectAnswers === levelAnswer?.answers.length && levelAnswerWrongAnswers === 0;

  return (
    <>
      <ThemedView
        style={{
          paddingVertical: 16,
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <ThemedView
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 6,
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
        </ThemedView>
        <ThemedView
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
        </ThemedView>
        <ThemedView style={styles.itemsWrap}>
          {task.options.map((option, i) => {
            const gradientColor = getGradientColor(option, levelAnswer?.answers);

            if (isDarkMode) {
              gradientColor.background.reverse();
              gradientColor.shadow.reverse();
            }

            return (
              <MathTaskButton
                gradientColor={gradientColor}
                key={`${option.id}-${i}`}
                // onPress={() => handlePress(option.id, option.isCorrect)}
                onPress={() => setAnswer(option.id, option.isCorrect)}
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
        </ThemedView>
      </ThemedView>
      {!isTaskChecked && (
        <ThemedView
          style={{
            display: "flex",
            marginBottom: 26,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainButton
            onPress={() => {
              if (!isTaskChecked) {
                dispatch({
                  type: "CHECK_ANSWERS",
                  payload: {
                    level,
                    currentTaskNumber: currentTaskInLevel,
                  },
                });

                return;
              }

              if (isTaskChecked && maxLevelStep === currentTaskInLevel) {
                goToNextLevel();
                return;
              }

              getNextTaskInLevel();
            }}
            disabled={!isAtLeastOneTaskAnswered}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 20,
              }}
            >
              {isTaskChecked ? "Nākamais uzdevums" : "Pārbaudīt"}
            </ThemedText>
          </MainButton>
        </ThemedView>
      )}
      {isTaskChecked && <ShowResults isAllAnswersCorrect={isAllAnswersCorrect} onNextTaskPress={goToNextLevel} />}
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
