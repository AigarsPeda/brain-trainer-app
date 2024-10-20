import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MathTaskType, TaskVariantType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, Pressable } from "react-native";

const { width } = Dimensions.get("window");
const WIDOW_WIDTH_WITH_MARGIN = width - 32;

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

  const levelObj = state.resultsObj?.[level];
  const isAtLeastOneTaskAnswered = levelObj?.[taskNumber]?.length > 0;

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
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ThemedView>
        {state.mathTasks.map((task, i) => {
          if (task.taskType === "mathTaskWithResult") {
            return (
              <MathTaskWithResult
                key={i}
                task={task}
                level={level}
                annswers={levelObj?.[taskNumber]}
                isLevelChecked={levelObj?.isLevelChecked}
                handlePress={(annswer) => {
                  setAnnswer(taskNumber, task, annswer);
                }}
              />
            );
          }
        })}
      </ThemedView>
      <ThemedView
        style={{
          display: "flex",
          marginBottom: 26,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          disabled={!isAtLeastOneTaskAnswered}
          style={{
            padding: 16,
            display: "flex",
            borderRadius: 8,
            marginBottom: 36,
            alignItems: "center",
            justifyContent: "center",
            width: WIDOW_WIDTH_WITH_MARGIN,
            backgroundColor: !isAtLeastOneTaskAnswered ? "#ccc" : "#D81E5B",
          }}
          onPress={() => {
            console.log("Back to home");
          }}
        >
          <ThemedText
            style={{
              color: !isAtLeastOneTaskAnswered ? "#000" : "#fff",
            }}
          >
            Pārbaudīt
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}
