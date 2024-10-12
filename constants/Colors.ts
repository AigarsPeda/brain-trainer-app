/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#4338ca";
const tintColorDark = "#fff";

// const GAME_CARD_COLORS_DARK = ["#ebf1fe", "#f6edff", "#e8f8ff", "#dcf7de"];
const GAME_CARD_COLORS_DARK = ["#D81E5B", "#9D69A3", "#C6D8D3", "#FDF0D5"];
const GAME_CARD_COLORS_SHADOW_DARK = [
  "#bbc0cb",
  "#c4bdcc",
  "#b9c6cc",
  "#aec3b0",
];

const GAME_CARD_COLORS_LIGHT = ["#D81E5B", "#9D69A3", "#C6D8D3", "#FDF0D5"];
const GAME_CARD_COLORS_SHADOW_LIGHT = [
  "#d0927a",
  "#b48739",
  "#6e8765",
  "#5e637e",
];



export const Colors = {
  light: {
    icon: "#687076",
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    cardBgColor: GAME_CARD_COLORS_LIGHT,
  },
  dark: {
    icon: "#9BA1A6",
    text: "#ECEDEE",
    background: "#001011",
    tint: tintColorDark,
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    cardBgColor: GAME_CARD_COLORS_DARK,
  },
};
