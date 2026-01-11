import { AnimatedMathVisual } from "@/components/AnimatedMathVisual";
import { AnimatedToggle } from "@/components/AnimatedToggle";
import { MainButton } from "@/components/MainButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HintModalColors } from "@/constants/Colors";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MathExplanation } from "@/utils/mathExplanations";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

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
  const [selectedView, setSelectedView] = useState<"animation" | "description">("animation");

  // Slide animation values
  const slidePosition = useSharedValue(0);

  const showAnimation = selectedView === "animation";

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

  const handleViewSelect = useCallback((key: string) => {
    const newView = key as "animation" | "description";
    setSelectedView(newView);

    // Restart animation when switching back to animation view
    if (key === "animation") {
      setIsAnimationPlaying(false);
      setTimeout(() => setIsAnimationPlaying(true), 300);
    }
  }, []);

  // Update content slide animation when selected view changes
  useEffect(() => {
    slidePosition.value = withTiming(selectedView === "animation" ? 0 : 1, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
  }, [selectedView]);

  const toggleItems = [
    { key: "animation", label: "🎬 Animācija" },
    { key: "description", label: "📊 Skaidrojums" },
  ];

  const animationViewStyle = useAnimatedStyle(() => ({
    opacity: 1 - slidePosition.value,
    transform: [{ translateX: -slidePosition.value * 30 }],
    pointerEvents: slidePosition.value > 0.5 ? "none" : "auto",
  }));

  const descriptionViewStyle = useAnimatedStyle(() => ({
    opacity: slidePosition.value,
    transform: [{ translateX: (1 - slidePosition.value) * 30 }],
    pointerEvents: slidePosition.value < 0.5 ? "none" : "auto",
  }));

  if (!explanation) {
    return null;
  }

  const { title, example, visualItems } = explanation;

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
              <ThemedText type="subtitle" style={styles.title}>
                💡 {title}
              </ThemedText>

              <View style={[styles.visualSection, { backgroundColor: visualSectionBackground }]}>
                <AnimatedToggle
                  items={toggleItems}
                  selectedKey={selectedView}
                  onSelect={handleViewSelect}
                  style={styles.viewToggleContainer}
                />

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
                  {showAnimation ? (
                    <Animated.View style={[styles.switchableContent, animationViewStyle]}>
                      <AnimatedMathVisual
                        explanation={explanation}
                        isPlaying={isAnimationPlaying}
                        onReplay={handleReplayAnimation}
                      />
                    </Animated.View>
                  ) : (
                    <Animated.View style={[styles.switchableContent, descriptionViewStyle]}>
                      <View style={styles.visualContainer}>
                        {visualItems.operationSymbol === "+" && (
                          <>
                            <View
                              style={[styles.itemsGroup, { backgroundColor: boxBackground, borderColor: boxBorder }]}
                            >
                              <ThemedText style={styles.visualItems}>{visualItems.leftItems.join(" ")}</ThemedText>
                            </View>
                            <ThemedText
                              style={styles.operationText}
                              lightColor={HintModalColors.light.operationText}
                              darkColor={HintModalColors.dark.operationText}
                            >
                              {visualItems.operationSymbol}
                            </ThemedText>
                            <View
                              style={[styles.itemsGroup, { backgroundColor: boxBackground, borderColor: boxBorder }]}
                            >
                              <ThemedText style={styles.visualItems}>{visualItems.rightItems.join(" ")}</ThemedText>
                            </View>
                          </>
                        )}

                        {visualItems.operationSymbol === "-" && (
                          <View style={styles.subtractionContainer}>
                            <ThemedText
                              style={styles.subtractionLabel}
                              lightColor={HintModalColors.light.subtractionLabel}
                              darkColor={HintModalColors.dark.subtractionLabel}
                            >
                              Tev ir:
                            </ThemedText>
                            <View style={[styles.itemsRow, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                              <ThemedText style={styles.visualItems}>{visualItems.leftItems.join(" ")}</ThemedText>
                            </View>
                            <ThemedText
                              style={styles.subtractionLabel}
                              lightColor={HintModalColors.light.subtractionLabel}
                              darkColor={HintModalColors.dark.subtractionLabel}
                            >
                              Tu atdod:
                            </ThemedText>
                            <View style={styles.crossedOutRow}>
                              {visualItems.rightItems.map((item, index) => (
                                <View key={index} style={styles.crossedItemContainer}>
                                  <ThemedText style={styles.crossedItem}>{item}</ThemedText>
                                  <ThemedText style={styles.crossMark}>✖️</ThemedText>
                                </View>
                              ))}
                            </View>
                            <ThemedText
                              style={styles.subtractionLabel}
                              lightColor={HintModalColors.light.subtractionLabel}
                              darkColor={HintModalColors.dark.subtractionLabel}
                            >
                              Tev paliek:
                            </ThemedText>
                            <View style={[styles.itemsRow, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                              <ThemedText style={styles.visualItems}>
                                {visualItems.leftItems.slice(0, example.result).join(" ")}
                              </ThemedText>
                            </View>
                            <ThemedText
                              style={styles.resultCount}
                              lightColor={HintModalColors.light.resultCount}
                              darkColor={HintModalColors.dark.resultCount}
                            >
                              ({example.result} paliek)
                            </ThemedText>
                          </View>
                        )}

                        {(visualItems.operationSymbol === "×" || visualItems.operationSymbol === "÷") && (
                          <View style={styles.groupsContainer}>
                            {visualItems.leftItems.map((group, index) => (
                              <View
                                key={index}
                                style={[
                                  styles.groupBox,
                                  {
                                    backgroundColor: boxBackground,
                                    borderColor: isDark
                                      ? HintModalColors.dark.groupBoxBorder
                                      : HintModalColors.light.groupBoxBorder,
                                  },
                                ]}
                              >
                                <ThemedText style={styles.groupItems}>{group}</ThemedText>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

                      {visualItems.operationSymbol === "+" && (
                        <View style={styles.resultSection}>
                          <ThemedText
                            style={styles.equalsText}
                            lightColor={HintModalColors.light.equalsText}
                            darkColor={HintModalColors.dark.equalsText}
                          >
                            =
                          </ThemedText>
                          <ThemedText style={styles.visualItems}>
                            {[...visualItems.leftItems, ...visualItems.rightItems].join(" ")}
                          </ThemedText>
                          <ThemedText
                            style={styles.resultCount}
                            lightColor={HintModalColors.light.resultCount}
                            darkColor={HintModalColors.dark.resultCount}
                          >
                            ({example.result} kopā)
                          </ThemedText>
                        </View>
                      )}
                    </Animated.View>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.closeButtonContainer}>
              <MainButton variant="secondary" onPress={onClose} style={styles.modalCloseButton}>
                <ThemedText type="defaultSemiBold" style={[styles.modalCloseButtonText, { color: text }]}>
                  Sapratu! 👍
                </ThemedText>
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
    // maxHeight: "80%",
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
  title: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  visualSection: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: "center",
    borderColor: "rgba(106, 74, 203, 0.2)",
  },
  viewToggleContainer: {
    marginBottom: 12,
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
    height: 180,
  },
  switchableContent: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  visualContainer: {
    gap: 8,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  itemsGroup: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  visualItems: {
    fontSize: 24,
    textAlign: "center",
  },
  operationText: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  subtractionContainer: {
    gap: 6,
    width: "100%",
    alignItems: "center",
  },
  subtractionLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  itemsRow: {
    gap: 4,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
  },
  crossedOutRow: {
    gap: 4,
    flexDirection: "row",
  },
  crossedItemContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  crossedItem: {
    fontSize: 24,
    opacity: 0.4,
  },
  crossMark: {
    fontSize: 16,
    position: "absolute",
  },
  groupsContainer: {
    gap: 8,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  groupBox: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  groupItems: {
    fontSize: 22,
    textAlign: "center",
  },
  resultSection: {
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  equalsText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  resultCount: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  closeButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  modalCloseButton: {
    height: 55,
    width: 300,
  },
  modalCloseButtonText: {
    fontSize: 17,
  },
});
