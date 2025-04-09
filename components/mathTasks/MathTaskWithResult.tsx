import { MathTaskButton } from "@/components/mathTasks/MathTaskButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { MultiAnswerMathTaskType, TaskAnswerType, TaskOptionType } from "@/context/app.context.reducer";
import { StyleSheet } from "react-native";

interface MathTaskWithResultProps {
  isLevelChecked: boolean;
  answers: TaskAnswerType[] | undefined;
  task: MultiAnswerMathTaskType;
  handlePress: (optionId: number, isCorrect: boolean) => void;
}

export default function MathTaskWithResult({ task, answers, handlePress, isLevelChecked }: MathTaskWithResultProps) {
  const getAnswersOfTask = (answers: TaskAnswerType[] | undefined, option: TaskOptionType) => {
    const foundTask = answers?.find((r) => r.optionId === option.id);
    return foundTask;
  };

  const getGradientColor = (option: TaskOptionType, answers: TaskAnswerType[] | undefined) => {
    const foundAnswer = getAnswersOfTask(answers, option);

    if (!foundAnswer) {
      return {
        background: ["#f3f4f6", "#e4e6f3"] as [string, string],
        shadow: ["#e5e7eb", "#d1d5db"] as [string, string],
      };
    }

    if (foundAnswer.isCorrect && !isLevelChecked) {
      return {
        background: ["#c8e6c9", "#a5d6a7"] as [string, string],
        shadow: ["#a5d6a7", "#81c784"] as [string, string],
      };
    }

    if (!foundAnswer.isCorrect && !isLevelChecked) {
      return {
        background: ["#ef9a9a", "#e57373"] as [string, string],
        shadow: ["#e57373", "#ef5350"] as [string, string],
      };
    }

    if (foundAnswer.isCorrect && isLevelChecked) {
      return {
        background: ["#c8e6c9", "#a5d6a7"] as [string, string],
        shadow: ["#a5d6a7", "#81c784"] as [string, string],
      };
    }

    return {
      background: ["#ef9a9a", "#e57373"] as [string, string],
      shadow: ["#e57373", "#ef5350"] as [string, string],
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
          paddingTop: 20,
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
