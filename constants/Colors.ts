/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorDark = "#fff";
const tintColorLight = "#4338ca";

const GAME_CARD_COLORS_DARK = ["#D81E5B", "#9D69A3", "#C6D8D3", "#FDF0D5"];
export const GAME_CARD_COLORS_LIGHT = ["#D81E5B", "#9D69A3", "#C6D8D3", "#FDF0D5"];

export const Colors = {
  light: {
    icon: "#687076",
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    notAnsweredBorder: "#d1d5db",
    incorrectAnswer: "#D81E5B",
    clickedAnswer: "#374151",
    correctAnswer: "#09E85E",
  },
  dark: {
    icon: "#9BA1A6",
    text: "#ECEDEE",
    background: "#0F1A20",
    tint: tintColorDark,
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    notAnsweredBorder: "#d1d5db",
    incorrectAnswer: "#D81E5B",
    clickedAnswer: "#374151",
    correctAnswer: "#09E85E",
  },
};
