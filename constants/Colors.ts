/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#4338ca";
const tintColorDark = "#fff";

const cardBgColorLight = "#e0e0e0";
const cardBgColorDark = "#4338ca";

const GAME_CARD_COLORS_DARK = ["#ebf1fe", "#f6edff", "#e8f8ff", "#dcf7de"];
const GAME_CARD_COLORS_LIGHT = ["#cf8188", "#e8ae4a", "#98bb8c", "#858bb2"];

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // cardBgColor: cardBgColorLight,
    cardBgColor: GAME_CARD_COLORS_LIGHT,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // cardBgColor: cardBgColorDark,
    cardBgColor: GAME_CARD_COLORS_DARK,
  },
};
