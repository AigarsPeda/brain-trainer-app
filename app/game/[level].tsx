import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { MainButton } from "@/components/MainButton";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ALL_TASKS, LevelsEnum } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// const { width } = Dimensions.get("window");
// const WIDOW_WIDTH_WITH_MARGIN = width - 32;

export default function GameLevelScreen() {
  const {
    dispatch,
    state: {
      results,
      availableLevels,
      lives,
      game: { currentTaskInLevel },
    },
  } = useAppContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { level } = useLocalSearchParams<"/game/[level]">() as { level: LevelsEnum };

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
    console.log("getNextTaskInLevel", currentTaskInLevel);
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

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 25,
      }}
    >
      <ThemedView
        style={{
          gap: 8,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <StatisticsItem
          src={Close}
          onPress={() => {
            router.back();
          }}
        />
        <Progressbar maxLevelStep={maxLevelStep} currentLevelStep={currentTaskInLevel} />
        <StatisticsItem
          src={Heart}
          stat={lives}
          size={{
            width: 36,
            height: 36,
          }}
        />
      </ThemedView>
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
          <MainButton
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
            disabled={!isAtLeastOneTaskAnswered}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 24,
                color: isAtLeastOneTaskAnswered ? "#1f2937" : "#6b7280",
              }}
            >
              {isTaskChecked ? "Nākamais uzdevums" : "Pārbaudīt"}
            </ThemedText>
          </MainButton>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
