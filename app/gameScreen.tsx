import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import { ThemedView } from "@/components/ThemedView";
import {
  MathTaskType,
  TaskAnnswerType,
  TaskVariantType,
} from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useLocalSearchParams } from "expo-router";

// const ios = "ca-app-pub-5238286944896076/6557213296";
// const android = "ca-app-pub-5238286944896076/2318585385";

// const adDeviceId = Device.osName === "iOS" ? ios : android;
// const adUnitId = __DEV__ ? TestIds.REWARDED : adDeviceId;

// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
//   keywords: ["games", "kids", "fun", "education", "learning"],
// });

export default function GameScreen() {
  // const router = useRouter();
  const taskNumber = 0;
  const { state, dispatch } = useAppContext();
  const { level } = useLocalSearchParams<{
    level: string;
  }>();

  const annswers = state.resultsObj?.[level]?.[taskNumber] ?? [];

  const setAnnswer = (
    taskNumber: number,
    task: MathTaskType,
    annswer: TaskVariantType
  ) => {
    dispatch({
      type: "SET_RESULT_FOR_TASK",
      payload: {
        level,
        taskNumber,
        answer: {
          annswerId: annswer.id,
          result: annswer.result,
          isCorrect: task.result === annswer.result,
        },
      },
    });
  };

  return (
    <ThemedView
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {state.mathTasks.map((task, i) => {
        if (task.taskType === "mathTaskWithResult") {
          return (
            <MathTaskWithResult
              key={i}
              task={task}
              level={level}
              annswers={annswers}
              handlePress={(annswer) => {
                setAnnswer(taskNumber, task, annswer);
              }}
            />
          );
        }
      })}
    </ThemedView>
  );
}
