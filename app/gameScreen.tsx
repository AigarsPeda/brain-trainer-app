import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { ScaleButton } from "@/components/ScaleButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ALL_TASKS } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useLocalSearchParams } from "expo-router";
import { Dimensions } from "react-native";
import { router } from "expo-router";

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
  const { state, dispatch } = useAppContext();
  const { level } = useLocalSearchParams<{
    level: string;
  }>();

  const currentTaskInLevel = state.currentTaskInLevel;

  const levelTasks = ALL_TASKS[level];
  const currentTask = levelTasks?.find(
    (t) => t.taskNumberInLevel === currentTaskInLevel
  );
  const levelAnnswer = state.results?.find((r) => r.level === level)?.tasks[
    currentTaskInLevel
  ];

  const isTaskChecked = levelAnnswer?.isTaskChecked || false;
  const isAtLeastOneTaskAnswered = (levelAnnswer?.answers?.length ?? 0) > 0;

  const setAnnswer = (optionId: number, isCorrect: boolean) => {
    dispatch({
      type: "SET_RESULT_FOR_TASK",
      payload: {
        level,
        answer: {
          optionId,
          isCorrect,
        },
      },
    });
  };

  if (!levelTasks || levelTasks.length === 0) {
    return (
      <ThemedView>
        <ThemedText>Nav uzdevumu</ThemedText>
      </ThemedView>
    );
  }

  // router.push({ pathname: "/GameScreen", params: { level: index } });

  return (
    <ThemedView
      style={{
        paddingTop: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Progressbar currentLevelStep={currentTaskInLevel} />
      <ThemedView
        style={{
          paddingTop: 10,
          height: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ThemedView>
          {(() => {
            switch (currentTask?.taskType) {
              case "mathTaskWithResult":
                return (
                  <MathTaskWithResult
                    task={currentTask}
                    isLevelChecked={isTaskChecked}
                    answers={levelAnnswer?.answers}
                    handlePress={(optionId, isCorrect) => {
                      setAnnswer(optionId, isCorrect);
                    }}
                  />
                );
              default:
                return null;
            }
          })()}
        </ThemedView>
        <ThemedView
          style={{
            display: "flex",
            marginBottom: 26,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScaleButton
            disabled={!isAtLeastOneTaskAnswered}
            style={{
              height: 60,
              padding: 16,
              display: "flex",
              borderRadius: 10,
              marginBottom: 36,
              alignItems: "center",
              justifyContent: "center",
              width: WIDOW_WIDTH_WITH_MARGIN,
              backgroundColor: !isAtLeastOneTaskAnswered ? "#ccc" : "#D81E5B",
            }}
            onPress={() => {
              if (!isTaskChecked) {
                dispatch({
                  type: "CHECK_ANSWERS",
                  payload: {
                    level,
                    currentTaskNumber: currentTaskInLevel,
                  },
                });
                return;
              }

              dispatch({
                type: "GET_NEXT_TASK_IN_LEVEL",
                // payload: {
                //   level,
                // },
              });
            }}
          >
            <ThemedText
              style={{
                fontSize: 20,
                color: !isAtLeastOneTaskAnswered ? "#000" : "#fff",
              }}
            >
              {isTaskChecked ? "Nākamais uzdevums" : "Pārbaudīt"}
            </ThemedText>
          </ScaleButton>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
