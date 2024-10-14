import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function MathTaskWithResult() {
  return (
    <ThemedView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText
        style={{
          fontSize: 20,
        }}
      >
        "Math Task With Result"
      </ThemedText>
    </ThemedView>
  );
}
