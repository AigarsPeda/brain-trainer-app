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
        // justifyContent: "center",
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
        {task.tasks.map((task) => {
          return (
            <ThemedView
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

                  // borderColor: task.correckt ? "#00ff00" : "#ff0000",
                },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 24,
                }}
              >
                {task.task}
                {/* {task.correckt ? "Correct" : "Incorrect"} */}
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
