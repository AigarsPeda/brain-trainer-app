import { AppContextProvider } from "@/context/app.context";
import useAppContext from "@/hooks/useAppContext";
// import {
//   Nunito_400Regular,
//   Nunito_600SemiBold,
//   Nunito_700Bold,
//   Nunito_700Bold_Italic,
//   useFonts,
// } from "@expo-google-fonts/nunito";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import {
  BalooBhai2_400Regular,
  BalooBhai2_500Medium,
  BalooBhai2_600SemiBold,
  BalooBhai2_700Bold,
  BalooBhai2_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/baloo-bhai-2";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { state } = useAppContext();
  const theme = state.theme ?? "light";
  const backgroundColor = Colors[theme].background;

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen
          name="game/[level]"
          options={() => {
            return {
              headerShown: false,
              title: "",
              headerBackTitle: "Atpakaļ",
              headerTintColor: theme === "dark" ? "white" : "black",
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
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BalooBhai2_400Regular,
    BalooBhai2_500Medium,
    BalooBhai2_600SemiBold,
    BalooBhai2_700Bold,
    BalooBhai2_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </GestureHandlerRootView>
  );
}
