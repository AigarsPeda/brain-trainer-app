import { ThemedText } from "@/components/ThemedText";
import { STREAK_BONUSES, TASK_ACHIEVEMENTS } from "@/constants/GameSettings";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useCallback, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface StreakBonusSheetProps {
  visible: boolean;
  daysInARow: number;
  onClose: () => void;
  claimedBonuses: number[];
  totalCompletedLevels: number;
  claimedTaskAchievements: number[];
  streakBonusClaimDates: Record<number, string>;
  taskAchievementClaimDates: Record<number, string>;
}

export function StreakBonusSheet({
  visible,
  onClose,
  daysInARow,
  claimedBonuses,
  totalCompletedLevels,
  claimedTaskAchievements,
  streakBonusClaimDates,
  taskAchievementClaimDates,
}: StreakBonusSheetProps) {
  const { background, tint } = useThemeColor();
  const colorScheme = useAppColorScheme();
  const isDark = colorScheme === "dark";
  const sheetRef = useRef<BottomSheet>(null);
  const achievementCardBackground = isDark ? "rgba(64, 102, 140, 0.2)" : "rgba(99, 102, 241, 0.09)";
  const streakCardBackground = isDark ? "rgba(81, 62, 120, 0.22)" : "rgba(147, 51, 234, 0.1)";
  const dateChipBackground = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(67, 56, 202, 0.1)";

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  if (!visible) return null;

  return (
    <View style={styles.absoluteContainer} pointerEvents="box-none">
      <BottomSheet
        index={1}
        ref={sheetRef}
        enablePanDownToClose
        snapPoints={["70%", "90%"]}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: tint, width: 40 }}
        backgroundStyle={{ backgroundColor: background, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <BottomSheetScrollView style={styles.content}>
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionHeader}>
              Līmeņi
            </ThemedText>

            <ThemedText style={styles.sectionSubtitle}>
              {totalCompletedLevels} {totalCompletedLevels === 1 ? "līmenis" : "līmeņi"} pabeigti
            </ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              style={styles.horizontalScroll}
            >
              {TASK_ACHIEVEMENTS.filter(
                (a) => claimedTaskAchievements.includes(a.taskCount) || totalCompletedLevels >= a.taskCount
              ).map((achievement) => {
                return (
                  <View
                    key={achievement.taskCount}
                    style={[styles.card, { backgroundColor: achievementCardBackground }]}
                  >
                    <View style={styles.cardIconWrap}>
                      <Image source={achievement.icon} style={styles.cardIcon} contentFit="contain" />
                    </View>
                    {taskAchievementClaimDates[achievement.taskCount] && (
                      <View style={[styles.dateChip, { backgroundColor: dateChipBackground }]}>
                        <ThemedText style={styles.cardDate}>
                          {taskAchievementClaimDates[achievement.taskCount]}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionHeader}>
              Ikdienas sērija
            </ThemedText>

            <ThemedText style={styles.sectionSubtitle}>
              {daysInARow} {daysInARow === 1 ? "diena" : "dienas"} pēc kārtas
            </ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              style={styles.horizontalScroll}
            >
              {STREAK_BONUSES.filter((bonus) => claimedBonuses.includes(bonus.day) || daysInARow >= bonus.day).map(
                (bonus) => {
                  return (
                    <View key={bonus.day} style={[styles.card, { backgroundColor: streakCardBackground }]}>
                      <View style={styles.cardIconWrap}>
                        <Image source={bonus.icon} style={styles.cardIcon} contentFit="contain" />
                      </View>
                      {streakBonusClaimDates[bonus.day] && (
                        <View style={[styles.dateChip, { backgroundColor: dateChipBackground }]}>
                          <ThemedText style={styles.cardDate}>{streakBonusClaimDates[bonus.day]}</ThemedText>
                        </View>
                      )}
                    </View>
                  );
                }
              )}
            </ScrollView>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 14,
  },
  horizontalScroll: {
    paddingBottom: 4,
  },
  horizontalScrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 8,
    gap: 14,
  },
  card: {
    width: 180,
    minHeight: 220,
    borderWidth: 0,
    borderRadius: 24,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  cardIconWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 1,
  },
  cardIcon: {
    width: 160,
    height: 160,
  },
  dateChip: {
    minWidth: 122,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  cardDate: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.62,
    letterSpacing: 0.2,
    fontVariant: ["tabular-nums"],
  },
});
