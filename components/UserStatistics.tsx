import FireGray from "@/assets/images/fire-gray.png";
import FireOrange from "@/assets/images/fire-orange.png";
import FireRed from "@/assets/images/fire-red.png";
import Gem from "@/assets/images/gem.png";
import Heart from "@/assets/images/heart.png";
import { StatisticsItem } from "@/components/StatisticsItem";
import { ThemedView } from "@/components/ThemedView";
import useAppContext from "@/hooks/useAppContext";
import { useWindowDimensions } from "react-native";

export function UserStatistics() {
  const { state } = useAppContext();
  const { width } = useWindowDimensions();

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
    <ThemedView
      style={{
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
      <StatisticsItem src={Gem} width={itemWidth} stat={state.gems} />
      <StatisticsItem
        src={Heart}
        width={itemWidth}
        stat={state.lives}
        size={{
          width: 36,
          height: 36,
        }}
      />
    </ThemedView>
  );
}
