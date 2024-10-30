import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type {
  MathTaskType,
  TaskAnnswerType,
  TaskVariantType,
} from "@/context/app.context.reducer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dimensions, Pressable, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 12;
const ITEM_PER_ROW = 2;
const WIDOW_WIDTH_WITH_MARGIN = width - 32;
const TOTAL_GAP_SIZE = (ITEM_PER_ROW - 1) * GAP;
const childWidth = (WIDOW_WIDTH_WITH_MARGIN - TOTAL_GAP_SIZE) / ITEM_PER_ROW;

interface MathTaskWithResultProps {
  level: string;
  task: MathTaskType;
  isLevelChecked: boolean;
  annswers: TaskAnnswerType[];
  handlePress: (variant: TaskVariantType) => void;
}

export default function MathTaskWithResult({
  task,
  level,
  annswers,
  handlePress,
  isLevelChecked,
}: MathTaskWithResultProps) {
  const theme = useThemeColor();
  const getAnnswersOfTask = (
    annswers: TaskAnnswerType[] | undefined,
    variant: TaskVariantType
  ) => {
    const foudTask = annswers?.find((r) => r.annswerId === variant.id);
    return foudTask;
  };

  const getBorderColor = (
    annswers: TaskAnnswerType[] | undefined,
    variant: TaskVariantType
  ) => {
    const foundAnnswer = getAnnswersOfTask(annswers, variant);

    if (!foundAnnswer) {
      return theme.notAnsweredBorder;
    }

    if (!foundAnnswer.isCorrect && !isLevelChecked) {
      return theme.clickedAnswer;
    }

    if (!foundAnnswer.isCorrect && isLevelChecked) {
      return theme.incorrectAnswer;
    }

    return theme.correctAnswer;
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
            fontSize: 20,
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
        {task.variants.map((variant, i) => {
          const borderColor = getBorderColor(annswers, variant);

          return (
            <Pressable
              key={`${variant.id}-${i}`}
              style={[
                styles.singleItem,
                {
                  borderWidth: 3,
                  display: "flex",
                  borderRadius: 16,
                  // paddingVertical: 60,
                  borderStyle: "solid",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  marginVertical: GAP / 2,
                  justifyContent: "center",
                  borderColor: borderColor,
                },
              ]}
              onPress={() => handlePress(variant)}
            >
              <ThemedText
                style={{
                  fontSize: 24,
                }}
              >
                {variant.equation}
              </ThemedText>
            </Pressable>
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
