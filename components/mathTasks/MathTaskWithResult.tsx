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
        background: isDarkMode ? ["#64748b", "#475569"] : ["#f1f5f9", "#e2e8f0"],
        shadow: isDarkMode ? ["#334155", "#1e293b"] : ["#cbd5e1", "#94a3b8"],
      };
    }

    if (foundAnswer.isCorrect && isLevelChecked) {
      return {
        background: isDarkMode ? ["#22c55e", "#16a34a"] : ["#bbf7d0", "#86efac"],
        shadow: isDarkMode ? ["#15803d", "#166534"] : ["#4ade80", "#22c55e"],
      };
    }

    if (!foundAnswer.isCorrect && isLevelChecked) {
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

          if (isDarkMode) {
            gradientColor.background.reverse();
            gradientColor.shadow.reverse();
          }

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
