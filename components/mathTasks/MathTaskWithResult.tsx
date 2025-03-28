import { ScaleButton } from "@/components/ScaleButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { MultiAnswerMathTaskType, TaskAnswerType, TaskOptionType } from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 12;
const ITEM_PER_ROW = 2;
const WIDOW_WIDTH_WITH_MARGIN = width - 32;
const TOTAL_GAP_SIZE = (ITEM_PER_ROW - 1) * GAP;
const childWidth = (WIDOW_WIDTH_WITH_MARGIN - TOTAL_GAP_SIZE) / ITEM_PER_ROW;

interface MathTaskWithResultProps {
  isLevelChecked: boolean;
  answers: TaskAnswerType[] | undefined;
  task: MultiAnswerMathTaskType;
  handlePress: (optionId: number, isCorrect: boolean) => void;
}

export default function MathTaskWithResult({ task, answers, handlePress, isLevelChecked }: MathTaskWithResultProps) {
  const theme = useThemeColor();

  const getAnswersOfTask = (answers: TaskAnswerType[] | undefined, option: TaskOptionType) => {
    const foundTask = answers?.find((r) => r.optionId === option.id);
    return foundTask;
  };

  const getBorderColor = (option: TaskOptionType, answers: TaskAnswerType[] | undefined) => {
    const foundAnswer = getAnswersOfTask(answers, option);

    if (!foundAnswer) {
      return theme.notAnsweredBorder;
    }

    if (foundAnswer.isCorrect && !isLevelChecked) {
      return theme.clickedAnswer;
    }

    if (!foundAnswer.isCorrect && !isLevelChecked) {
      return theme.clickedAnswer;
    }

    if (foundAnswer.isCorrect && isLevelChecked) {
      return theme.correctAnswer;
    }

    return theme.incorrectAnswer;
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
        <ThemedText>Izvēlies</ThemedText>
        <ThemedText
          style={{
            color: "#D81E5B",
            fontSize: 17,
          }}
        >
          visas
        </ThemedText>
        <ThemedText>pareizās atbildes</ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          paddingTop: 20,
          display: "flex",
          paddingBottom: 10,
          marginVertical: GAP,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText
          type="subtitle"
          style={{
            fontSize: 60,
            lineHeight: 60,
          }}
        >
          {task.result}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.itemsWrap}>
        {task.options.map((option, i) => {
          const borderColor = getBorderColor(option, answers);

          return (
            <ScaleButton
              key={`${option.id}-${i}`}
              // style={[
              //   styles.singleItem,
              //   {
              //     borderWidth: 3.5,
              //     display: "flex",
              //     borderRadius: 10,
              //     borderStyle: "solid",
              //     alignItems: "center",
              //     marginVertical: GAP / 2,
              //     justifyContent: "center",
              //     borderColor,
              //     position: "relative",
              //   },
              // ]}
              style={{
                ...styles.singleItem,
                borderWidth: 3.5,
                display: "flex",
                borderRadius: 10,
                borderStyle: "solid",
                alignItems: "center",
                marginVertical: GAP / 2,
                justifyContent: "center",
                borderColor,
                position: "relative",
              }}
              onPress={() => handlePress(option.id, option.isCorrect)}
            >
              <ThemedText
                style={{
                  fontSize: 24,
                }}
              >
                {option.equation}
              </ThemedText>
            </ScaleButton>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  itemsWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: -(GAP / 2),
    marginHorizontal: -(GAP / 2),
  },
  singleItem: {
    marginHorizontal: GAP / 2,
    minWidth: childWidth,
    maxWidth: childWidth,
    height: childWidth / 1.5,
  },
});
