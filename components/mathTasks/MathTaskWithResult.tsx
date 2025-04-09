import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { MultiAnswerMathTaskType, TaskAnswerType, TaskOptionType } from "@/context/app.context.reducer";
import { StyleSheet, useColorScheme } from "react-native";

interface MathTaskWithResultProps {
  isLevelChecked: boolean;
  answers: TaskAnswerType[] | undefined;
  task: MultiAnswerMathTaskType;
  handlePress: (optionId: number, isCorrect: boolean) => void;
}

export default function MathTaskWithResult({ task, answers, handlePress, isLevelChecked }: MathTaskWithResultProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const getAnswersOfTask = (answers: TaskAnswerType[] | undefined, option: TaskOptionType) => {
    const foundTask = answers?.find((r) => r.optionId === option.id);
    return foundTask;
  };

  const getGradientColor = (option: TaskOptionType, answers: TaskAnswerType[] | undefined) => {
    const foundAnswer = getAnswersOfTask(answers, option);

    if (!foundAnswer) {
      return {
        background: isDarkMode ? ["#6b7280", "#4b5563"] : ["#f3f4f6", "#e4e6f3"],
        shadow: isDarkMode ? ["#1e1e1e", "#374151"] : ["#e4e6f3", "#f3f4f6"],
      };
    }

    if (foundAnswer.isCorrect && !isLevelChecked) {
      return {
        background: isDarkMode ? ["#a5d6a7", "#81c784"] : ["#c8e6c9", "#a5d6a7"],
        shadow: isDarkMode ? ["#388e3c", "#2e7d32"] : ["#a5d6a7", "#81c784"],
      };
    }

    if (!foundAnswer.isCorrect && !isLevelChecked) {
      return {
        background: isDarkMode ? ["#e57373", "#ef5350"] : ["#ef9a9a", "#e57373"],
        shadow: isDarkMode ? ["#a14242", "#8e3a3a"] : ["#e57373", "#ef5350"],
      };
    }

    if (foundAnswer.isCorrect && isLevelChecked) {
      return {
        background: isDarkMode ? ["#2e7d32", "#388e3c"] : ["#c8e6c9", "#a5d6a7"],
        shadow: isDarkMode ? ["#388e3c", "#2e7d32"] : ["#a5d6a7", "#81c784"],
      };
    }

    return {
      background: isDarkMode ? ["#e57373", "#ef5350"] : ["#ef9a9a", "#e57373"],
      shadow: isDarkMode ? ["#a14242", "#8e3a3a"] : ["#e57373", "#ef5350"],
    };
  };

  return (
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
          const gradientColor = getGradientColor(option, answers);

          return (
            <MathTaskButton
              gradientColor={gradientColor}
              key={`${option.id}-${i}`}
              onPress={() => handlePress(option.id, option.isCorrect)}
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
