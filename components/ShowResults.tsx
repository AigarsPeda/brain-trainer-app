import AdIcon from "@/assets/images/ad.png";
import CircleX from "@/assets/images/circle-x.png";
import FireColors from "@/assets/images/fire-colors.png";
import Heart from "@/assets/images/heart.png";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatCompletionTime, LevelFeedbackSummary } from "@/utils/levelFeedback";
import BottomSheet, { BottomSheetScrollView, useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useMemo, useRef } from "react";
import { Modal, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
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
  summary?: LevelFeedbackSummary;
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
  failureState?: {
    title: string;
    description: string;
    retryLabel?: string;
    currentGems?: number;
  };
}

export function ShowResults({
  lives,
  adLoaded,
  failureState,
  onGoHomePress,
  onWatchAdPress,
  onTryAgainPress,
  onNextTaskPress,
  isAllAnswersCorrect,
  levelCompletionState,
}: ShowResultsProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const { background, text } = useThemeColor();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isCompletedLevelSuccess = !!(levelCompletionState?.isCompleted && isAllAnswersCorrect);

  const snapPoints = useMemo(() => {
    return [levelCompletionState?.isCompleted ? "65%" : "55%"];
  }, [levelCompletionState?.isCompleted]);

  // Slow down bottom sheet animations for better UX
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 600,
    easing: Easing.out(Easing.cubic),
  });

  // This will hide the handle indicator at the top of the bottom sheet
  const EmptyHandle = () => <></>;

  if (isCompletedLevelSuccess && levelCompletionState?.summary) {
    const summaryMaxHeight = Math.max(320, windowHeight - topInset - 20);

    return (
      <Modal animationType="fade" presentationStyle="overFullScreen" statusBarTranslucent transparent visible>
        <GestureHandlerRootView style={styles.container}>
          <View style={styles.summaryOverlay}>
            <ThemedView
              style={[
                styles.summarySheet,
                {
                  backgroundColor: background,
                  maxHeight: summaryMaxHeight,
                  paddingBottom: Math.max(16, bottomInset),
                },
              ]}
            >
              <View style={styles.summaryHandle} />
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.summaryScrollContent}
              >
                <LevelCompletionNotice
                  title={levelCompletionState.title}
                  description={levelCompletionState.description}
                  hasNextLevel={levelCompletionState.hasNextLevel}
                  summary={levelCompletionState.summary}
                  showSuccessState
                />
              </ScrollView>

              <ThemedView style={styles.summaryFooter}>
                {levelCompletionState.onNextLevelPress && levelCompletionState.hasNextLevel ? (
                  <ThemedView style={styles.buttonContainer}>
                    <MainButton onPress={levelCompletionState.onNextLevelPress}>
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Nākamais līmenis
                      </ThemedText>
                    </MainButton>
                  </ThemedView>
                ) : null}
                <ThemedView style={styles.buttonContainer}>
                  <MainButton variant="secondary" onPress={levelCompletionState.onGoHomePress}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                      Uz sākumu
                    </ThemedText>
                  </MainButton>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </View>
        </GestureHandlerRootView>
      </Modal>
    );
  }

  return (
    <Modal animationType="fade" presentationStyle="overFullScreen" statusBarTranslucent transparent visible>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          index={0}
          ref={sheetRef}
          snapPoints={snapPoints}
          handleStyle={{ height: 0 }}
          enableDynamicSizing={false}
          handleComponent={EmptyHandle}
          animationConfigs={animationConfigs}
          backgroundStyle={{ backgroundColor: background }}
        >
          <BottomSheetScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            style={{ backgroundColor: background }}
            contentContainerStyle={{ ...styles.contentContainer, paddingBottom: 20 + bottomInset }}
          >
            {!isCompletedLevelSuccess && isAllAnswersCorrect ? (
              <DisplayResults title="Pareizi!" description="Visas atbildes ir pareizas! Turpini tā!" />
            ) : failureState ? (
              <DisplayResults isIncorrectAnswer title={failureState.title} description={failureState.description} />
            ) : lives === 0 ? (
              <DisplayResults
                isIncorrectAnswer
                title="Dzīvības beigšās!"
                description="Tev vairs nav dzīvību. Skaties reklāmu, lai atgūtu dzīvību, vai atgriezies sākumā."
              />
            ) : !isCompletedLevelSuccess ? (
              <DisplayResults
                isIncorrectAnswer
                title="Nepareizi!"
                description="Daļa no atbildēm nav pareizas. Nākamreiz būs labāk!"
              />
            ) : null}

            {failureState ? (
              <ThemedView style={styles.buttonsStack}>
                {failureState.currentGems !== undefined ? (
                  <ThemedText style={styles.failureMeta}>Tev ir {failureState.currentGems} 💎</ThemedText>
                ) : null}
                {onTryAgainPress ? (
                  <ThemedView style={styles.buttonContainer}>
                    <MainButton onPress={onTryAgainPress}>
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        {failureState.retryLabel ?? "Mēģini vēlreiz"}
                      </ThemedText>
                    </MainButton>
                  </ThemedView>
                ) : null}
                {onGoHomePress ? (
                  <ThemedView style={styles.buttonContainer}>
                    <MainButton variant="secondary" onPress={onGoHomePress}>
                      <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                        Uz sākumu
                      </ThemedText>
                    </MainButton>
                  </ThemedView>
                ) : null}
              </ThemedView>
            ) : lives === 0 ? (
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
                  summary={levelCompletionState.summary}
                  showSuccessState
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
              <ThemedView style={styles.singleButtonWrap}>
                <MainButton onPress={onNextTaskPress}>
                  <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                    Nākamais uzdevums
                  </ThemedText>
                </MainButton>
              </ThemedView>
            ) : onTryAgainPress ? (
              <ThemedView style={styles.singleButtonWrap}>
                <MainButton onPress={onTryAgainPress}>
                  <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                    Mēģini vēlreiz
                  </ThemedText>
                </MainButton>
              </ThemedView>
            ) : null}
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
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
  summary?: LevelFeedbackSummary;
  showSuccessState?: boolean;
}

