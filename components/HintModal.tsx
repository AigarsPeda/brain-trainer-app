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
  const visualSectionBackground = colors.visualSectionBackground;
  const modalBackdrop = colors.modalBackdrop;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBackdrop, { backgroundColor: modalBackdrop }]} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
          <ThemedView
            style={[
              styles.modalBox,
              isDark ? styles.modalBoxDark : styles.modalBoxLight,
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.titleContainer}>
                <View style={[styles.bulbShell, isDark ? styles.bulbShellDark : styles.bulbShellLight]}>
                  <Image source={Bulb} style={styles.bulbIcon} contentFit="contain" />
                </View>
                <ThemedText type="subtitle" style={styles.title}>
                  {title}
                </ThemedText>
              </View>

              <View style={[styles.visualSection, { backgroundColor: visualSectionBackground }]}>
                <ThemedText
                  style={[styles.exampleLabel, isDark ? styles.exampleLabelDark : styles.exampleLabelLight]}
                  lightColor={HintModalColors.light.exampleLabel}
                  darkColor={HintModalColors.dark.exampleLabel}
                >
                  Piemērs:
                </ThemedText>

                <View
                  style={[
                    styles.equationContainer,
                    { backgroundColor: boxBackground },
                    isDark ? styles.equationContainerDark : styles.equationContainerLight,
                  ]}
                >
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
    paddingVertical: 32,
    justifyContent: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalBox: {
    gap: 12,
    padding: 22,
    width: "100%",
    borderRadius: 26,
  },
  modalBoxDark: {
    shadowColor: "#000000",
    shadowOpacity: 0.42,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 18,
  },
  modalBoxLight: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
    elevation: 14,
  },
  titleContainer: {
    gap: 12,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulbShell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bulbShellDark: {
    backgroundColor: "rgba(196, 181, 253, 0.14)",
  },
  bulbShellLight: {
    backgroundColor: "rgba(106, 74, 203, 0.12)",
  },
  bulbIcon: {
    width: 28,
    height: 28,
  },
  title: {
    flex: 1,
    fontSize: 22,
    lineHeight: 26,
  },
  visualSection: {
    padding: 18,
    borderRadius: 24,
    marginTop: 4,
    marginBottom: 10,
    alignItems: "center",
  },
  exampleLabel: {
    fontSize: 13,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  exampleLabelDark: {
    backgroundColor: "rgba(196, 181, 253, 0.08)",
  },
  exampleLabelLight: {
    backgroundColor: "rgba(255, 255, 255, 0.38)",
  },
  equationContainer: {
    borderRadius: 18,
    marginBottom: 18,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  equationContainerDark: {
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  equationContainerLight: {
    shadowColor: "#312e81",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
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
    marginTop: 8,
    marginBottom: 8,
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
