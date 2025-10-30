import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import CircleX from "@/assets/images/circle-x.png";
import FireColors from "@/assets/images/fire-colors.png";
import { StyleSheet } from "react-native";

interface LevelCompletionState {
  isCompleted: boolean;
  onGoHomePress: () => void;
  onNextLevelPress?: () => void;
  hasNextLevel?: boolean;
  title?: string;
  description?: string;
}

interface ShowResultsProps {
  onNextTaskPress: () => void;
  isAllAnswersCorrect: boolean;
  levelCompletionState?: LevelCompletionState;
}

export function ShowResults({ onNextTaskPress, isAllAnswersCorrect, levelCompletionState }: ShowResultsProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const { background, text } = useThemeColor();

  const snapPoints = useMemo(() => {
    return [levelCompletionState?.isCompleted ? "55%" : "35%"];
  }, [levelCompletionState?.isCompleted]);

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
        handleStyle={{ height: 0 }}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleComponent={EmptyHandle}
      >
        <BottomSheetView style={{ ...styles.contentContainer, backgroundColor: background }}>
          {isAllAnswersCorrect ? (
            <DisplayResults title="Pareizi!" description="Visas atbildes ir pareizas! Turpini tā!" />
          ) : (
            <DisplayResults
              isIncorrectAnswer
              title="Nepareizi!"
              description="Daļa no atbildēm nav pareizas. Nākamreiz būs labāk!"
            />
          )}

          {levelCompletionState?.isCompleted ? (
            <>
              <LevelCompletionNotice
                title={levelCompletionState.title}
                description={levelCompletionState.description}
                hasNextLevel={levelCompletionState.hasNextLevel}
              />
              <ThemedView style={styles.buttonsStack}>
                {levelCompletionState.onNextLevelPress && levelCompletionState.hasNextLevel ? (
                  <ThemedView style={styles.buttonContainer}>
                    <MainButton onPress={levelCompletionState.onNextLevelPress}>
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Nākamais līmenis
                      </ThemedText>
                    </MainButton>
                  </ThemedView>
                ) : null}
                <ThemedView style={[styles.buttonContainer, styles.lastButton]}>
                  <MainButton variant="secondary" onPress={levelCompletionState.onGoHomePress}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                      Uz sākumu
                    </ThemedText>
                  </MainButton>
                </ThemedView>
              </ThemedView>
            </>
          ) : (
            <ThemedView style={{ width: "100%", alignItems: "center" }}>
              <MainButton onPress={onNextTaskPress}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Nākamais uzdevums
                </ThemedText>
              </MainButton>
            </ThemedView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

interface DisplayResultsProps {
  title: string;
  description: string;
  isIncorrectAnswer?: boolean;
}

interface LevelCompletionNoticeProps {
  title?: string;
  description?: string;
  hasNextLevel?: boolean;
}

function LevelCompletionNotice({ title, description, hasNextLevel }: LevelCompletionNoticeProps) {
  const defaultTitle = title ?? "Līmenis pabeigts!";
  const defaultDescription =
    description ??
    (hasNextLevel
      ? "Nākamais līmenis ir atslēgts. Izvēlies, kā turpināt."
      : "Apsveicam! Tu esi pabeidzis visus pieejamos līmeņus.");

  return (
    <ThemedView style={styles.levelCompletionContainer}>
      <ThemedText type="subtitle" style={styles.levelCompletionTitle}>
        {defaultTitle}
      </ThemedText>
      <ThemedText style={styles.levelCompletionDescription}>{defaultDescription}</ThemedText>
    </ThemedView>
  );
}
function DisplayResults({ title, description, isIncorrectAnswer }: DisplayResultsProps) {
  const { incorrectAnswer } = useThemeColor();

  return (
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
        <ThemedText
          type="subtitle"
          style={{ textAlign: "left" }}
          darkColor={isIncorrectAnswer ? incorrectAnswer : undefined}
          lightColor={isIncorrectAnswer ? incorrectAnswer : undefined}
        >
          {title}
        </ThemedText>
        <ThemedView style={{ ...styles.imgContainer }}>
          <Image
            style={styles.image}
            source={isIncorrectAnswer ? CircleX : FireColors}
            contentFit="cover"
            transition={1000}
          />
        </ThemedView>
      </ThemedView>
      <ThemedText
        style={{
          fontSize: 16,
          marginBottom: 20,
          textAlign: "left",
        }}
      >
        {description}
      </ThemedText>
    </ThemedView>
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
  buttonsStack: {
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  lastButton: {
    marginBottom: 0,
  },
  levelCompletionContainer: {
    width: "100%",
    marginBottom: 16,
  },
  levelCompletionTitle: {
    textAlign: "left",
  },
  levelCompletionDescription: {
    fontSize: 16,
    marginTop: 4,
    textAlign: "left",
  },
  buttonText: {
    fontSize: 20,
  },
});
