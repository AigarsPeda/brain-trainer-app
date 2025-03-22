import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "brain",
  slug: "brain",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/brain.png",
  scheme: "brain",
  backgroundColor: "#2c3e50",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.aigarsp.braintrainerapp",
    infoPlist: {
      GADApplicationIdentifier: "ca-app-pub-5238286944896076~6072715024",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/brain.png",
    },
    package: "com.aigarsp.braintrainerapp",
  },
  plugins: [
    "expo-router",
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-5238286944896076~6180701555",
        iosAppId: "ca-app-pub-5238286944896076~6072715024",
      },
    ],
    "expo-font",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#2c3e50",
        image: "./assets/images/brain-splash.png",
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  newArchEnabled: true,
};

export default config;
