import { BossTimerModal } from "@/components/BossTimerModal";
import { HelpModal } from "@/components/HelpModal";
import { HintModal } from "@/components/HintModal";
import { InfoModal } from "@/components/InfoModal";
import { LivesModal } from "@/components/LivesModal";
import { BOSS_EXTRA_TIME_COST, BOSS_RETRY_COST } from "@/constants/GameSettings";
import { MathExplanation } from "@/utils/mathExplanations";

type GameLevelModalLayerProps = {
  adLoaded: boolean;
  bossLevel: boolean;
  bossModalMode: "timer" | "retry" | "expired";
  bossRetryWaitRemainingMs: number;
  bossTimerExpired: boolean;
  bossTimerModalVisible: boolean;
  bossTimerStarted: boolean;
  bossTimeLeftMs: number;
  canRemoveAnswer: boolean;
  canRetryBossForFree: boolean;
  currentGems: number;
  explanation: MathExplanation | null;
  gemAnimationStartValue?: number;
  helpVisible: boolean;
  hintVisible: boolean;
  infoVisible: boolean;
  lastLifeLostAt: number | null;
  lives: number;
  livesVisible: boolean;
  onBuyBossExtraTime: () => void;
  onBuyBossRetry: () => void;
  onCloseAll: () => void;
  onCloseHelp: () => void;
  onGoHome: () => void;
  onPurchaseHint: () => void;
  onRemoveWrongAnswer: () => void;
  onRetryBoss: () => void;
  onWatchAd: () => void;
  onWatchAdForGems: () => void;
  showGemAnimation: boolean;
};

export function GameLevelModalLayer({
  adLoaded,
  bossLevel,
  bossModalMode,
  bossRetryWaitRemainingMs,
  bossTimerExpired,
  bossTimerModalVisible,
  bossTimerStarted,
  bossTimeLeftMs,
  canRemoveAnswer,
  canRetryBossForFree,
  currentGems,
  explanation,
  gemAnimationStartValue,
  helpVisible,
  hintVisible,
  infoVisible,
  lastLifeLostAt,
  lives,
  livesVisible,
  onBuyBossExtraTime,
  onBuyBossRetry,
  onCloseAll,
  onCloseHelp,
  onGoHome,
  onPurchaseHint,
  onRemoveWrongAnswer,
  onRetryBoss,
  onWatchAd,
  onWatchAdForGems,
  showGemAnimation,
}: GameLevelModalLayerProps) {
  return (
    <>
      <InfoModal visible={infoVisible} onClose={onCloseAll} />
      <LivesModal
        lives={lives}
        adLoaded={adLoaded}
        onWatchAd={onWatchAd}
        visible={livesVisible}
        lastLifeLostAt={lastLifeLostAt}
        onClose={onCloseAll}
      />
      <HelpModal
        adLoaded={adLoaded}
        currentGems={currentGems}
        onClose={onCloseHelp}
        visible={!bossLevel && helpVisible}
        showAnimation={showGemAnimation}
        canRemoveAnswer={canRemoveAnswer}
        onPurchaseHint={onPurchaseHint}
        onWatchAdForGems={onWatchAdForGems}
        animationStartValue={gemAnimationStartValue}
        onRemoveWrongAnswer={onRemoveWrongAnswer}
      />
      <HintModal visible={!bossLevel && hintVisible} onClose={onCloseAll} explanation={explanation} />
      <BossTimerModal
        visible={bossLevel && bossTimerModalVisible}
        adLoaded={adLoaded}
        currentGems={currentGems}
        timeLeftMs={bossTimeLeftMs}
        extraTimeCost={BOSS_EXTRA_TIME_COST}
        retryCost={BOSS_RETRY_COST}
        mode={bossModalMode}
        hasStarted={bossTimerStarted}
        hasExpired={bossTimerExpired}
        canRetryForFree={canRetryBossForFree}
        retryWaitRemainingMs={bossRetryWaitRemainingMs}
        onBuyTime={onBuyBossExtraTime}
        onBuyRetry={onBuyBossRetry}
        onWatchAdForGems={onWatchAdForGems}
        onRetry={onRetryBoss}
        onGoHome={onGoHome}
        onClose={onCloseAll}
      />
    </>
  );
}
