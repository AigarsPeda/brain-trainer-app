import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { MathExplanation } from "@/utils/mathExplanations";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  explanation: MathExplanation | null;
}

export function HintModal({ visible, onClose, explanation }: HintModalProps) {
  const colorScheme = useAppColorScheme();
  const isDark = colorScheme === "dark";

  if (!explanation) {
    return null;
  }

  const { title, description, example, visualItems, tip } = explanation;

  const boxBackground = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.6)";
  const boxBorder = isDark ? "rgba(196, 181, 253, 0.3)" : "rgba(106, 74, 203, 0.2)";
  const visualSectionBackground = isDark ? "rgba(106, 74, 203, 0.15)" : "rgba(106, 74, 203, 0.25)";

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
          <ThemedView style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <ThemedText type="subtitle" style={styles.title}>
                💡 {title}
              </ThemedText>

              <ThemedText style={styles.description}>{description}</ThemedText>

              <View style={[styles.visualSection, { backgroundColor: visualSectionBackground }]}>
                <ThemedText style={styles.exampleLabel} lightColor="#5a3d9e" darkColor="#c4b5fd">
                  Piemērs:
                </ThemedText>

                <View style={[styles.equationContainer, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                  <ThemedText style={styles.equationText} lightColor="#6a4acb" darkColor="#c4b5fd">
                    {example.left} {example.operation} {example.right} = {example.result}
                  </ThemedText>
                </View>

                <View style={styles.visualContainer}>
                  {visualItems.operationSymbol === "+" && (
                    <>
                      <View style={[styles.itemsGroup, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                        <ThemedText style={styles.visualItems}>{visualItems.leftItems.join(" ")}</ThemedText>
                      </View>
                      <ThemedText style={styles.operationText} lightColor="#6a4acb" darkColor="#c4b5fd">
                        {visualItems.operationSymbol}
                      </ThemedText>
                      <View style={[styles.itemsGroup, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                        <ThemedText style={styles.visualItems}>{visualItems.rightItems.join(" ")}</ThemedText>
                      </View>
                    </>
                  )}

                  {visualItems.operationSymbol === "-" && (
                    <View style={styles.subtractionContainer}>
                      <ThemedText style={styles.subtractionLabel} lightColor="#5a3d9e" darkColor="#c4b5fd">
                        Tev ir:
                      </ThemedText>
                      <View style={[styles.itemsRow, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                        <ThemedText style={styles.visualItems}>{visualItems.leftItems.join(" ")}</ThemedText>
                      </View>
                      <ThemedText style={styles.subtractionLabel} lightColor="#5a3d9e" darkColor="#c4b5fd">
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
                      <ThemedText style={styles.subtractionLabel} lightColor="#5a3d9e" darkColor="#c4b5fd">
                        Tev paliek:
                      </ThemedText>
                      <View style={[styles.itemsRow, { backgroundColor: boxBackground, borderColor: boxBorder }]}>
                        <ThemedText style={styles.visualItems}>
                          {visualItems.leftItems.slice(0, example.result).join(" ")}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.resultCount} lightColor="#5a3d9e" darkColor="#c4b5fd">
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
                            { backgroundColor: boxBackground, borderColor: isDark ? "#c4b5fd" : "#6a4acb" },
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
                    <ThemedText style={styles.equalsText} lightColor="#6a4acb" darkColor="#c4b5fd">
                      =
                    </ThemedText>
                    <ThemedText style={styles.visualItems}>
                      {[...visualItems.leftItems, ...visualItems.rightItems].join(" ")}
                    </ThemedText>
                    <ThemedText style={styles.resultCount} lightColor="#5a3d9e" darkColor="#c4b5fd">
                      ({example.result} kopā)
                    </ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.tipContainer}>
                <ThemedText style={styles.tipLabel}>🎯 Padoms:</ThemedText>
                <ThemedText style={styles.tipText}>{tip}</ThemedText>
              </View>
            </ScrollView>

            <Pressable style={styles.modalCloseButton} onPress={onClose}>
              <ThemedText style={styles.modalCloseButtonText} darkColor="#ffffff" lightColor="#ffffff">
                Sapratu! 👍
              </ThemedText>
            </Pressable>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  visualSection: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
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
  tipContainer: {
    padding: 12,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 193, 7, 0.15)",
  },
  tipLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
  },
  modalCloseButton: {
    marginTop: 12,
    borderRadius: 999,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#6a4acb",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: "BalooBhai2_500Medium",
  },
});
