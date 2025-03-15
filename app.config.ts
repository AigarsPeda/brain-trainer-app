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
  //   splash: {
  //     image: "./assets/images/brain-splash.png",
  //     // resizeMode: "contain",
  //     backgroundColor: "#2c3e50",
  //   },
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
      //   backgroundColor: "#2c3e50",
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
        // dark: {
        //   image: "./assets/images/splash-icon-dark.png",
        //   backgroundColor: "#2c3e50",
        // },
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
