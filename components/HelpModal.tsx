import AdIcon from "@/assets/images/ad.png";
import Bulb from "@/assets/images/bulb.png";
import CloseRed from "@/assets/images/close_red.png";
import Gem from "@/assets/images/gem.png";
import { AnimatedTimer } from "@/components/AnimatedTimer";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GEMS_FROM_AD, HINT_COST, REMOVE_WRONG_ANSWER_COST } from "@/constants/GameSettings";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
  currentGems: number;
  onPurchaseHint: () => void;
  onRemoveWrongAnswer?: () => void;
  canRemoveAnswer?: boolean;
  adLoaded?: boolean;
  onWatchAdForGems?: () => void;
  showAnimation?: boolean;
  animationStartValue?: number;
}

export function HelpModal({
  visible,
  onClose,
  currentGems,
  onPurchaseHint,
  onRemoveWrongAnswer,
  canRemoveAnswer = false,
  adLoaded = false,
  onWatchAdForGems,
  showAnimation = false,
  animationStartValue,
}: HelpModalProps) {
  const { text, tint } = useThemeColor();
  const canAffordHint = currentGems >= HINT_COST;
  const canAffordRemoveAnswer = currentGems >= REMOVE_WRONG_ANSWER_COST;
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
            <ThemedText type="title">Palīdzība</ThemedText>
          </View>

          <View style={styles.gemsDisplay}>
            <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
            {showAnimation ? (
              <AnimatedTimer
                digitHeight={42}
                direction="countup"
                style={styles.gemCountText}
                time={animatedGems.toString()}
              />
            ) : (
              <ThemedText type="subtitle">{currentGems}</ThemedText>
            )}
          </View>

          <ThemedText style={styles.description}>Izmanto dimantus, lai iegūtu palīdzību risinot uzdevumus!</ThemedText>

          <View style={styles.optionsContainer}>
            {/* Remove Wrong Answer Option */}
            {canRemoveAnswer && (
              <View style={styles.optionCard}>
                <View style={styles.optionHeader}>
                  <View style={styles.optionTitleContainer}>
                    <Image source={CloseRed} style={styles.closeRedIcon} contentFit="contain" />
                    <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                      Noņemt atbildi
                    </ThemedText>
                  </View>
                  <View style={styles.costBadge}>
                    <Image source={Gem} style={styles.costGemIcon} contentFit="contain" />
                    <ThemedText type="defaultSemiBold" style={styles.costText}>
                      {REMOVE_WRONG_ANSWER_COST}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.optionDescription}>Noņem vienu nepareizu atbildi no uzdevuma</ThemedText>
                <View style={styles.buttonWrapper}>
                  {canAffordRemoveAnswer ? (
                    <MainButton
                      onPress={() => {
                        onRemoveWrongAnswer?.();
                        onClose();
                      }}
                      style={styles.purchaseButton}
                    >
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Iegādāties
                      </ThemedText>
                    </MainButton>
                  ) : onWatchAdForGems ? (
                    <MainButton onPress={onWatchAdForGems} disabled={!adLoaded} style={styles.purchaseButton}>
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
                  ) : (
                    <MainButton disabled onPress={() => {}} style={styles.purchaseButton}>
                      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Nav pietiekami daudz 💎
                      </ThemedText>
                    </MainButton>
                  )}
                </View>
              </View>
            )}

            {/* Hint Option */}
            <View style={styles.optionCard}>
              <View style={styles.optionHeader}>
                <View style={styles.optionTitleContainer}>
                  <Image source={Bulb} style={styles.bulbIcon} contentFit="contain" />
                  <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                    Skaidrojums
                  </ThemedText>
                </View>
                <View style={styles.costBadge}>
                  <Image source={Gem} style={styles.costGemIcon} contentFit="contain" />
                  <ThemedText type="defaultSemiBold" style={styles.costText}>
                    {HINT_COST}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.optionDescription}>
                Aplūko detalizētu skaidrojumu ar vizuāliem piemēriem
              </ThemedText>
              <View style={styles.buttonWrapper}>
                {canAffordHint ? (
                  <MainButton
                    onPress={() => {
                      onPurchaseHint();
                      onClose();
                    }}
                    style={styles.purchaseButton}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      Iegādāties
                    </ThemedText>
                  </MainButton>
                ) : onWatchAdForGems ? (
                  <MainButton onPress={onWatchAdForGems} disabled={!adLoaded} style={styles.purchaseButton}>
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
                ) : (
                  <MainButton disabled onPress={() => {}} style={styles.purchaseButton}>
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      Nav pietiekami daudz 💎
                    </ThemedText>
                  </MainButton>
                )}
              </View>
            </View>
          </View>

          <View style={styles.footerButtonContainer}>
            <MainButton variant="secondary" onPress={onClose} style={styles.closeButtonBottom}>
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
  gemsDisplay: {
    gap: 8,
    // padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(106, 74, 203, 0.1)",
  },
  gemIcon: {
    width: 42,
    height: 42,
  },
  gemCountText: {
    fontSize: 32,
    lineHeight: 42,
    fontFamily: "BalooBhai2_700Bold",
  },
  description: {
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "rgba(106, 74, 203, 0.2)",
    backgroundColor: "rgba(106, 74, 203, 0.08)",
  },
  optionHeader: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionTitleContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  bulbIcon: {
    width: 32,
    height: 32,
  },
  closeRedIcon: {
    width: 32,
    height: 32,
  },
  optionTitle: {
    fontSize: 18,
  },
  costBadge: {
    gap: 4,
    borderRadius: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "rgba(106, 74, 203, 0.15)",
  },
  costGemIcon: {
    width: 18,
    height: 18,
  },
  costText: {
    fontSize: 14,
  },
  optionDescription: {
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  buttonWrapper: {
    gap: 8,
    width: "100%",
    paddingBottom: 12,
    alignItems: "center",
  },
  purchaseButton: {
    height: 48,
    width: 260,
  },
  footerButtonContainer: {
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  closeButtonBottom: {
    height: 55,
    width: 315,
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
});
