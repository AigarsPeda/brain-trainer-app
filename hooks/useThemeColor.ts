import { Colors } from "@/constants/Colors";
import useAppContext from "@/hooks/useAppContext";

type ColorTheme = typeof Colors.light | typeof Colors.dark;

type ThemeColorResult<
  P extends { light?: string; dark?: string } | undefined,
  C extends keyof ColorTheme | undefined,
> = [P, C] extends [undefined, undefined]
  ? ColorTheme
  : P extends { light: string } | { dark: string }
    ? string
    : C extends keyof ColorTheme
      ? string
      : ColorTheme;

export function useThemeColor<
  P extends { light?: string; dark?: string } | undefined = undefined,
  C extends keyof ColorTheme | undefined = undefined,
>(props?: P, colorName?: C): ThemeColorResult<P, C> {
  const { state } = useAppContext();
  const theme = state.theme ?? "light";

  const colorFromProps = props?.[theme];

  if (colorFromProps) {
    return colorFromProps as ThemeColorResult<P, C>;
  }

  if (colorName) {
    return Colors[theme][colorName] as ThemeColorResult<P, C>;
  }

  return Colors[theme] as ThemeColorResult<P, C>;
}
