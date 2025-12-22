import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MainButton } from "@/components/MainButton";
import { AnimatedTimer } from "@/components/AnimatedTimer";
import { MAX_LIVES, LIFE_RESTORE_INTERVAL_MS } from "@/constants/GameSettings";
import { Image } from "expo-image";
import { Modal, Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Heart from "@/assets/images/heart.png";
import AdIcon from "@/assets/images/ad.png";

interface LivesModalProps {
  visible: boolean;
  onClose: () => void;
  lives: number;
  lastLifeLostAt: number | null;
  adLoaded?: boolean;
  onWatchAd?: () => void;
}

const formatTime = (ms: number): string => {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export function LivesModal({ visible, onClose, lives, lastLifeLostAt, adLoaded, onWatchAd }: LivesModalProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const isFullLives = lives >= MAX_LIVES;

  useEffect(() => {
    if (!visible || isFullLives || lastLifeLostAt === null) {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const elapsed = Date.now() - lastLifeLostAt;
      const remaining = Math.max(0, LIFE_RESTORE_INTERVAL_MS - elapsed);
      setTimeRemaining(remaining);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [visible, lastLifeLostAt, isFullLives]);

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < MAX_LIVES; i++) {
      const isFilled = i < lives;
      hearts.push(
        <View key={i} style={[styles.heartContainer, !isFilled && styles.heartEmpty]}>
          <Image source={Heart} style={styles.heartImage} contentFit="contain" />
        </View>
      );
    }
    return hearts;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(event) => event.stopPropagation()}>
          <ThemedView style={styles.modalBox}>
            <ThemedText type="subtitle" style={styles.title}>
              Dzīvības
            </ThemedText>

            <View style={styles.heartsRow}>{renderHearts()}</View>

            <ThemedText style={styles.livesCount}>
              {lives} / {MAX_LIVES}
            </ThemedText>

            {!isFullLives && lastLifeLostAt !== null ? (
              <ThemedView style={styles.timerSection}>
                <ThemedText style={styles.timerLabel}>Nākamā dzīvība pēc:</ThemedText>
                <AnimatedTimer time={formatTime(timeRemaining)} style={styles.timerValue} />
              </ThemedView>
            ) : (
              <ThemedText style={styles.fullLivesText}>Visas dzīvības ir pilnas!</ThemedText>
            )}

            {!isFullLives && onWatchAd && (
              <MainButton onPress={onWatchAd} disabled={!adLoaded} style={styles.adButton}>
                <View style={styles.adButtonContent}>
                  {adLoaded ? (
                    <>
                      <Image source={AdIcon} style={styles.adIcon} contentFit="contain" />
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Skatīties reklāmu (+1
                      </ThemedText>
                      <Image source={Heart} style={styles.heartIcon} contentFit="contain" />
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        )
                      </ThemedText>
                    </>
                  ) : (
                    <>
                      <ActivityIndicator size="small" color="#166534" />
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Ielādē reklāmu...
                      </ThemedText>
                    </>
                  )}
                </View>
              </MainButton>
            )}

            <Pressable style={styles.modalCloseButton} onPress={onClose}>
              <ThemedText
                type="subtitle"
                darkColor="#ffffff"
                lightColor="#151414ff"
                style={styles.modalCloseButtonText}
              >
                Aizvērt
              </ThemedText>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 360,
  },
  modalBox: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
  },
  heartsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  heartContainer: {
    width: 36,
    height: 36,
  },
  heartEmpty: {
    opacity: 0.3,
  },
  heartImage: {
    width: "100%",
    height: "100%",
  },
  livesCount: {
    fontSize: 16,
    textAlign: "center",
  },
  timerSection: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  timerLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  timerValue: {
    fontSize: 28,
    color: "#D81E5B",
    fontFamily: "BalooBhai2_700Bold",
    lineHeight: 36,
  },
  fullLivesText: {
    fontSize: 16,
    color: "#09E85E",
    textAlign: "center",
    paddingVertical: 8,
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 8,
  },
  modalCloseButtonText: {
    // fontFamily: "BalooBhai2_500Medium",
    fontSize: 16,
  },
  adButton: {
    width: 280,
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
  buttonText: {
    fontSize: 20,
  },
});
