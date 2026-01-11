import AdIcon from "@/assets/images/ad.png";
import Heart from "@/assets/images/heart.png";
import { AnimatedTimer } from "@/components/AnimatedTimer";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LIFE_RESTORE_INTERVAL_MS, MAX_LIVES } from "@/constants/GameSettings";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface LivesModalProps {
  lives: number;
  visible: boolean;
  adLoaded?: boolean;
  onClose: () => void;
  onWatchAd?: () => void;
  lastLifeLostAt: number | null;
}

const formatTime = (ms: number): string => {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export function LivesModal({ visible, onClose, lives, lastLifeLostAt, adLoaded, onWatchAd }: LivesModalProps) {
  const { text, tint } = useThemeColor();
  const lastLivesRef = useRef(lives);
  const isFullLives = lives >= MAX_LIVES;
  const livesAnimation = usePulseOnChange(lives);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [animatedHeartIndex, setAnimatedHeartIndex] = useState<number | null>(null);

  useEffect(() => {
    const previousLives = lastLivesRef.current;
    const delta = lives - previousLives;

    if (delta > 0) {
      setAnimatedHeartIndex(lives - 1);
    } else {
      setAnimatedHeartIndex(null);
    }

    lastLivesRef.current = lives;
  }, [lives]);

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
      const animateThis = animatedHeartIndex === i;
      hearts.push(
        <Animated.View key={i} style={animateThis ? livesAnimation : undefined}>
          <View style={[styles.heartContainer, !isFilled && styles.heartEmpty]}>
            <Image source={Heart} style={styles.heartImage} contentFit="contain" />
          </View>
        </Animated.View>
      );
    }
    return hearts;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          {/* Header with close button */}
          <View style={styles.header}>
            <ThemedText type="title">Dzīvības</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={text} />
            </TouchableOpacity>
          </View>

          {/* Hearts display */}
          <View style={[styles.heartsContainer]}>
            <Animated.View style={styles.heartsRow}>{renderHearts()}</Animated.View>
          </View>

          {/* Timer or full lives message */}
          {!isFullLives && lastLifeLostAt !== null ? (
            <View style={styles.timerSection}>
              <ThemedText style={styles.timerLabel}>Nākamā dzīvība pēc:</ThemedText>
              <AnimatedTimer time={formatTime(timeRemaining)} style={styles.timerValue} direction="down" />
            </View>
          ) : (
            <ThemedText style={styles.fullLivesText}>Visas dzīvības ir pilnas!</ThemedText>
          )}

          {/* Watch ad button */}
          {!isFullLives && onWatchAd && (
            <View style={{ ...styles.buttonContainer, marginBottom: 20 }}>
              <MainButton onPress={onWatchAd} disabled={!adLoaded} style={styles.compactButton}>
                <View style={styles.adButtonContent}>
                  {adLoaded ? (
                    <>
                      <Image source={AdIcon} style={styles.adIcon} contentFit="contain" />
                      <ThemedText type="defaultSemiBold" style={styles.buttonText} numberOfLines={1}>
                        Skatīties (+1
                      </ThemedText>
                      <Image source={Heart} style={styles.heartIconSmall} contentFit="contain" />
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        )
                      </ThemedText>
                    </>
                  ) : (
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      ⏳ Ielādē...
                    </ThemedText>
                  )}
                </View>
              </MainButton>
            </View>
          )}

          {/* Close button */}
          <View style={styles.buttonContainer}>
            <MainButton variant="secondary" onPress={onClose} style={styles.compactButton}>
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: text }]}>
                Aizvērt
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  heartsContainer: {
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heartsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  heartContainer: {
    width: 40,
    height: 40,
  },
  heartEmpty: {
    opacity: 0.3,
  },
  heartImage: {
    width: "100%",
    height: "100%",
  },
  timerSection: {
    alignItems: "center",
    gap: 4,
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  timerValue: {
    fontSize: 32,
    color: "#D81E5B",
    fontFamily: "BalooBhai2_700Bold",
    lineHeight: 40,
  },
  fullLivesText: {
    fontSize: 16,
    color: "#09E85E",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
  },
  adButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  adIcon: {
    width: 20,
    height: 20,
  },
  heartIconSmall: {
    width: 18,
    height: 18,
  },
  compactButton: {
    height: 55,
    width: 300,
  },
});
