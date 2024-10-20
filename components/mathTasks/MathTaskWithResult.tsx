import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface MathTaskWithResultProps {
  level: string;
  task: {
    taskType: string;
    result: number;
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
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {/* <ThemedText
        style={{
          fontSize: 20,
        }}
      >
        "Math Task With Result" {level}
      </ThemedText> */}
      <ThemedText type="title">{task.result}</ThemedText>
      {task.tasks.map((task) => {
        return (
          <ThemedText
            style={{
              fontSize: 20,
            }}
          >
            {task.task} {task.result} {task.correckt ? "Correct" : "Incorrect"}
          </ThemedText>
        );
      })}
    </ThemedView>
  );
}
