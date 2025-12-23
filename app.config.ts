import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "Prāto",
  slug: "prato_app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/brain.png",
  scheme: "brain",
  backgroundColor: "#E6E3E0",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.aigarsp.braintrainerapp",
    infoPlist: {
      GADApplicationIdentifier: "ca-app-pub-5238286944896076~6398230265",
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
    "expo-web-browser",
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-5238286944896076~6398230265",
        iosAppId: "ca-app-pub-5238286944896076~6398230265",
      },
    ],
    "expo-font",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#E6E3E0",
        image: "./assets/images/brain-splash.png",
        imageWidth: 180,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  newArchEnabled: true,
};

export default config;
