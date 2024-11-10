import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { ScaleButton } from "@/components/ScaleButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type {
  MultiAnswerMathTaskType,
  TaskOptionType,
} from "@/context/app.context.reducer";
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
  const { state, dispatch } = useAppContext();
  const { level } = useLocalSearchParams<{
    level: string;
  }>();

  const levelObj = state.resultsObj?.[level];
  const isAtLeastOneTaskAnswered = levelObj?.answers?.length > 0;

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

  return (
    <ThemedView
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
      }}
    >
      <Progressbar currentLevelStep={0} />
      <ThemedView
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          height: "100%",
        }}
      >
        <ThemedView>
          {state.multiAnswerMathTasks.map((task, i) => {
            if (task.taskType === "mathTaskWithResult") {
              return (
                <MathTaskWithResult
                  key={i}
                  task={task}
                  level={level}
                  annswers={levelObj?.answers}
                  isLevelChecked={false}
                  handlePress={(optionId, isCorrect) => {
                    setAnnswer(optionId, isCorrect);
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
              console.log("Back to home");
            }}
          >
            <ThemedText
              style={{
                fontSize: 20,
                color: !isAtLeastOneTaskAnswered ? "#000" : "#fff",
              }}
            >
              Pārbaudīt
            </ThemedText>
          </ScaleButton>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
