import { MainButton } from "@/components/MainButton";
import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ShowResults } from "@/components/ShowResults";
import { ThemedText } from "@/components/ThemedText";
import type {
  MultiAnswerMathTaskType,
  TaskAnswerType,
} from "@/context/app.context.reducer";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useTaskLifecycle } from "@/hooks/useTaskLifecycle";
import { getAnswersOfTask, getGradientColor, isEquationCorrect } from "@/utils/utils";
import { useCallback, useState } from "react";
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

  const [answers, setAnswer] = useState<TaskAnswerType[]>([]);

  const checkIfCorrect = useCallback((): boolean => {
    const totalCorrectOptions = task.options.filter((o) => isEquationCorrect(o.equation, task.result)).length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = answers.filter((a) => !a.isCorrect).length;
    return totalCorrectOptions === correctAnswers && wrongAnswers === 0;
  }, [task.options, task.result, answers]);

  const resetTaskState = useCallback(() => {
    setAnswer([]);
  }, []);

  const {
    displayTaskResults,
    handleCheckAnswers,
    showResultsProps,
  } = useTaskLifecycle({
    level,
    maxLevelStep,
    isFinalTaskInLevel,
    checkIfCorrect,
    resetTaskState,
  });

  const isAtLeastOneTaskAnswered = (answers?.length ?? 0) > 0;
  const isAllAnswersCorrect = checkIfCorrect();

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
              Pārbaudīt
            </ThemedText>
          </MainButton>
        </View>
      ) : (
        <ShowResults
          isAllAnswersCorrect={isAllAnswersCorrect}
          {...showResultsProps}
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
