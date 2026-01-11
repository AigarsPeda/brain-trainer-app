import AdIcon from "@/assets/images/ad.png";
import Gem from "@/assets/images/gem.png";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GEMS_FROM_AD } from "@/constants/GameSettings";
import useAppContext from "@/hooks/useAppContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface GemModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd?: () => void;
  adLoaded?: boolean;
}

export function GemModal({ visible, onClose, onWatchAd, adLoaded }: GemModalProps) {
  const { state, dispatch } = useAppContext();
  const { background, text, tint } = useThemeColor();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const handleWatchAd = () => {
    if (onWatchAd) {
      onWatchAd();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          {/* Header with close button */}
          <View style={styles.header}>
            <ThemedText type="title">Dimanti</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={text} />
            </TouchableOpacity>
          </View>

          {/* Gem count display */}
          <View style={[styles.gemCountContainer]}>
            <Image source={Gem} style={styles.gemIconLarge} contentFit="contain" />
            <ThemedText type="title">{state.gems}</ThemedText>
          </View>

          {/* Description */}
          <ThemedText style={styles.description}>
            Izmanto dimantus, lai iegādātos papildinājumus spēlē. Nopelni vairāk dimantu, skatoties reklāmas vai
            pabeidzot līmeņus ar augstāku zvaigžņu skaitu!
          </ThemedText>

          {/* Watch ad button */}
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
  gemCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },
  gemIconLarge: {
    width: 48,
    height: 48,
  },
  description: {
    fontSize: 16,
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
  gemIconSmall: {
    width: 18,
    height: 18,
  },
  compactButton: {
    height: 55,
    width: 300,
  },
});
