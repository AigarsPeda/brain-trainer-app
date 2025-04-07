import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  darkColor?: string;
  lightColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({ style, darkColor, lightColor, type = "default", ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "link" ? styles.link : undefined,
        type === "title" ? styles.title : undefined,
        type === "default" ? styles.default : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// BalooBhai2_400Regular,
// BalooBhai2_500Medium,
// BalooBhai2_600SemiBold,
// BalooBhai2_700Bold,
// BalooBhai2_800ExtraBold,

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: "BalooBhai2_400Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: "BalooBhai2_500Medium",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "BalooBhai2_700Bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "BalooBhai2_700Bold",
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "BalooBhai2_500Medium",
  },
});
