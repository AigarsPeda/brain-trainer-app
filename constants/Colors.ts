const tintColorDark = "#fff";
const tintColorLight = "#4338ca";

// const GAME_CARD_COLORS_DARK = ["#D81E5B", "#9D69A3", "#C6D8D3", "#FDF0D5"];
export const GAME_CARD_COLORS_LIGHT = ["#D81E5B", "#9D69A3", "#C6D8D3", "#FDF0D5"];

export const LevelBackgrounds = {
  home: {
    dark: ["#2E1065", "#1e1b4b", "#0F172A"] as const,
    light: ["#E0E7FF", "#EEF2FF", "#FAE8FF"] as const,
  },
  mathTaskWithResult: {
    dark: ["#0C4A6E", "#164E63", "#1E3A5F"] as const,
    light: ["#F0F9FF", "#ECFEFF", "#F8FAFC"] as const,
  },
  createMathTask: {
    dark: ["#14532D", "#134E4A", "#1E3A3A"] as const,
    light: ["#F0FDF4", "#ECFDF5", "#F8FAFC"] as const,
  },
  textTask: {
    dark: ["#4C1D95", "#3730A3", "#312E81"] as const,
    light: ["#EDE9FE", "#E0E7FF", "#F5F3FF"] as const,
  },
  challenge: {
    dark: ["#7C2D12", "#78350F", "#451A03"] as const,
    light: ["#FED7AA", "#FEF3C7", "#FFF7ED"] as const,
  },
  bonus: {
    dark: ["#581C87", "#4C1D95", "#2E1065"] as const,
    light: ["#F3E8FF", "#EDE9FE", "#FAE8FF"] as const,
  },
  practice: {
    dark: ["#881337", "#701A3F", "#4A0D2E"] as const,
    light: ["#FCE7F3", "#FBCFE8", "#FDF2F8"] as const,
  },
} as const;

export type GradientColors = readonly [string, string, string];
export type TaskType = keyof typeof LevelBackgrounds;

export const DropZoneColors = {
  dark: {
    border: "rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.08)",
  },
  light: {
    border: "rgba(0, 0, 0, 0.25)",
    background: "rgba(0, 0, 0, 0.05)",
  },
} as const;

export const ButtonColors = {
  primary: {
    dark: {
      background: ["#22c55e", "#16a34a"] as const,
      shadow: ["#15803d", "#166534"] as const,
      text: "#ffffff",
    },
    light: {
      background: ["#bbf7d0", "#86efac"] as const,
      shadow: ["#4ade80", "#22c55e"] as const,
      text: "#166534",
    },
  },
  secondary: {
    dark: {
      background: ["#475569", "#334155"] as const,
      shadow: ["#1e293b", "#0f172a"] as const,
      text: "#e2e8f0",
    },
    light: {
      background: ["#f1f5f9", "#e2e8f0"] as const,
      shadow: ["#cbd5e1", "#94a3b8"] as const,
      text: "#334155",
    },
  },
  disabled: {
    dark: {
      background: ["#4b5563", "#374151"] as const,
      shadow: ["#1f2937", "#111827"] as const,
      text: "#9ca3af",
    },
    light: {
      background: ["#e5e7eb", "#d1d5db"] as const,
      shadow: ["#9ca3af", "#6b7280"] as const,
      text: "#6b7280",
    },
  },
} as const;

export const ToggleColors = {
  dark: {
    containerBackground: "rgba(196, 181, 253, 0.15)",
    indicatorBackground: "#8b5cf6",
    activeText: "#ffffff",
  },
  light: {
    containerBackground: "rgba(106, 74, 203, 0.1)",
    indicatorBackground: "#6a4acb",
    activeText: "#ffffff",
  },
} as const;

export const HintModalColors = {
  dark: {
    boxBackground: "rgba(255, 255, 255, 0.1)",
    boxBorder: "rgba(196, 181, 253, 0.3)",
    visualSectionBackground: "rgba(106, 74, 203, 0.15)",
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    closeButtonBackground: "#6a4acb",
    closeButtonText: "#ffffff",
    exampleLabel: "#c4b5fd",
    equationText: "#c4b5fd",
    operationText: "#c4b5fd",
    subtractionLabel: "#c4b5fd",
    resultCount: "#c4b5fd",
    equalsText: "#c4b5fd",
    groupBoxBorder: "#c4b5fd",
  },
  light: {
    boxBackground: "rgba(255, 255, 255, 0.6)",
    boxBorder: "rgba(106, 74, 203, 0.2)",
    visualSectionBackground: "rgba(106, 74, 203, 0.25)",
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    closeButtonBackground: "#6a4acb",
    closeButtonText: "#ffffff",
    exampleLabel: "#5a3d9e",
    equationText: "#6a4acb",
    operationText: "#6a4acb",
    subtractionLabel: "#5a3d9e",
    resultCount: "#5a3d9e",
    equalsText: "#6a4acb",
    groupBoxBorder: "#6a4acb",
  },
} as const;

export const getTaskBackground = (
  taskType: "mathTaskWithResult" | "createMathTask" | "textTask" | "challenge" | "bonus" | "practice" | "home",
  theme: "light" | "dark"
): GradientColors => {
  return LevelBackgrounds[taskType]?.[theme] ?? LevelBackgrounds.home[theme];
};

export const Colors = {
  light: {
    icon: "#687076",
    text: "#1f2937",
    background: "#fff",
    inputBackground: "#FFFFFF",
    placeholder: "#AAAAAA",
    tint: tintColorLight,
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    notAnsweredBorder: "#d1d5db",
    incorrectAnswer: "#ef4444",
    clickedAnswer: "#374151",
    correctAnswer: "#09E85E",
    border: "#d1d5db",
  },
  dark: {
    icon: "#9BA1A6",
    text: "#ECEDEE",
    background: "#1f2937",
    inputBackground: "#2A2A2A",
    placeholder: "#666666",
    tint: tintColorDark,
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    notAnsweredBorder: "#d1d5db",
    incorrectAnswer: "#ef4444",
    clickedAnswer: "#374151",
    correctAnswer: "#09E85E",
    border: "#374151",
  },
};
