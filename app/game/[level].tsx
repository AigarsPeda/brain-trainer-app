import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { HelpModal } from "@/components/HelpModal";
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
import { HINT_COST, REMOVE_WRONG_ANSWER_COST } from "@/constants/GameSettings";
import { isCreateMathTask, isMultiAnswerMathTask, isTextTask } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAd from "@/hooks/useGoogleAd";
import { useLevelData } from "@/hooks/useLevelData";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { findIncorrectCreateMathOptions, findIncorrectMultiAnswerOptions, selectRandomItem } from "@/utils/taskHelpers";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ADDITIONAL_TOP_PADDING = 12;

type ModalType = "help" | "hint" | "info" | "lives" | null;

export default function GameLevelScreen() {
  const {
    state: {
      gems,
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
  const livesAnimation = usePulseOnChange(lives);
  const { loaded, showAdForReward } = useGoogleAd();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [removedAnswerIds, setRemovedAnswerIds] = useState<number[]>([]);
  const { level } = useLocalSearchParams<"/game/[level]">() as { level: string };
  const [showTextTaskAsMultipleChoice, setShowTextTaskAsMultipleChoice] = useState(false);
  const { levelTasks, currentTask, maxLevelStep } = useLevelData(level, currentTaskInLevel);
  const [gemAnimationStartValue, setGemAnimationStartValue] = useState<number | undefined>(undefined);

  const isFinalTaskInLevel = currentTask?.taskNumberInLevel === maxLevelStep;

  const canRemoveAnswer = useMemo(() => {
    if (!currentTask) return false;

    if (isTextTask(currentTask)) {
      return !showTextTaskAsMultipleChoice;
    } else if (isMultiAnswerMathTask(currentTask)) {
      const remainingOptions = currentTask.options.filter((opt) => !removedAnswerIds.includes(opt.id));
      return remainingOptions.length > 1; // Need at least one to remove
    } else if (isCreateMathTask(currentTask)) {
      const remainingOptions = currentTask.options.filter((opt) => !removedAnswerIds.includes(opt.id));
      return remainingOptions.length > 2; // Need at least 2 numbers to solve + 1 to remove
    }
    return false;
  }, [currentTask, removedAnswerIds, showTextTaskAsMultipleChoice]);

  const backgroundColors = useMemo(() => {
    const taskType = currentTask?.taskType ?? "home";
    return getTaskBackground(taskType as "mathTaskWithResult" | "createMathTask", theme);
  }, [currentTask?.taskType, theme]);

  const currentTaskExplanation = useMemo(() => {
    if (!currentTask) return null;
    return getTaskExplanation(currentTask);
  }, [currentTask, getTaskExplanation]);

  const closeHelpModal = () => {
    setOpenModal(null);
    setShowGemAnimation(false);
    setGemAnimationStartValue(undefined);
  };

  const handlePurchaseHint = () => {
    dispatch({ type: "SPEND_GEMS", payload: HINT_COST });
    setOpenModal("hint");
  };

  const handleRemoveWrongAnswer = () => {
    if (!currentTask) return;

    dispatch({ type: "SPEND_GEMS", payload: REMOVE_WRONG_ANSWER_COST });

    if (isTextTask(currentTask)) {
      setShowTextTaskAsMultipleChoice(true);
    } else if (isMultiAnswerMathTask(currentTask)) {
      const incorrectOptions = findIncorrectMultiAnswerOptions(currentTask, removedAnswerIds);
      const randomIncorrect = selectRandomItem(incorrectOptions);

      if (randomIncorrect) {
        setRemovedAnswerIds((prev) => [...prev, randomIncorrect.id]);
      }
    } else if (isCreateMathTask(currentTask)) {
      const incorrectOptions = findIncorrectCreateMathOptions(currentTask, removedAnswerIds);
      const randomIncorrect = selectRandomItem(incorrectOptions);

      if (randomIncorrect) {
        setRemovedAnswerIds((prev) => [...prev, randomIncorrect.id]);
      }
    }
  };

  const handleWatchAd = () => {
    showAdForReward(() => {
      dispatch({ type: "RESTORE_LIFE_FROM_AD" });
    });
  };

  const handleWatchAdForGems = () => {
    setGemAnimationStartValue(gems);
    let rewardEarned = false;

    showAdForReward(
      () => {
        rewardEarned = true;
      },
      () => {
        if (rewardEarned) {
          dispatch({ type: "ADD_GEMS_FROM_AD" });
          setShowGemAnimation(true);
        }
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
      <InfoModal visible={openModal === "info"} onClose={() => setOpenModal(null)} />
      <LivesModal
        lives={lives}
        adLoaded={loaded}
        onWatchAd={handleWatchAd}
        visible={openModal === "lives"}
        lastLifeLostAt={lastLifeLostAt}
        onClose={() => setOpenModal(null)}
      />
      <HelpModal
        adLoaded={loaded}
        currentGems={gems}
        onClose={closeHelpModal}
        visible={openModal === "help"}
        showAnimation={showGemAnimation}
        canRemoveAnswer={canRemoveAnswer}
        onPurchaseHint={handlePurchaseHint}
        onWatchAdForGems={handleWatchAdForGems}
        animationStartValue={gemAnimationStartValue}
        onRemoveWrongAnswer={handleRemoveWrongAnswer}
      />
      <HintModal
        visible={openModal === "hint"}
        onClose={() => setOpenModal(null)}
        explanation={currentTaskExplanation}
      />
      <View
        style={{
          ...styles.itemsWrap,
          paddingTop: styles.itemsWrap.paddingTop + insets.top + ADDITIONAL_TOP_PADDING,
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
            animation={livesAnimation}
            size={styles.statisticsItem}
            onPress={() => setOpenModal("lives")}
          />
        </View>
        {/* Hint button row */}
        <Pressable style={styles.hintRow} onPress={() => setOpenModal("help")}>
          <ThemedText style={styles.hintEmoji}>💎</ThemedText>
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
              removedAnswerIds={removedAnswerIds}
              isFinalTaskInLevel={isFinalTaskInLevel}
            />
          )}
          {isCreateMathTask(currentTask) && (
            <CreateMathTask
              level={level}
              task={currentTask}
              maxLevelStep={maxLevelStep}
              removedAnswerIds={removedAnswerIds}
              isFinalTaskInLevel={isFinalTaskInLevel}
            />
          )}
          {isTextTask(currentTask) && (
            <TextTask
              level={level}
              task={currentTask}
              maxLevelStep={maxLevelStep}
              removedAnswerIds={removedAnswerIds}
              isFinalTaskInLevel={isFinalTaskInLevel}
              showAsMultipleChoice={showTextTaskAsMultipleChoice}
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
});
