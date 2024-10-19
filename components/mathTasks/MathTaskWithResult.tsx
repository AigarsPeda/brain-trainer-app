import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface MathTaskWithResultProps {
  level: string;
}

export default function MathTaskWithResult({ level }: MathTaskWithResultProps) {
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
        "Math Task With Result" {level}
      </ThemedText>
    </ThemedView>
  );
}
