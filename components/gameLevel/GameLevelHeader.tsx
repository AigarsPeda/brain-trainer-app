import Close from "@/assets/images/close.png";
import Heart from "@/assets/images/heart.png";
import { BossTimerBar } from "@/components/BossTimerBar";
import Progressbar from "@/components/Progressbar";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedText } from "@/components/ThemedText";
import { formatBossTimer } from "@/utils/bossLevel";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type GameLevelHeaderProps = {
  bossLevel: boolean;
  bossTimerProgress: number;
  bossTimerStarted: boolean;
  bossTimeLeftMs: number;
  currentLevelStep: number;
  lives: number;
  livesAnimation: StyleProp<ViewStyle>;
  maxLevelStep: number;
  onBackPress: () => void;
  onHelpPress: () => void;
  onLivesPress: () => void;
  onOpenBossModal: () => void;
};

export function GameLevelHeader({
  bossLevel,
  bossTimerProgress,
  bossTimerStarted,
  bossTimeLeftMs,
  currentLevelStep,
  lives,
  livesAnimation,
  maxLevelStep,
  onBackPress,
  onHelpPress,
  onLivesPress,
  onOpenBossModal,
}: GameLevelHeaderProps) {
  return (
    <>
      <View style={[styles.view, bossLevel && styles.bossHeaderRow]}>
        <StatisticsItem src={Close} onPress={onBackPress} />
        {bossLevel ? (
          <BossTimerBar
            timeLabel={formatBossTimer(bossTimeLeftMs)}
            progress={bossTimerProgress}
            onPress={onOpenBossModal}
          />
        ) : (
          <Progressbar maxLevelStep={maxLevelStep} currentLevelStep={currentLevelStep} />
        )}
        {!bossLevel && (
          <StatisticsItem
            src={Heart}
            stat={lives}
            animation={livesAnimation}
            size={styles.statisticsItem}
            onPress={onLivesPress}
          />
        )}
      </View>
      {bossLevel ? (
        <View style={styles.bossNoticeRow}>
          <ThemedText style={styles.bossNoticeText} type="subtitle">
            {bossTimerStarted
              ? "Boss līmenis: laiks iet, kļūdīties nedrīkst"
              : "Boss līmenis: taimeris sāksies pēc pirmās atbildes"}
          </ThemedText>
        </View>
      ) : (
        <Pressable style={styles.hintRow} onPress={onHelpPress}>
          <ThemedText style={styles.hintEmoji}>💎</ThemedText>
          <ThemedText style={styles.hintText} type="subtitle">
            Palīdzība
          </ThemedText>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  bossHeaderRow: {
    gap: 2,
    justifyContent: "flex-start",
  },
  statisticsItem: {
    width: 36,
    height: 36,
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
  bossNoticeRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  bossNoticeText: {
    fontSize: 14,
    opacity: 0.9,
    color: "#FFF7D6",
  },
});
