import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { HintModal } from "@/components/HintModal";
import { InfoModal } from "@/components/InfoModal";
import { LivesModal } from "@/components/LivesModal";
import { CreateMathTask } from "@/components/mathTasks/CreateMathTask";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import { TextTask } from "@/components/mathTasks/TextTask";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTaskBackground } from "@/constants/Colors";
import { isCreateMathTask, isMultiAnswerMathTask, isTextTask, LevelsEnum } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { getLevelTaskData } from "@/utils/game";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GameLevelScreen() {
  const {
    state: {
      lives,
      theme,
      lastLifeLostAt,
      game: { currentTaskInLevel },
    },
    dispatch,
    getTaskExplanation,
  } = useAppContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loaded, showAdForReward } = useGoogleAd();
  const [isHintModalVisible, setIsHintModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isLivesModalVisible, setIsLivesModalVisible] = useState(false);
  const { level } = useLocalSearchParams<"/game/[level]">() as { level: LevelsEnum };
  const { levelTasks, currentTask, maxLevelStep } = getLevelTaskData(level, currentTaskInLevel);

  const livesAnimation = usePulseOnChange(lives);

  const isFinalTaskInLevel = currentTask?.taskNumberInLevel === maxLevelStep;

  // Get background gradient based on current task type
  const backgroundColors = useMemo(() => {
    const taskType = currentTask?.taskType ?? "home";
    return getTaskBackground(taskType as "mathTaskWithResult" | "createMathTask", theme);
  }, [currentTask?.taskType, theme]);

  // Get explanation for the current task
  const currentTaskExplanation = useMemo(() => {
    if (!currentTask) return null;
    return getTaskExplanation(currentTask);
  }, [currentTask, getTaskExplanation]);

  const openInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalVisible(false);
  };

  const openLivesModal = () => {
    setIsLivesModalVisible(true);
  };

  const closeLivesModal = () => {
    setIsLivesModalVisible(false);
  };

  const openHintModal = () => {
    setIsHintModalVisible(true);
  };

  const closeHintModal = () => {
    setIsHintModalVisible(false);
  };

  const handleWatchAd = () => {
    showAdForReward(
      () => {
        // Called when user earns reward
        dispatch({ type: "RESTORE_LIFE_FROM_AD" });
      },
      () => {
        // Called when ad closes (regardless of reward)
        setIsLivesModalVisible(false);
      }
    );
  };

  if (!level || isNaN(Number(level)) || Array.isArray(level)) {
    return (
      <ThemedView>
        <ThemedText>Nav atrasts līmenis</ThemedText>
      </ThemedView>
    );
  }

  // i need to see nested object in console
  // for (const [levelKey, levelValue] of Object.entries(results)) {
  //   console.log("levelValue.tasksResults:", levelValue.tasksResults);
  // }

  if (!levelTasks || levelTasks.length === 0) {
    return (
      <ThemedView>
        <ThemedText>Nav uzdevumu</ThemedText>
      </ThemedView>
    );
  }

  if (!currentTask) {
    return (
      <ThemedView>
        <ThemedText>Nav atrasts uzdevums</ThemedText>
      </ThemedView>
    );
  }

  return (
    <LinearGradient end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} colors={[...backgroundColors]} style={styles.gradient}>
      <BackgroundPattern />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <InfoModal visible={isInfoModalVisible} onClose={closeInfoModal} />
      <LivesModal
        lives={lives}
        adLoaded={loaded}
        onWatchAd={handleWatchAd}
        onClose={closeLivesModal}
        visible={isLivesModalVisible}
        lastLifeLostAt={lastLifeLostAt}
      />
      <HintModal visible={isHintModalVisible} onClose={closeHintModal} explanation={currentTaskExplanation} />
      <View
        style={{
          ...styles.itemsWrap,
          paddingTop: styles.itemsWrap.paddingTop + insets.top + 12,
          paddingBottom: styles.itemsWrap.paddingBottom + insets.bottom,
        }}
      >
        <View style={styles.view}>
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
            onPress={openLivesModal}
            animation={livesAnimation}
            size={styles.statisticsItem}
          />
        </View>
        {/* Hint button row */}
        <Pressable style={styles.hintRow} onPress={openHintModal}>
          <ThemedText style={styles.hintEmoji}>💡</ThemedText>
          <ThemedText style={styles.hintText} type="subtitle">
            Palīdzība
          </ThemedText>
        </Pressable>
        <View style={styles.levelView}>
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
          {isTextTask(currentTask) && (
            <TextTask
              level={level}
              task={currentTask}
              maxLevelStep={maxLevelStep}
              isFinalTaskInLevel={isFinalTaskInLevel}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  itemsWrap: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 25,
  },
  view: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  statisticsItem: {
    width: 36,
    height: 36,
  },
  levelView: {
    flex: 1,
    paddingTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  hintEmoji: {
    fontSize: 18,
  },
  hintText: {
    fontSize: 14,
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  infoIcon: {
    width: 32,
    height: 32,
  },
  infoText: {
    paddingBottom: 4,
    fontSize: 14,
  },
});
