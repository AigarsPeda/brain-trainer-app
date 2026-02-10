import Gem from "@/assets/images/gem.png";
import { ThemedText } from "@/components/ThemedText";
import { STREAK_BONUSES, TASK_ACHIEVEMENTS } from "@/constants/GameSettings";
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
  totalCompletedTasks: number;
  claimedTaskAchievements: number[];
}

export function StreakBonusSheet({
  visible,
  onClose,
  daysInARow,
  claimedBonuses,
  totalCompletedTasks,
  claimedTaskAchievements,
}: StreakBonusSheetProps) {
  const { background, tint } = useThemeColor();
  const sheetRef = useRef<BottomSheet>(null);

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
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Uzdevumi
          </ThemedText>

          <ThemedText style={styles.sectionSubtitle}>
            {totalCompletedTasks} {totalCompletedTasks === 1 ? "uzdevums" : "uzdevumi"} izpildīti
          </ThemedText>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {TASK_ACHIEVEMENTS.filter(
              (a) => claimedTaskAchievements.includes(a.taskCount) || totalCompletedTasks >= a.taskCount
            ).map((achievement) => {
              return (
                <View key={achievement.taskCount} style={[styles.card, { borderColor: tint }]}>
                  <ThemedText style={styles.cardEmoji}>{achievement.emoji}</ThemedText>
                  <View style={styles.cardReward}>
                    <ThemedText type="defaultSemiBold" style={styles.cardGems}>
                      +{achievement.gems}
                    </ThemedText>
                    <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
                  </View>
                  <ThemedText style={styles.cardDay}>{achievement.taskCount} uzd.</ThemedText>
                </View>
              );
            })}
          </ScrollView>

          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Ikdienas sērija
          </ThemedText>

          <ThemedText style={styles.sectionSubtitle}>
            {daysInARow} {daysInARow === 1 ? "diena" : "dienas"} pēc kārtas
          </ThemedText>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {STREAK_BONUSES.filter((bonus) => claimedBonuses.includes(bonus.day) || daysInARow >= bonus.day).map(
              (bonus) => {
                return (
                  <View key={bonus.day} style={[styles.card, { borderColor: tint }]}>
                    <ThemedText style={styles.cardEmoji}>{bonus.emoji}</ThemedText>
                    <View style={styles.cardReward}>
                      <ThemedText type="defaultSemiBold" style={styles.cardGems}>
                        +{bonus.gems}
                      </ThemedText>
                      <Image source={Gem} style={styles.gemIcon} contentFit="contain" />
                    </View>
                    <ThemedText style={styles.cardDay}>{bonus.day}. diena</ThemedText>
                  </View>
                );
              }
            )}
          </ScrollView>
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
    paddingTop: 8,
  },
  header: {
    textAlign: "center",
    marginBottom: 4,
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 16,
  },
  currentStreak: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    width: 150,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardReward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  cardGems: {
    fontSize: 20,
  },
  gemIcon: {
    width: 18,
    height: 18,
  },
  cardDay: {
    fontSize: 14,
    opacity: 0.6,
  },
});
