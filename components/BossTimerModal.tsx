import AdIcon from "@/assets/images/ad.png";
import Gem from "@/assets/images/gem.png";
import { AnimatedTimer } from "@/components/AnimatedTimer";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  BOSS_EXTRA_TIME_PURCHASE_LABEL,
  BOSS_RETRY_DESCRIPTION,
  BOSS_RETRY_PURCHASE_LABEL,
  BOSS_TIMER_ACTIVE_DESCRIPTION,
  BOSS_TIMER_EXPIRED_DESCRIPTION,
  BOSS_TIMER_PENDING_DESCRIPTION,
  GEMS_FROM_AD,
} from "@/constants/GameSettings";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatBossTimer } from "@/utils/bossLevel";
import { Image } from "expo-image";
import { Modal, StyleSheet, View } from "react-native";

interface BossTimerModalProps {
  visible: boolean;
  adLoaded?: boolean;
  currentGems: number;
  timeLeftMs: number;
  extraTimeCost: number;
  retryCost: number;
  mode: "timer" | "retry" | "expired";
  hasStarted?: boolean;
  hasExpired?: boolean;
  canRetryForFree?: boolean;
  retryWaitRemainingMs?: number;
  onBuyTime: () => void;
  onBuyRetry: () => void;
  onWatchAdForGems: () => void;
  onRetry: () => void;
  onGoHome: () => void;
  onClose: () => void;
}

export function BossTimerModal({
  visible,
  adLoaded = false,
  currentGems,
  timeLeftMs,
  extraTimeCost,
  retryCost,
  mode,
  hasStarted = false,
  hasExpired = false,
  canRetryForFree = false,
  retryWaitRemainingMs = 0,
  onBuyTime,
  onBuyRetry,
  onWatchAdForGems,
  onRetry,
  onGoHome,
  onClose,
}: BossTimerModalProps) {
  const { text, tint } = useThemeColor();
  const canAffordExtraTime = currentGems >= extraTimeCost;
  const canAffordRetry = currentGems >= retryCost;
  const shouldShowRetryControls = mode === "retry" || mode === "expired";
  const shouldShowTimeControls = mode === "timer" || mode === "expired";
  const showRetryWaitTimer = mode === "retry" && !canRetryForFree;
  const retryTitle = mode === "retry" ? "Atkārtot bossu" : hasExpired ? "Boss laiks beidzās!" : "Boss taimeris";
  const retryDescription =
    mode === "retry"
      ? BOSS_RETRY_DESCRIPTION
      : hasExpired
        ? BOSS_TIMER_EXPIRED_DESCRIPTION
        : hasStarted
          ? BOSS_TIMER_ACTIVE_DESCRIPTION
          : BOSS_TIMER_PENDING_DESCRIPTION;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={hasExpired ? onGoHome : onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          <ThemedText type="title" style={styles.title}>
            {retryTitle}
          </ThemedText>

          {showRetryWaitTimer ? (
            <View style={styles.waitContainer}>
              <ThemedText style={styles.waitLabel}>Bezmaksas atkārtojums pēc:</ThemedText>
              <AnimatedTimer
                time={formatBossTimer(retryWaitRemainingMs)}
                direction="countdown"
                style={styles.waitTimer}
                digitHeight={24}
              />
            </View>
          ) : null}

          {shouldShowTimeControls ? (
            <AnimatedTimer
              time={formatBossTimer(timeLeftMs)}
              direction="countdown"
              style={styles.timerValue}
              digitHeight={40}
              containerStyle={styles.timerWrap}
            />
          ) : null}

          <ThemedText style={styles.description}>{retryDescription}</ThemedText>

          <View style={styles.gemsRow}>
            <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
            <ThemedText type="defaultSemiBold">{currentGems}</ThemedText>
          </View>

          <View style={styles.buttonGroup}>
            {shouldShowTimeControls ? (
              canAffordExtraTime ? (
                <MainButton onPress={onBuyTime} style={styles.button}>
                  <View style={styles.purchaseContent}>
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      {BOSS_EXTRA_TIME_PURCHASE_LABEL}
                    </ThemedText>
                    <Image source={Gem} style={styles.smallIcon} contentFit="contain" />
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      {extraTimeCost}
                    </ThemedText>
                  </View>
                </MainButton>
              ) : (
                <MainButton onPress={onWatchAdForGems} disabled={!adLoaded} style={styles.button}>
                  <View style={styles.purchaseContent}>
                    {adLoaded && <Image source={AdIcon} style={styles.smallIcon} contentFit="contain" />}
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      {adLoaded ? `Skatīties (+${GEMS_FROM_AD}` : "⏳ Ielādē..."}
                    </ThemedText>
                    {adLoaded && <Image source={Gem} style={styles.smallIcon} contentFit="contain" />}
                    {adLoaded && (
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        )
                      </ThemedText>
                    )}
                  </View>
                </MainButton>
              )
            ) : null}

            {shouldShowRetryControls ? (
              canRetryForFree ? (
                <MainButton variant="secondary" onPress={onRetry} style={styles.button}>
                  <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                    {BOSS_RETRY_PURCHASE_LABEL}
                  </ThemedText>
                </MainButton>
              ) : canAffordRetry ? (
                <MainButton variant="secondary" onPress={onBuyRetry} style={styles.button}>
                  <View style={styles.purchaseContent}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                      {BOSS_RETRY_PURCHASE_LABEL}
                    </ThemedText>
                    <Image source={Gem} style={styles.smallIcon} contentFit="contain" />
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                      {retryCost}
                    </ThemedText>
                  </View>
                </MainButton>
              ) : (
                <MainButton onPress={onWatchAdForGems} disabled={!adLoaded} style={styles.button}>
                  <View style={styles.purchaseContent}>
                    {adLoaded && <Image source={AdIcon} style={styles.smallIcon} contentFit="contain" />}
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      {adLoaded ? `Skatīties (+${GEMS_FROM_AD}` : "⏳ Ielādē..."}
                    </ThemedText>
                    {adLoaded && <Image source={Gem} style={styles.smallIcon} contentFit="contain" />}
                    {adLoaded && (
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        )
                      </ThemedText>
                    )}
                  </View>
                </MainButton>
              )
            ) : null}

            {!hasExpired && mode !== "retry" ? (
              <MainButton variant="secondary" onPress={onClose} style={styles.button}>
                <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                  Aizvērt
                </ThemedText>
              </MainButton>
            ) : null}

            <MainButton variant="secondary" onPress={onGoHome} style={styles.button}>
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                Uz sākumu
              </ThemedText>
            </MainButton>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
  },
  timerValue: {
    fontSize: 34,
    lineHeight: 40,
    color: "#FFF7D6",
  },
  timerWrap: {
    marginTop: 10,
  },
  description: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 21,
  },
  gemsRow: {
    gap: 8,
    marginTop: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gemIcon: {
    width: 24,
    height: 24,
  },
  smallIcon: {
    width: 18,
    height: 18,
  },
  buttonGroup: {
    gap: 10,
    alignItems: "center",
  },
  button: {
    width: 300,
    height: 55,
  },
  purchaseContent: {
    gap: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
  },
  waitContainer: {
    gap: 4,
    alignItems: "center",
    marginTop: 2,
  },
  waitLabel: {
    fontSize: 14,
    opacity: 0.75,
    textAlign: "center",
  },
  waitTimer: {
    fontSize: 20,
    lineHeight: 24,
    color: "#F59E0B",
  },
});
