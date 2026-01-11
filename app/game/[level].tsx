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
      gems,
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
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [isHintModalVisible, setIsHintModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isLivesModalVisible, setIsLivesModalVisible] = useState(false);
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [gemAnimationStartValue, setGemAnimationStartValue] = useState<number | undefined>(undefined);
  const [removedAnswerIds, setRemovedAnswerIds] = useState<number[]>([]);
  const [showTextTaskAsMultipleChoice, setShowTextTaskAsMultipleChoice] = useState(false);
  const { level } = useLocalSearchParams<"/game/[level]">() as { level: LevelsEnum };
  const { levelTasks, currentTask, maxLevelStep } = getLevelTaskData(level, currentTaskInLevel);

  const livesAnimation = usePulseOnChange(lives);

  const isFinalTaskInLevel = currentTask?.taskNumberInLevel === maxLevelStep;

  // Determine if remove answer feature can be used for current task
  const canRemoveAnswer = useMemo(() => {
    if (!currentTask) return false;

    if (isTextTask(currentTask)) {
      // Can always show multiple choice for text tasks (unless already showing)
      return !showTextTaskAsMultipleChoice;
    } else if (isMultiAnswerMathTask(currentTask)) {
      // Check if there are any incorrect options left to remove
      const remainingOptions = currentTask.options.filter((opt) => !removedAnswerIds.includes(opt.id));
      return remainingOptions.length > 1; // Need at least one to remove
    } else if (isCreateMathTask(currentTask)) {
      // Check if there are any incorrect numbers left to remove
      const remainingOptions = currentTask.options.filter((opt) => !removedAnswerIds.includes(opt.id));
      return remainingOptions.length > 2; // Need at least 2 numbers to solve + 1 to remove
    }
    return false;
  }, [currentTask, removedAnswerIds, showTextTaskAsMultipleChoice]);

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

  const closeInfoModal = () => {
    setIsInfoModalVisible(false);
  };

  const openLivesModal = () => {
    setIsLivesModalVisible(true);
  };

  const closeLivesModal = () => {
    setIsLivesModalVisible(false);
  };

  const openHelpModal = () => {
    setIsHelpModalVisible(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalVisible(false);
    setShowGemAnimation(false);
    setGemAnimationStartValue(undefined);
  };

  const closeHintModal = () => {
    setIsHintModalVisible(false);
  };

  const handlePurchaseHint = () => {
    dispatch({ type: "SPEND_GEMS", payload: HINT_COST });
    setIsHintModalVisible(true);
  };

  const handleRemoveWrongAnswer = () => {
    if (!currentTask) return;

    dispatch({ type: "SPEND_GEMS", payload: REMOVE_WRONG_ANSWER_COST });

    if (isTextTask(currentTask)) {
      // For text tasks, transform to multiple choice
      setShowTextTaskAsMultipleChoice(true);
    } else if (isMultiAnswerMathTask(currentTask)) {
      // For multi-answer tasks, find and remove one incorrect option
      const incorrectOptions = currentTask.options.filter(
        (option) => {
          const result = currentTask.result;
          // Simple check: does the equation equal the result?
          try {
            const evalResult = eval(option.equation.replace("×", "*").replace("÷", "/"));
            return evalResult !== result;
          } catch {
            return false;
          }
        }
      );

      if (incorrectOptions.length > 0) {
        const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
        setRemovedAnswerIds((prev) => [...prev, randomIncorrect.id]);
      }
    } else if (isCreateMathTask(currentTask)) {
      // For create math tasks, find and remove one incorrect number
      const correctNumbers = new Set<number>();
      const operation = currentTask.operation;
      const result = currentTask.result;

      // Find all correct number combinations
      currentTask.options.forEach((opt1) => {
        currentTask.options.forEach((opt2) => {
          const num1 = Number(opt1.number);
          const num2 = Number(opt2.number);
          let calcResult = 0;

          switch (operation) {
            case "+":
              calcResult = num1 + num2;
              break;
            case "-":
              calcResult = num1 - num2;
              break;
            case "×":
            case "*":
              calcResult = num1 * num2;
              break;
            case "÷":
            case "/":
              calcResult = num2 !== 0 ? num1 / num2 : NaN;
              break;
          }

          if (calcResult === result) {
            correctNumbers.add(num1);
            correctNumbers.add(num2);
          }
        });
      });

      // Find incorrect numbers (those not in any correct combination)
      const incorrectOptions = currentTask.options.filter(
        (option) => !correctNumbers.has(Number(option.number))
      );

      if (incorrectOptions.length > 0) {
        const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
        setRemovedAnswerIds((prev) => [...prev, randomIncorrect.id]);
      }
    }
  };

  const handleWatchAd = () => {
    showAdForReward(
      () => {
        dispatch({ type: "RESTORE_LIFE_FROM_AD" });
      }
      // () => {
      //   setIsLivesModalVisible(false);
      // }
    );
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
      <InfoModal visible={isInfoModalVisible} onClose={closeInfoModal} />
      <LivesModal
        lives={lives}
        adLoaded={loaded}
        onWatchAd={handleWatchAd}
        onClose={closeLivesModal}
        visible={isLivesModalVisible}
        lastLifeLostAt={lastLifeLostAt}
      />
      <HelpModal
        currentGems={gems}
        onClose={closeHelpModal}
        visible={isHelpModalVisible}
        onPurchaseHint={handlePurchaseHint}
        onRemoveWrongAnswer={handleRemoveWrongAnswer}
        canRemoveAnswer={canRemoveAnswer}
        adLoaded={loaded}
        onWatchAdForGems={handleWatchAdForGems}
        showAnimation={showGemAnimation}
        animationStartValue={gemAnimationStartValue}
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
        <Pressable style={styles.hintRow} onPress={openHelpModal}>
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
              isFinalTaskInLevel={isFinalTaskInLevel}
              removedAnswerIds={removedAnswerIds}
            />
          )}
          {isCreateMathTask(currentTask) && (
            <CreateMathTask
              level={level}
              task={currentTask}
              maxLevelStep={maxLevelStep}
              isFinalTaskInLevel={isFinalTaskInLevel}
              removedAnswerIds={removedAnswerIds}
            />
          )}
          {isTextTask(currentTask) && (
            <TextTask
              level={level}
              task={currentTask}
              maxLevelStep={maxLevelStep}
              isFinalTaskInLevel={isFinalTaskInLevel}
              showAsMultipleChoice={showTextTaskAsMultipleChoice}
              removedAnswerIds={removedAnswerIds}
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
