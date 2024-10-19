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

const MATH_TASK = [
  {
    taskType: "mathTaskWithResult",
    result: 8,
    tasks: [
      {
        task: "4 + 4",
        result: 8,
        correckt: true,
      },
      {
        task: "5 + 2",
        result: 7,
        correckt: false,
      },
      {
        task: "10 - 2",
        result: 8,
        correckt: true,
      },
      {
        task: "6 + 3",
        result: 9,
        correckt: false,
      },
    ],
  },
];

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
        {MATH_TASK.map((task) => {
          if (task.taskType === "mathTaskWithResult") {
            return <MathTaskWithResult level={level} task={task} />;
          }
        })}
      </ThemedView>
    </SafeAreaView>
  );
}
