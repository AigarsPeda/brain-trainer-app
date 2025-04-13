import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { MainButton } from "@/components/MainButton";
import MathTaskWithResult from "@/components/mathTasks/MathTaskWithResult";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ALL_TASKS, LevelsEnum, TaskAnswerType, TaskOptionType } from "@/context/app.context.reducer";
import useAppContext from "@/hooks/useAppContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import FireColors from "@/assets/images/fire-colors.png";
import SadFace from "@/assets/images/sad-face.png";

export default function GameLevelScreen() {
  const {
    dispatch,
    state: {
      lives,
      results,
      availableLevels,
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

  const getCountOfCorrectAnswersAndWrong = (options: TaskOptionType[]) => {
    const currentTaskCorrectAnswers = options.filter((o) => o.isCorrect).length;
    const currentTaskWrongAnswers = options.filter((o) => !o.isCorrect).length;

    return {
      currentTaskWrongAnswers,
      currentTaskCorrectAnswers,
    };
  };

  const getCountOfLevelCorrectAnswersAndWrong = (answers: TaskAnswerType[]) => {
    const levelAnswerCorrectAnswers = answers.filter((o) => o.isCorrect).length;
    const levelAnswerWrongAnswers = answers.filter((o) => !o.isCorrect).length;

    return {
      levelAnswerWrongAnswers,
      levelAnswerCorrectAnswers,
    };
  };

  const { currentTaskCorrectAnswers, currentTaskWrongAnswers } = getCountOfCorrectAnswersAndWrong(
    currentTask?.options || []
  );

  const { levelAnswerCorrectAnswers, levelAnswerWrongAnswers } = getCountOfLevelCorrectAnswersAndWrong(
    levelAnswer?.answers || []
  );

  console.log("currentTaskCorrectAnswers", currentTaskCorrectAnswers);
  console.log("currentTaskWrongAnswers", currentTaskWrongAnswers);
  console.log("levelAnswerCorrectAnswers", levelAnswerCorrectAnswers);
  console.log("levelAnswerWrongAnswers", levelAnswerWrongAnswers);

  const isAllAnswersCorrect =
    currentTaskCorrectAnswers === levelAnswer?.answers.length && levelAnswerWrongAnswers === 0;

  console.log("isAllAnswersCorrect", isAllAnswersCorrect);

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
          {!isTaskChecked && (
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
                  fontSize: 20,
                }}
              >
                {isTaskChecked ? "Nākamais uzdevums" : "Pārbaudīt"}
              </ThemedText>
            </MainButton>
          )}
        </ThemedView>
      </ThemedView>

      {/* Render ShowResults when isTaskChecked is true */}
      {isTaskChecked && <ShowResults isAllAnswersCorrect={isAllAnswersCorrect} onNextTaskPress={goToNextLevel} />}
    </ThemedView>
  );
}

interface ShowResultsProps {
  isAllAnswersCorrect: boolean;
  onNextTaskPress: () => void;
}

function ShowResults({ onNextTaskPress, isAllAnswersCorrect }: ShowResultsProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const { background } = useThemeColor();

  const snapPoints = useMemo(() => ["35%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      sheetRef.current?.snapToIndex(0);
    }, 100);
  }, []);

  // This will hide the handle indicator at the top of the bottom sheet
  const EmptyHandle = () => <></>;

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        index={0}
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleComponent={EmptyHandle}
        handleStyle={{ height: 0 }}
      >
        <BottomSheetView style={{ ...styles.contentContainer, backgroundColor: background }}>
          {isAllAnswersCorrect ? (
            <ThemedView
              style={{
                marginBottom: 10,
              }}
            >
              <ThemedView
                style={{
                  gap: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ThemedText type="subtitle" style={{ textAlign: "left" }}>
                  Pareizi!
                </ThemedText>
                <ThemedView style={{ ...styles.imgContainer }}>
                  <Image style={styles.image} source={FireColors} contentFit="cover" transition={1000} />
                </ThemedView>
              </ThemedView>
              <ThemedText style={{ fontSize: 16, marginBottom: 20, textAlign: "left" }}>
                Visas atbildes ir pareizas! Turpini tā!
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView
              style={{
                marginBottom: 10,
              }}
            >
              <ThemedView
                style={{
                  gap: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ThemedText type="subtitle" style={{ textAlign: "left" }}>
                  Uzdevums pabeigts!
                </ThemedText>
                <ThemedView style={{ ...styles.imgContainer }}>
                  <Image style={styles.image} source={SadFace} contentFit="cover" transition={1000} />
                </ThemedView>
              </ThemedView>
              <ThemedText style={{ fontSize: 16, marginBottom: 20, textAlign: "left" }}>
                Daļa no atbildēm nav pareiza. Nākamreiz būs labāk!
              </ThemedText>
            </ThemedView>
          )}
          <ThemedView style={{ width: "100%", alignItems: "center" }}>
            <MainButton onPress={onNextTaskPress}>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 20,
                }}
              >
                Nākamais uzdevums
              </ThemedText>
            </MainButton>
          </ThemedView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
  },
  imgContainer: {
    width: 30,
    height: 30,
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
