import FireGray from "@/assets/images/fire-gray.png";
import FireOrange from "@/assets/images/fire-orange.png";
import FireRed from "@/assets/images/fire-red.png";
import Gem from "@/assets/images/gem.png";
import Heart from "@/assets/images/heart.png";
import { SettingsModal } from "@/components/SettingsModal";
import { StatisticsItem } from "@/components/StatisticsItem";
import Settings from "@/assets/images/settings.png";
import useAppContext from "@/hooks/useAppContext";
import { usePulseOnChange } from "@/hooks/usePulseOnChange";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";

interface UserStatisticsProps {
  onLivesPress?: () => void;
  onGemsPress?: () => void;
}

export function UserStatistics({ onLivesPress, onGemsPress }: UserStatisticsProps) {
  const { state } = useAppContext();
  const { width } = useWindowDimensions();
  const iconColor = useThemeColor({}, "icon");

  const [settingsVisible, setSettingsVisible] = useState(false);
  const livesAnimatedStyle = usePulseOnChange(state.lives);
  const gemsAnimatedStyle = usePulseOnChange(state.gems);

  const itemWidth = width / 4;

  const getFireImage = () => {
    if (state.daysInARow >= 7) {
      return FireOrange;
    }

    if (state.daysInARow >= 3) {
      return FireRed;
    }

    return FireGray;
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: "transparent",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <StatisticsItem
            src={getFireImage()}
            width={itemWidth}
            stat={state.daysInARow}
            size={{
              width: 38,
              height: 38,
            }}
          />
          <StatisticsItem
            src={Gem}
            width={itemWidth}
            stat={state.gems}
            size={{
              width: 36,
              height: 36,
            }}
            animation={gemsAnimatedStyle}
            onPress={onGemsPress}
          />
          <StatisticsItem
            src={Heart}
            stat={state.lives}
            size={{
              width: 36,
              height: 36,
            }}
            animation={livesAnimatedStyle}
            onPress={onLivesPress}
          />
        </View>
        <StatisticsItem
          src={Settings}
          size={{
            width: 36,
            height: 36,
          }}
          onPress={() => setSettingsVisible(true)}
        />
      </View>
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </>
  );
}
