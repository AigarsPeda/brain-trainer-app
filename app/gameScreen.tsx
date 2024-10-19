import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// const ios = "ca-app-pub-5238286944896076/6557213296";
// const android = "ca-app-pub-5238286944896076/2318585385";

// const adDeviceId = Device.osName === "iOS" ? ios : android;
// const adUnitId = __DEV__ ? TestIds.REWARDED : adDeviceId;

// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
//   keywords: ["games", "kids", "fun", "education", "learning"],
// });

export default function GameScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{
    level: string;
  }>();

  console.log("local", typeof level, level);

  return (
    <SafeAreaView>
      <ThemedView
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MathTaskWithResult level={level} />
      </ThemedView>
    </SafeAreaView>
  );
}
