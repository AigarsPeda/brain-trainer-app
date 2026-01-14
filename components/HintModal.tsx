import Bulb from "@/assets/images/bulb.png";
import ThumbsUp from "@/assets/images/thumbs_up.png";
import { AnimatedMathVisual } from "@/components/AnimatedMathVisual";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HintModalColors } from "@/constants/Colors";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MathExplanation } from "@/utils/mathExplanations";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";

interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  explanation: MathExplanation | null;
}

export function HintModal({ visible, onClose, explanation }: HintModalProps) {
  const colorScheme = useAppColorScheme();
  const isDark = colorScheme === "dark";
  const { text } = useThemeColor();
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

  // Start animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Small delay to let the modal animate in first
      const timer = setTimeout(() => {
        setIsAnimationPlaying(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimationPlaying(false);
    }
  }, [visible]);

  const handleReplayAnimation = useCallback(() => {
    setIsAnimationPlaying(false);
    setTimeout(() => setIsAnimationPlaying(true), 100);
  }, []);

  if (!explanation) {
    return null;
  }

  const { title, example } = explanation;

  const colors = HintModalColors[isDark ? "dark" : "light"];
  const boxBackground = colors.boxBackground;
  const boxBorder = colors.boxBorder;
  const visualSectionBackground = colors.visualSectionBackground;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBackdrop} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
          <ThemedView style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.titleContainer}>
                <Image source={Bulb} style={styles.bulbIcon} contentFit="contain" />
                <ThemedText type="subtitle" style={styles.title}>
                  {title}
                </ThemedText>
              </View>

              <View style={[styles.visualSection, { backgroundColor: visualSectionBackground }]}>
                <ThemedText
                  style={styles.exampleLabel}
                  lightColor={HintModalColors.light.exampleLabel}
                  darkColor={HintModalColors.dark.exampleLabel}
                >
                  Piemērs:
                </ThemedText>

                <View style={[styles.equationContainer, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                  <ThemedText
                    style={styles.equationText}
                    lightColor={HintModalColors.light.equationText}
                    darkColor={HintModalColors.dark.equationText}
                  >
                    {example.left} {example.operation} {example.right} = {example.result}
                  </ThemedText>
                </View>

                <View style={styles.contentSwitcher}>
                  <AnimatedMathVisual
                    explanation={explanation}
                    isPlaying={isAnimationPlaying}
                    onReplay={handleReplayAnimation}
                  />
              </View>
            </View>
            </ScrollView>

            <View style={styles.closeButtonContainer}>
              <MainButton variant="secondary" onPress={onClose} style={styles.modalCloseButton}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <ThemedText type="defaultSemiBold" style={[styles.modalCloseButtonText, { color: text }]}>
                    Sapratu!
                  </ThemedText>
                  <Image source={ThumbsUp} style={{ width: 32, height: 32, marginLeft: 8 }} contentFit="contain" />
                </View>
              </MainButton>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: HintModalColors.light.modalBackdrop,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalBox: {
    gap: 8,
    padding: 20,
    width: "100%",
    borderRadius: 20,
  },
  titleContainer: {
    gap: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  bulbIcon: {
    width: 32,
    height: 32,
  },
  title: {
    flex: 1,
    fontSize: 20,
  },
  visualSection: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: "center",
    borderColor: "rgba(106, 74, 203, 0.2)",
  },
  exampleLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  equationContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  equationText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentSwitcher: {
    width: "100%",
  },
  closeButtonContainer: {
    width: "100%",
    marginTop: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  modalCloseButton: {
    height: 55,
    width: 300,
  },
  modalCloseButtonText: {
    fontSize: 17,
  },
});
