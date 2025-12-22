import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import Info from "@/assets/images/exclamation-mark.png";
import { InfoModal } from "@/components/InfoModal";
import { LivesModal } from "@/components/LivesModal";
import { CreateMathTask } from "@/components/mathTasks/CreateMathTask";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { isCreateMathTask, isMultiAnswerMathTask, LevelsEnum } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { getLevelTaskData } from "@/utils/game";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

export default function GameLevelScreen() {
  const {
    state: {
      lives,
      results,
      lastLifeLostAt,
      game: { currentTaskInLevel },
    },
    dispatch,
  } = useAppContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loaded, showAdForReward } = useGoogleAd();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isLivesModalVisible, setIsLivesModalVisible] = useState(false);
  const { level } = useLocalSearchParams<"/game/[level]">() as { level: LevelsEnum };
  const { levelTasks, currentTask, maxLevelStep } = getLevelTaskData(level, currentTaskInLevel);

  const livesAnimation = usePulseOnChange(lives);

  const isFinalTaskInLevel = currentTask?.taskNumberInLevel === maxLevelStep;

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

  const handleWatchAd = () => {
    showAdForReward(() => {
      dispatch({ type: "RESTORE_LIFE_FROM_AD" });
      setIsLivesModalVisible(false);
    });
  };

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
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <InfoModal visible={isInfoModalVisible} onClose={closeInfoModal} />
      <LivesModal
        visible={isLivesModalVisible}
        onClose={closeLivesModal}
        lives={lives}
        lastLifeLostAt={lastLifeLostAt}
        adLoaded={loaded}
        onWatchAd={handleWatchAd}
      />
      <ThemedView
        style={{
          ...styles.itemsWrap,
          paddingTop: styles.itemsWrap.paddingTop + insets.top + 12,
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
          <StatisticsItem
            src={Heart}
            stat={lives}
            size={styles.statisticsItem}
            animation={livesAnimation}
            onPress={openLivesModal}
          />
        </ThemedView>
        {/* TODO: Where should I put the info row? */}
        {/* <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.infoText} type="subtitle" onPress={openInfoModal}>
            Uzzini vairak par so uzdevumu
          </ThemedText>
        </ThemedView> */}
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
    </>
  );
}

const styles = StyleSheet.create({
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
