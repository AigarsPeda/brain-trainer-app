import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "brain-trainer-app",
  slug: "brain-trainer-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/brain.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/brain.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
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
      backgroundColor: "#ffffff",
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
  ],
  experiments: {
    typedRoutes: true,
  },
  newArchEnabled: true,
};

export default config;
