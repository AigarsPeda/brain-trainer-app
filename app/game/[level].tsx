import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { CreateMathTask } from "@/components/mathTasks/CreateMathTask";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ALL_TASKS, isCreateMathTask, isMultiAnswerMathTask, LevelsEnum } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GameLevelScreen() {
  const {
    state: {
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
  const maxLevelStep = levelTasks?.length || 0;

  if (!levelTasks || levelTasks.length === 0) {
    console.error("No tasks found for level", level);
    return (
      <ThemedView>
        <ThemedText>Nav uzdevumu</ThemedText>
      </ThemedView>
    );
  }

  if (!currentTask) {
    console.error("No current task found");
    return (
      <ThemedView>
        <ThemedText>Nav atrasts uzdevums</ThemedText>
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
        <>
          {isMultiAnswerMathTask(currentTask) && (
            <MathTaskWithResult level={level} maxLevelStep={maxLevelStep} task={currentTask} />
          )}
          {isCreateMathTask(currentTask) && <CreateMathTask level={level} task={currentTask} />}
        </>
      </ThemedView>
    </ThemedView>
  );
}
