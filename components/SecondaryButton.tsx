import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

interface SecondaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SecondaryButton({ onPress, children, style }: SecondaryButtonProps) {
  const borderColor = useThemeColor({}, "border");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { borderColor },
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 120,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
