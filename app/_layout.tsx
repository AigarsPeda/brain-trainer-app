import { AppContextProvider } from "@/context/app.context";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContextProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen
            name="GameScreen"
            options={(opt) => {
              const { level } = opt.route.params as { level: string };
              return {
                headerShown: true,
                title: level ?? "Spēle",
                headerBackTitle: "Atpakaļ",
                headerTintColor: colorScheme === "dark" ? "white" : "black",
                headerBackground: () => (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#D81E5B",
                    }}
                  />
                ),
              };
            }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AppContextProvider>
  );
}
