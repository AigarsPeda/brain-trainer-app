import AdIcon from "@/assets/images/ad.png";
import Gem from "@/assets/images/gem.png";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GEMS_FROM_AD, HINT_COST } from "@/constants/GameSettings";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
  currentGems: number;
  onPurchaseHint: () => void;
  adLoaded?: boolean;
  onWatchAdForGems?: () => void;
}

export function HelpModal({
  visible,
  onClose,
  currentGems,
  onPurchaseHint,
  adLoaded = false,
  onWatchAdForGems,
}: HelpModalProps) {
  const { text, tint } = useThemeColor();
  const canAffordHint = currentGems >= HINT_COST;

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          <View style={styles.header}>
            <ThemedText type="title">Palīdzība</ThemedText>
            {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={text} />
            </TouchableOpacity> */}
          </View>

          <View style={styles.gemsDisplay}>
            <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
            <ThemedText type="subtitle">{currentGems}</ThemedText>
          </View>

          <ThemedText style={styles.description}>Izmanto dimantus, lai iegūtu palīdzību risinot uzdevumus!</ThemedText>

          <View style={styles.optionsContainer}>
            {/* Hint Option */}
            <View style={styles.optionCard}>
              <View style={styles.optionHeader}>
                <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                  💡 Skaidrojums
                </ThemedText>
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
                  <MainButton
                    onPress={onWatchAdForGems}
                    disabled={!adLoaded}
                    style={styles.purchaseButton}
                  >
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
  closeButton: {
    padding: 4,
  },
  gemsDisplay: {
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(106, 74, 203, 0.1)",
  },
  gemIcon: {
    width: 32,
    height: 32,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.8,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(106, 74, 203, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(106, 74, 203, 0.2)",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
  },
  costBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(106, 74, 203, 0.15)",
  },
  costGemIcon: {
    width: 16,
    height: 16,
  },
  costText: {
    fontSize: 14,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.7,
  },
  buttonWrapper: {
    gap: 8,
    width: "100%",
    alignItems: "center",
    paddingBottom: 12,
  },
  purchaseButton: {
    height: 48,
    width: 260,
  },
  footerButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButtonBottom: {
    height: 55,
    width: 300,
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
