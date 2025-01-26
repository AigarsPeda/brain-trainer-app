import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { ScaleButton } from "@/components/ScaleButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ALL_TASKS } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const WIDOW_WIDTH_WITH_MARGIN = width - 32;

export default function GameLevelScreen() {
  const {
    dispatch,
    state: { results, availableLevels, currentTaskInLevel },
  } = useAppContext();
  const { level } = useLocalSearchParams<"/game/[level]">();

  if (!level || isNaN(Number(level)) || Array.isArray(level)) {
    return (
      <ThemedView>
        <ThemedText>Nav atrasts līmenis</ThemedText>
      </ThemedView>
    );
  }

  const levelTasks = ALL_TASKS[level];
  const currentTask = levelTasks?.find((t) => t.taskNumberInLevel === currentTaskInLevel);
  const levelAnswer = results?.find((r) => r.level === level)?.tasks[currentTaskInLevel];

  const maxLevelStep = levelTasks?.length || 0;
  const isTaskChecked = levelAnswer?.isTaskChecked || false;
  const isAtLeastOneTaskAnswered = (levelAnswer?.answers?.length ?? 0) > 0;

  const setAnswer = (optionId: number, isCorrect: boolean) => {
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

  const goToNextLevel = () => {
    const currentLevel = Number(level);
    const nextLevel = currentLevel + 1;

    dispatch({
      type: "GET_NEXT_LEVEL",
      payload: {
        nextLevel,
      },
    });

    const isLastAvailableLevel = availableLevels === currentLevel;

    router.replace({
      pathname: isLastAvailableLevel ? "/" : "/game/[level]",
      params: { level: isLastAvailableLevel ? 1 : nextLevel },
    });
  };

  const getNextTaskInLevel = () => {
    dispatch({
      type: "GET_NEXT_TASK_IN_LEVEL",
    });
  };

  if (!levelTasks || levelTasks.length === 0) {
    console.error("No tasks found for level", level);
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
        flex: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Progressbar maxLevelStep={maxLevelStep} currentLevelStep={currentTaskInLevel} />
      <ThemedView
        style={{
          paddingTop: 10,
          height: "100%",
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
                    answers={levelAnswer?.answers}
                    handlePress={(optionId, isCorrect) => {
                      setAnswer(optionId, isCorrect);
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

              if (isTaskChecked && maxLevelStep === currentTaskInLevel) {
                goToNextLevel();
                return;
              }

              getNextTaskInLevel();
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
