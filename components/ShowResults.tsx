import AdIcon from "@/assets/images/ad.png";
import CircleX from "@/assets/images/circle-x.png";
import FireColors from "@/assets/images/fire-colors.png";
import Heart from "@/assets/images/heart.png";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, { BottomSheetView, useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LevelCompletionState {
  title?: string;
  description?: string;
  isCompleted: boolean;
  hasNextLevel?: boolean;
  onGoHomePress: () => void;
  onNextLevelPress?: () => void;
}

interface ShowResultsProps {
  lives?: number;
  adLoaded?: boolean;
  onGoHomePress?: () => void;
  onWatchAdPress?: () => void;
  onNextTaskPress: () => void;
  isAllAnswersCorrect: boolean;
  onTryAgainPress?: () => void;
  levelCompletionState?: LevelCompletionState;
}

export function ShowResults({
  lives,
  adLoaded,
  onGoHomePress,
  onWatchAdPress,
  onTryAgainPress,
  onNextTaskPress,
  isAllAnswersCorrect,
  levelCompletionState,
}: ShowResultsProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const { background, text } = useThemeColor();
  const { bottom: bottomInset } = useSafeAreaInsets();

  const snapPoints = useMemo(() => {
    return [levelCompletionState?.isCompleted ? "65%" : "55%"];
  }, [levelCompletionState?.isCompleted, lives]);

  // Slow down bottom sheet animations for better UX
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 600,
    easing: Easing.out(Easing.cubic),
  });

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
        handleComponent={EmptyHandle}
        bottomInset={-(bottomInset + 30)} // Todo fix hack to prevent extra space at bottom
        animationConfigs={animationConfigs}
        backgroundStyle={{ backgroundColor: background }}
        // onChange={handleSheetChange}
      >
        <BottomSheetView
          style={{ ...styles.contentContainer, backgroundColor: background, paddingBottom: 36 + bottomInset + 10 }}
        >
          {isAllAnswersCorrect ? (
            <DisplayResults title="Pareizi!" description="Visas atbildes ir pareizas! Turpini tā!" />
          ) : lives === 0 ? (
            <DisplayResults
              isIncorrectAnswer
              title="Dzīvības beigšās!"
              description="Tev vairs nav dzīvību. Skaties reklāmu, lai atgūtu dzīvību, vai atgriezies sākumā."
            />
          ) : (
            <DisplayResults
              isIncorrectAnswer
              title="Nepareizi!"
              description="Daļa no atbildēm nav pareizas. Nākamreiz būs labāk!"
            />
          )}

          {lives === 0 ? (
            <ThemedView style={styles.buttonsStack}>
              {onWatchAdPress ? (
                <ThemedView style={styles.buttonContainer}>
                  <MainButton onPress={onWatchAdPress} disabled={!adLoaded}>
                    <View style={styles.adButtonContent}>
                      {adLoaded && <Image source={AdIcon} style={styles.adIcon} contentFit="contain" />}
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        {adLoaded ? "Skatīties reklāmu (+1" : "⏳ Ielādē reklāmu..."}
                      </ThemedText>
                      {adLoaded && <Image source={Heart} style={styles.heartIcon} contentFit="contain" />}
                      {adLoaded && (
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                          )
                        </ThemedText>
                      )}
                    </View>
                  </MainButton>
                </ThemedView>
              ) : null}
              {onGoHomePress ? (
                <ThemedView style={[styles.buttonContainer, styles.lastButton]}>
                  <MainButton variant="secondary" onPress={onGoHomePress}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                      Uz sākumu
                    </ThemedText>
                  </MainButton>
                </ThemedView>
              ) : null}
            </ThemedView>
          ) : levelCompletionState?.isCompleted && isAllAnswersCorrect ? (
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
          ) : isAllAnswersCorrect ? (
            <ThemedView style={{ width: "100%", alignItems: "center" }}>
              <MainButton onPress={onNextTaskPress}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Nākamais uzdevums
                </ThemedText>
              </MainButton>
            </ThemedView>
          ) : onTryAgainPress ? (
            <ThemedView style={{ width: "100%", alignItems: "center" }}>
              <MainButton onPress={onTryAgainPress}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Mēģini vēlreiz
                </ThemedText>
              </MainButton>
            </ThemedView>
          ) : null}
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
    <ThemedView>
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
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 36,
    gap: 24,
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
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  lastButton: {},
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
  adButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adIcon: {
    width: 28,
    height: 28,
  },
  heartIcon: {
    width: 22,
    height: 22,
  },
});
