import { Expandable } from "@/components/Expandable";
import { DocumentIcon } from "@/components/icons/DocumentIcon";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { SecondaryButton } from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SwitchColors } from "@/constants/Colors";
import licensesData from "@/data/licenses.json";
import useAppContext from "@/hooks/useAppContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Constants from "expo-constants";
import { useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface License {
  license: string;
  dependency: string;
}

const licenses: License[] = licensesData as License[];

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { state, dispatch } = useAppContext();
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const [showLicenses, setShowLicenses] = useState(false);
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);

  const isDarkMode = state.theme === "dark";

  const handleThemeToggle = () => {
    dispatch({ type: "SET_THEME", payload: isDarkMode ? "light" : "dark" });
  };

  const toggleLicense = (dependency: string) => {
    setExpandedLicense(expandedLicense === dependency ? null : dependency);
  };

  const handleClose = () => {
    setShowLicenses(false);
    setExpandedLicense(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable style={styles.modalContent} onPress={(event) => event.stopPropagation()}>
          <ThemedView style={[styles.modalBox, { borderColor }]}>
            <ThemedText type="subtitle" style={styles.title}>
              Iestatījumi
            </ThemedText>

            <View style={[styles.settingRow, styles.settingRowBorder, { borderColor }]}>
              <View style={styles.settingLabelContainer}>
                {isDarkMode ? <MoonIcon color={textColor} /> : <SunIcon color={textColor} />}
                <ThemedText style={styles.settingLabel}>{isDarkMode ? "Gaišais režīms" : "Tumšais režīms"}</ThemedText>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                thumbColor={isDarkMode ? SwitchColors.dark.thumb : SwitchColors.light.thumb}
                trackColor={{ false: SwitchColors.light.trackFalse, true: SwitchColors.dark.trackTrue }}
              />
            </View>

            <View style={[styles.licensesSection, { borderColor }]}>
              <Expandable
                chevronColor={textColor}
                isExpanded={showLicenses}
                headerStyle={styles.settingRow}
                onToggle={() => setShowLicenses(!showLicenses)}
                header={
                  <View style={styles.settingLabelContainer}>
                    <DocumentIcon color={textColor} />
                    <ThemedText style={styles.settingLabel}>Licences</ThemedText>
                  </View>
                }
              >
                <FlatList
                  data={licenses}
                  nestedScrollEnabled
                  style={styles.licensesContainer}
                  keyExtractor={(item) => item.dependency}
                  ListEmptyComponent={
                    <ThemedText style={styles.noLicensesText}>
                      Nav pieejamu licenču. Palaidiet &quot;npm run licenses&quot; lai ģenerētu.
                    </ThemedText>
                  }
                  renderItem={({ item }) => (
                    <View style={[styles.licenseItem, { borderColor }]}>
                      <Expandable
                        chevronColor={textColor}
                        headerStyle={styles.licenseHeader}
                        onToggle={() => toggleLicense(item.dependency)}
                        isExpanded={expandedLicense === item.dependency}
                        header={
                          <ThemedText style={styles.licenseName} numberOfLines={1}>
                            {item.dependency}
                          </ThemedText>
                        }
                      >
                        <ScrollView style={styles.licenseTextContainer} nestedScrollEnabled>
                          <ThemedText style={styles.licenseText}>{item.license}</ThemedText>
                        </ScrollView>
                      </Expandable>
                    </View>
                  )}
                />
              </Expandable>
            </View>

            <View style={styles.versionContainer}>
              <ThemedText style={styles.versionText}>Versija {Constants.expoConfig?.version}</ThemedText>
            </View>

            <SecondaryButton onPress={handleClose}>
              <ThemedText
                type="subtitle"
                darkColor="#ffffff"
                lightColor="#151414ff"
                style={styles.modalCloseButtonText}
              >
                Aizvērt
              </ThemedText>
            </SecondaryButton>
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
  },
  modalContent: {
    width: "85%",
    maxWidth: 400,
    height: "70%",
    maxHeight: 500,
  },
  modalBox: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 22,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
  },
  licensesSection: {
    borderBottomWidth: 1,
    flex: 1,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  versionContainer: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.5,
  },
  modalCloseButtonText: {
    fontSize: 16,
  },
  licensesContainer: {
    flex: 1,
    marginBottom: 8,
  },
  licenseItem: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  licenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  licenseName: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  licenseTextContainer: {
    maxHeight: 150,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  licenseText: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.8,
  },
  noLicensesText: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
    opacity: 0.7,
  },
});
