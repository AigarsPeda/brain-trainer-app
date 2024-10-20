import { useThemeColor } from "@/hooks/useThemeColor";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  darkColor?: string;
  lightColor?: string;
};

export function ThemedView({
  style,
  darkColor,
  lightColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  if (Array.isArray(backgroundColor)) {
    throw new Error(
      "ThemedView does not support array background colors. Use ThemedLinearGradient instead."
    );
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