function LevelCompletionNotice({
  title,
  description,
  hasNextLevel,
  summary,
  showSuccessState = false,
}: LevelCompletionNoticeProps) {
  const { border, tint } = useThemeColor();
  const defaultTitle = title ?? "Līmenis pabeigts!";
  const defaultDescription =
    description ??
    (hasNextLevel
      ? "Nākamais līmenis ir atslēgts. Izvēlies, kā turpināt."
      : "Apsveicam! Tu esi pabeidzis visus pieejamos līmeņus.");

  return (
    <ThemedView style={styles.levelCompletionContainer}>
      {showSuccessState ? (
        <ThemedView style={styles.successHeader}>
          <ThemedText type="subtitle" style={styles.successTitle}>
            Pareizi!
          </ThemedText>
          <ThemedView style={styles.imgContainer}>
            <Image style={styles.image} source={FireColors} contentFit="cover" transition={1000} />
          </ThemedView>
        </ThemedView>
      ) : null}
      <ThemedText type="subtitle" style={styles.levelCompletionTitle}>
        {defaultTitle}
      </ThemedText>
      <ThemedText style={styles.levelCompletionDescription}>{defaultDescription}</ThemedText>
      {summary ? (
        <ThemedView style={[styles.feedbackCard, { borderColor: border }]}>
          <ThemedView style={styles.feedbackStatsGrid}>
            <FeedbackStat label="Precizitāte" value={`${summary.accuracy}%`} accentColor={tint} />
          </ThemedView>

          <ThemedView style={styles.feedbackSection}>
            <ThemedText type="defaultSemiBold" style={styles.feedbackSectionTitle}>
              Pabeigšanas laiks
            </ThemedText>
            <ThemedText style={styles.feedbackBody}>{formatCompletionTime(summary.completionTimeMs)}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.feedbackSection}>
            <ThemedText type="defaultSemiBold" style={styles.feedbackSectionTitle}>
              Vājākās vietas
            </ThemedText>
            {summary.weakTaskTypes.length > 0 ? (
              summary.weakTaskTypes.map((weakTaskType) => (
                <ThemedView
                  key={weakTaskType.taskType}
                  style={[styles.feedbackChip, { borderColor: border, backgroundColor: `${tint}12` }]}
                >
                  <ThemedText style={styles.feedbackChipText}>
                    {weakTaskType.label}: {weakTaskType.averageScore}%
                  </ThemedText>
                </ThemedView>
              ))
            ) : (
              <ThemedText style={styles.feedbackBody}>Neviena izteikta vājā vieta. Līmenis bija stabils.</ThemedText>
            )}
          </ThemedView>

          <ThemedView style={styles.feedbackSection}>
            <ThemedText type="defaultSemiBold" style={styles.feedbackSectionTitle}>
              Ieteicamais nākamais solis
            </ThemedText>
            <ThemedText style={styles.feedbackBody}>{summary.recommendedNextStep}</ThemedText>
          </ThemedView>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

interface FeedbackStatProps {
  label: string;
  value: string;
  accentColor: string;
}

function FeedbackStat({ label, value, accentColor }: FeedbackStatProps) {
  // const { border } = useThemeColor();

  return (
    <ThemedView style={[styles.feedbackStat]}>
      <ThemedText style={styles.feedbackStatLabel}>{label}</ThemedText>
      <ThemedText type="title" style={[styles.feedbackStatValue, { color: accentColor }]}>
        {value}
      </ThemedText>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 18,
  },
  summaryOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  summarySheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  summaryHandle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: 10,
  },
  summaryScrollContent: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  summaryFooter: {
    gap: 10,
    width: "100%",
    paddingTop: 10,
    paddingHorizontal: 24,
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
  failureMeta: {
    fontSize: 15,
    opacity: 0.8,
    textAlign: "center",
  },
  singleButtonWrap: {
    width: "100%",
    alignItems: "center",
  },
  lastButton: {},
  levelCompletionContainer: {
    width: "100%",
    marginBottom: 8,
  },
  successHeader: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  successTitle: {
    textAlign: "left",
  },
  levelCompletionTitle: {
    textAlign: "left",
  },
  levelCompletionDescription: {
    fontSize: 15,
    marginTop: 4,
    textAlign: "left",
  },
  feedbackCard: {
    gap: 12,
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  feedbackStatsGrid: {
    gap: 10,
    flexDirection: "row",
  },
  feedbackStat: {
    flex: 1,
    // paddingVertical: 12,
  },
  feedbackStatLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  feedbackStatValue: {
    // marginTop: 4,
  },
  feedbackSection: {
    gap: 6,
  },
  feedbackSectionTitle: {
    fontSize: 15,
  },
  feedbackBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  feedbackChipText: {
    fontSize: 13,
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
