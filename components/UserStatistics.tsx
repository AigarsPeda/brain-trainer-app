import FireGray from "@/assets/images/fire-gray.png";
import FireOrange from "@/assets/images/fire-orange.png";
import FireRed from "@/assets/images/fire-red.png";
// import Gem from "@/assets/images/gem.png";
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
}

export function UserStatistics({ onLivesPress }: UserStatisticsProps) {
  const { state } = useAppContext();
  const { width } = useWindowDimensions();
  const iconColor = useThemeColor({}, "icon");

  const [settingsVisible, setSettingsVisible] = useState(false);
  const livesAnimatedStyle = usePulseOnChange(state.lives);

  const itemWidth = width / 3;

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
          gap: 8,
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 16,
          backgroundColor: "transparent",
        }}
      >
        <StatisticsItem
          src={getFireImage()}
          width={itemWidth}
          stat={state.daysInARow}
          size={{
            width: 38,
            height: 38,
          }}
        />
        {/* <StatisticsItem src={Gem} width={itemWidth} stat={state.gems} /> */}
        <View style={{ flexDirection: "row", marginLeft: "auto" }}>
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
          <StatisticsItem
            src={Settings}
            size={{
              width: 36,
              height: 36,
            }}
            animation={livesAnimatedStyle}
            onPress={() => setSettingsVisible(true)}
          />
        </View>
      </View>
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </>
  );
}
