import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 12;
const ITEM_PER_ROW = 2;
const WIDOW_WIDTH_WITH_MARGIN = width - 32;
const TOTAL_GAP_SIZE = (ITEM_PER_ROW - 1) * GAP;
const childWidth = (WIDOW_WIDTH_WITH_MARGIN - TOTAL_GAP_SIZE) / ITEM_PER_ROW;

interface MathTaskWithResultProps {
  level: string;
  task: {
    result: number;
    taskType: string;
    tasks: {
      task: string;
      result: number;
      correckt: boolean;
    }[];
  };
}

export default function MathTaskWithResult({
  level,
  task,
}: MathTaskWithResultProps) {
  return (
    <ThemedView
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedText type="title">{task.result}</ThemedText>
      <ThemedView style={styles.itemsWrap}>
        {task.tasks.map((task) => {
          return (
            <ThemedView
              style={[
                styles.singleItem,
                {
                  padding: 16,
                  display: "flex",
                  borderRadius: 8,
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  alignItems: "center",
                  marginVertical: GAP / 2,
                  justifyContent: "center",
                  borderColor: task.correckt ? "#00ff00" : "#ff0000",
                },
              ]}
            >
              <ThemedText>
                {task.task} {task.result}{" "}
                {task.correckt ? "Correct" : "Incorrect"}
              </ThemedText>
            </ThemedView>
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
