import { Theme as NavigationTheme } from "@react-navigation/native";

// Ensure ReactNavigation namespace is available in the project
declare global {
  namespace ReactNavigation {
    interface Theme extends NavigationTheme {}
  }
}

export {};
