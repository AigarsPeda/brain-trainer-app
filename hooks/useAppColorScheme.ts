import useAppContext from "@/hooks/useAppContext";
import type { ThemeType } from "@/context/app.context.reducer";

export function useAppColorScheme(): ThemeType {
  const { state } = useAppContext();
  return state.theme ?? "light";
}
