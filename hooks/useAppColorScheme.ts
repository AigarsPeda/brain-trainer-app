import { useAppTheme } from "@/hooks/useAppContext";
import type { ThemeType } from "@/context/app.context.reducer";

export function useAppColorScheme(): ThemeType {
  return useAppTheme();
}
