import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { CreateMathTask } from "@/components/mathTasks/CreateMathTask";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { isCreateMathTask, isMultiAnswerMathTask, LevelsEnum } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { getLevelTaskData } from "@/utils/game";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GameLevelScreen() {
  const {
    state: {
      lives,
      results,
      game: { currentTaskInLevel },
    },
  } = useAppContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { level } = useLocalSearchParams<"/game/[level]">() as { level: LevelsEnum };
  const { levelTasks, currentTask, maxLevelStep } = getLevelTaskData(level, currentTaskInLevel);

  const isFinalTaskInLevel = currentTask?.taskNumberInLevel === maxLevelStep;

  if (!level || isNaN(Number(level)) || Array.isArray(level)) {
    return (
      <ThemedView>
        <ThemedText>Nav atrasts līmenis</ThemedText>
      </ThemedView>
    );
  }

  // i need to see nested object in console
  for (const [levelKey, levelValue] of Object.entries(results)) {
    console.log("levelValue.tasksResults:", levelValue.tasksResults);
  }

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
        ...styles.itemsWrap,
        paddingTop: styles.itemsWrap.paddingTop + insets.top,
        paddingBottom: styles.itemsWrap.paddingBottom + insets.bottom,
      }}
    >
      <ThemedView style={styles.view}>
        <StatisticsItem
          src={Close}
          onPress={() => {
            router.back();
          }}
        />
        <Progressbar maxLevelStep={maxLevelStep} currentLevelStep={currentTaskInLevel} />
        <StatisticsItem src={Heart} stat={lives} size={styles.statisticsItem} />
      </ThemedView>
      <ThemedView style={styles.levelView}>
        {isMultiAnswerMathTask(currentTask) && (
          <MathTaskWithResult
            level={level}
            task={currentTask}
            maxLevelStep={maxLevelStep}
            isFinalTaskInLevel={isFinalTaskInLevel}
          />
        )}
        {isCreateMathTask(currentTask) && (
          <CreateMathTask
            level={level}
            task={currentTask}
            maxLevelStep={maxLevelStep}
            isFinalTaskInLevel={isFinalTaskInLevel}
          />
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  itemsWrap: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 25,
  },
  view: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statisticsItem: {
    width: 36,
    height: 36,
  },
  levelView: {
    paddingTop: 10,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
