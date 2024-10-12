import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as Device from "expo-device";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RewardedAd, TestIds } from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";

const ios = "ca-app-pub-5238286944896076/6557213296";
const android = "ca-app-pub-5238286944896076/2318585385";

const adDeviceId = Device.osName === "iOS" ? ios : android;
const adUnitId = __DEV__ ? TestIds.REWARDED : adDeviceId;

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ["games", "kids", "fun", "education", "learning"],
});

export default function AdScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams();

  // get param

  console.log("local", level);

  return (
    <SafeAreaView>
      <ThemedView
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText
          style={{
            fontSize: 20,
          }}
        >
          "Game Screen" {level}
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
