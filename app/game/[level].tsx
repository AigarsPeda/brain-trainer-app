import { BackgroundPattern } from "@/components/BackgroundPattern";
import { GameLevelHeader } from "@/components/gameLevel/GameLevelHeader";
import { GameLevelModalLayer } from "@/components/gameLevel/GameLevelModalLayer";
import { GameLevelTaskStage } from "@/components/gameLevel/GameLevelTaskStage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGameLevelScreenModel } from "@/hooks/useGameLevelScreenModel";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar, StyleSheet, View } from "react-native";

export default function GameLevelScreen() {
  const model = useGameLevelScreenModel();

  if (model.status !== "ready") {
    return (
      <ThemedView>
        <ThemedText>{model.message}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <LinearGradient
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      colors={model.backgroundColors as [string, string, ...string[]]}
      style={styles.gradient}
    >
      <BackgroundPattern />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={model.theme === "dark" ? "light-content" : "dark-content"}
      />
      <GameLevelModalLayer
        adLoaded={model.loaded}
        bossLevel={model.bossLevel}
        bossModalMode={model.bossModalMode}
        bossRetryWaitRemainingMs={model.bossRetryWaitRemainingMs}
        bossTimerExpired={model.bossTimerExpired}
        bossTimerModalVisible={model.isBossTimerModalOpen}
        bossTimerStarted={model.bossTimerStarted}
        bossTimeLeftMs={model.bossTimeLeftMs}
        canRemoveAnswer={model.canRemoveAnswer}
        canRetryBossForFree={model.canRetryBossForFree}
        currentGems={model.currentGems}
        explanation={model.currentTaskExplanation}
        gemAnimationStartValue={model.gemAnimationStartValue}
        helpVisible={model.helpVisible}
        hintVisible={model.hintVisible}
        infoVisible={model.infoVisible}
        lastLifeLostAt={model.lastLifeLostAt}
        lives={model.lives}
        livesVisible={model.livesModalVisible}
        onBuyBossExtraTime={model.handleBuyBossExtraTime}
        onBuyBossRetry={model.handleBuyBossRetry}
        onCloseAll={model.hideAllModals}
        onCloseHelp={model.hideHelpModal}
        onGoHome={model.handleGoHome}
        onPurchaseHint={model.handlePurchaseHint}
        onRemoveWrongAnswer={model.handleRemoveWrongAnswer}
        onRetryBoss={model.retryBoss}
        onWatchAd={model.handleWatchAd}
        onWatchAdForGems={model.handleWatchAdForGems}
        showGemAnimation={model.showGemAnimation}
      />
      <View
        style={{
          ...styles.itemsWrap,
          paddingTop: styles.itemsWrap.paddingTop + model.itemsWrapPaddingTop,
          paddingBottom: model.itemsWrapPaddingBottom,
        }}
      >
        <GameLevelHeader
          bossLevel={model.bossLevel}
          bossTimerProgress={model.bossTimerProgress}
          bossTimerStarted={model.bossTimerStarted}
          bossTimeLeftMs={model.bossTimeLeftMs}
          currentLevelStep={model.effectiveTaskInLevel}
          lives={model.lives}
          livesAnimation={model.livesAnimation}
          maxLevelStep={model.maxLevelStep}
          onBackPress={model.handleGoBack}
          onHelpPress={model.onOpenHelp}
          onLivesPress={model.onOpenLives}
          onOpenBossModal={model.onOpenBossModal}
        />
        <GameLevelTaskStage
          currentTask={model.currentTask}
          getLevelCompletionDurationMs={model.getLevelCompletionDurationMs}
          isBossLevel={model.bossLevel}
          isFinalTaskInLevel={model.isFinalTaskInLevel}
          level={model.levelParam}
          maxLevelStep={model.maxLevelStep}
          removedAnswerIds={model.removedAnswerIds}
          showTextTaskAsMultipleChoice={model.showTextTaskAsMultipleChoice}
          taskSession={model.taskSession}
          taskKey={model.taskKey}
        />
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
});
