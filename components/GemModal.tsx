import AdIcon from "@/assets/images/ad.png";
import Gem from "@/assets/images/gem.png";
import { AnimatedTimer } from "@/components/AnimatedTimer";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GEMS_FROM_AD } from "@/constants/GameSettings";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface GemModalProps {
  visible: boolean;
  adLoaded?: boolean;
  onClose: () => void;
  currentGems: number;
  onWatchAd?: () => void;
  showAnimation?: boolean;
  animationStartValue?: number;
}

export function GemModal({
  visible,
  onClose,
  adLoaded,
  onWatchAd,
  currentGems,
  animationStartValue,
  showAnimation = false,
}: GemModalProps) {
  const { text, tint } = useThemeColor();
  const [animatedGems, setAnimatedGems] = useState(currentGems);
  const animationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (showAnimation && visible && animationStartValue !== undefined) {
      const targetGems = currentGems;
      const startGems = animationStartValue;

      setAnimatedGems(startGems);

      const startDelay = setTimeout(() => {
        let currentValue = startGems;
        const step = 1;
        const interval = 50;

        animationTimerRef.current = setInterval(() => {
          currentValue += step;
          if (currentValue >= targetGems) {
            setAnimatedGems(targetGems);
            if (animationTimerRef.current) {
              clearInterval(animationTimerRef.current);
            }
          } else {
            setAnimatedGems(currentValue);
          }
        }, interval);
      }, 300);

      return () => {
        clearTimeout(startDelay);
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
        }
      };
    } else {
      setAnimatedGems(currentGems);
    }

    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [showAnimation, visible, currentGems, animationStartValue]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          <View style={styles.header}>
            <ThemedText type="title">Dimanti</ThemedText>
            {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={text} />
            </TouchableOpacity> */}
          </View>

          <View style={[styles.gemCountContainer]}>
            <Image source={Gem} style={styles.gemIconLarge} contentFit="contain" />
            {showAnimation ? (
              <AnimatedTimer
                digitHeight={40}
                direction="countup"
                style={styles.gemCountText}
                time={animatedGems.toString()}
              />
            ) : (
              <ThemedText type="title">{currentGems}</ThemedText>
            )}
          </View>

          <ThemedText style={styles.description}>
            Izmanto dimantus, lai iegādātos papildinājumus spēlē. Nopelni vairāk dimantu, skatoties reklāmas!
          </ThemedText>

          {onWatchAd && (
            <View style={{ ...styles.buttonContainer, marginBottom: 20 }}>
              <MainButton onPress={onWatchAd} disabled={!adLoaded} style={styles.compactButton}>
                <View style={styles.adButtonContent}>
                  {adLoaded && <Image source={AdIcon} style={styles.adIcon} contentFit="contain" />}
                  <ThemedText type="defaultSemiBold" style={styles.buttonText} numberOfLines={1}>
                    {adLoaded ? `Skatīties (+${GEMS_FROM_AD}` : "⏳ Ielādē..."}
                  </ThemedText>
                  {adLoaded && <Image source={Gem} style={styles.gemIconSmall} contentFit="contain" />}
                  {adLoaded && (
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      )
                    </ThemedText>
                  )}
                </View>
              </MainButton>
            </View>
          )}

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
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    maxHeight: "90%",
    borderRadius: 20,
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    padding: 4,
  },
  gemCountContainer: {
    gap: 12,
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gemIconLarge: {
    width: 48,
    height: 48,
  },
  gemCountText: {
    fontSize: 34,
    lineHeight: 44,
    fontFamily: "BalooBhai2_700Bold",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
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
    gap: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  adIcon: {
    width: 20,
    height: 20,
  },
  gemIconSmall: {
    width: 18,
    height: 18,
  },
  compactButton: {
    height: 55,
    width: 300,
  },
});
