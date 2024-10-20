import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  MathTaskType,
  TaskAnnswerType,
  TaskVariantType,
} from "@/context/app.context.reducer";
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
      return "#030712";
    }

    if (!foundAnnswer.isCorrect && !isLevelChecked) {
      return "#42F2F7";
    }

    if (!foundAnnswer.isCorrect && isLevelChecked) {
      return "#D81E5B";
    }

    return "#09E85E";
  };

  return (
    <ThemedView
      style={{
        height: "100%",
        alignItems: "center",
      }}
    >
      <ThemedView
        style={{
          padding: 16,
          height: 100,
          display: "flex",
          marginVertical: GAP,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText
          style={{
            fontSize: 42,
            lineHeight: 42,
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
                  display: "flex",
                  borderRadius: 8,
                  borderWidth: 1.5,
                  paddingVertical: 32,
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
  },
});
