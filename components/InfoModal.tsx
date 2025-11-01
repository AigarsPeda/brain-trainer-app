import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Modal, Pressable, StyleSheet } from "react-native";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function InfoModal({
  visible,
  onClose,
  title = "Uzdevuma informacija",
  description = "Informacija par seit atteloto uzdevumu bus pieejama driz. Paslaik te ir viettura teksts.",
}: InfoModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(event) => event.stopPropagation()}>
          <ThemedView style={styles.modalBox}>
            <ThemedText type="subtitle">{title}</ThemedText>
            <ThemedText style={styles.modalBody}>{description}</ThemedText>
            <Pressable style={styles.modalCloseButton} onPress={onClose}>
              <ThemedText style={styles.modalCloseButtonText} darkColor="#ffffff" lightColor="#ffffff">
                Aizvert
              </ThemedText>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 360,
  },
  modalBox: {
    borderRadius: 16,
    padding: 24,
    gap: 12,
    width: "100%",
  },
  modalBody: {
    fontSize: 16,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#6a4acb",
  },
  modalCloseButtonText: {
    fontFamily: "BalooBhai2_500Medium",
  },
});
