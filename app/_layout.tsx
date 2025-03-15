import { AppContextProvider } from "@/context/app.context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  SpaceMono_400Regular,
  SpaceMono_400Regular_Italic,
  SpaceMono_700Bold,
  SpaceMono_700Bold_Italic,
  useFonts,
} from "@expo-google-fonts/space-mono";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_400Regular_Italic,
    SpaceMono_700Bold,
    SpaceMono_700Bold_Italic,
  });

  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppContextProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="game" options={{ headerShown: false }} /> */}
          {/* <Stack.Screen
            name="GameScreen"
            options={(opt) => {
              // const { level } = opt.route.params as { level: string };
              return {
                headerShown: true,
                // title: level ?? "Spēle",
                title: "",
                headerBackTitle: "Atpakaļ",
                headerTintColor: colorScheme === "dark" ? "white" : "black",
                headerBackground: () => (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor,
                    }}
                  />
                ),
              };
            }}
          /> */}

          <Stack.Screen
            name="game/[level]"
            options={() => {
              // const { level } = opt.route.params as { level: string };
              return {
                headerShown: true,
                // title: level ?? "Spēle",
                title: "",
                headerBackTitle: "Atpakaļ",
                headerTintColor: colorScheme === "dark" ? "white" : "black",
                headerBackground: () => (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor,
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
