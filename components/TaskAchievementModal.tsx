import Gem from "@/assets/images/gem.png";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ButtonColors } from "@/constants/Colors";
import { TaskAchievementConfig } from "@/constants/GameSettings";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Modal, StyleSheet, View } from "react-native";

interface TaskAchievementModalProps {
  visible: boolean;
  onClaim: () => void;
  achievement: TaskAchievementConfig | null;
}

export function TaskAchievementModal({ visible, onClaim, achievement }: TaskAchievementModalProps) {
  const { tint } = useThemeColor();
  const colorScheme = useAppColorScheme();
  const buttonTextColor = ButtonColors.primary[colorScheme === "dark" ? "dark" : "light"].text;

  if (!achievement) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClaim}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { borderColor: tint }]}>
          <View style={styles.emojiContainer}>
            <ThemedText style={styles.emoji}>{achievement.emoji}</ThemedText>
          </View>

          <ThemedText type="title" style={styles.title}>
            {achievement.title}
          </ThemedText>

          <ThemedText style={styles.description}>{achievement.description}</ThemedText>

          <View style={styles.rewardContainer}>
            <ThemedText type="title" style={styles.rewardText}>
              +{achievement.gems}
            </ThemedText>
            <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
          </View>

          <View style={styles.buttonContainer}>
            <MainButton onPress={onClaim} style={styles.button}>
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: buttonTextColor }]}>
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
  emojiContainer: {
    marginBottom: 12,
  },
  emoji: {
    fontSize: 64,
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
  },
});
