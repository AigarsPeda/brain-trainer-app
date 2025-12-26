import useAppContext from "@/hooks/useAppContext";
import type { ColorSchemeName } from "react-native";

export function useAppColorScheme(): ColorSchemeName {
  const { state } = useAppContext();
  return state.theme ?? "light";
}
