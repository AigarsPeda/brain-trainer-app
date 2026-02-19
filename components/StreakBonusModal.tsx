import Gem from "@/assets/images/gem.png";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StreakBonusConfig } from "@/constants/GameSettings";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Modal, StyleSheet, View } from "react-native";

interface StreakBonusModalProps {
  visible: boolean;
  onClaim: () => void;
  bonus: StreakBonusConfig | null;
}

export function StreakBonusModal({ visible, onClaim, bonus }: StreakBonusModalProps) {
  const { tint } = useThemeColor();

  if (!bonus) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClaim}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          <View style={styles.iconContainer}>
            <Image source={bonus.icon} style={styles.icon} contentFit="contain" />
          </View>

          <ThemedText type="title" style={styles.title}>
            {bonus.title}
          </ThemedText>

          <ThemedText style={styles.description}>{bonus.description}</ThemedText>

          <View style={styles.rewardContainer}>
            <ThemedText type="title" style={styles.rewardText}>
              +{bonus.gems}
            </ThemedText>
            <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
          </View>

          <View style={styles.buttonContainer}>
            <MainButton onPress={onClaim} style={styles.button}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Saņemt!
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
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    width: 72,
    height: 72,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  rewardContainer: {
    gap: 10,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardText: {
    fontSize: 36,
  },
  gemIcon: {
    width: 40,
    height: 40,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    height: 55,
    width: 300,
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
  },
});
