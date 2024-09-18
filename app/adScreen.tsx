import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";

const ios = "ca-app-pub-5238286944896076/6557213296";
const android = "ca-app-pub-5238286944896076/2318585385";

const adDeviceId = Device.osName === "iOS" ? ios : android;
const adUnitId = __DEV__ ? TestIds.REWARDED : adDeviceId;

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ["games", "kids", "fun", "education", "learning"],
});

export default function AdScreen() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isRewarded, setIsRewarded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);

        if (reward.type === "coins") {
          setIsRewarded(true);
        }

        // router.navigate("/");
      }
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  useEffect(() => {
    if (isRewarded) {
      router.navigate("/");
    }
  }, [isRewarded]);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    //   headerImage={
    //     <Image
    //       source={require("@/assets/images/partial-react-logo.png")}
    //       style={styles.reactLogo}
    //     />
    //   }
    // >
    //   <ThemedText type="title">Ad Screen</ThemedText>
    //   <Button
    //     title="Show rewarded"
    //     onPress={() => {
    //       console.log("Show rewarded");
    //       rewarded.show();
    //     }}
    //   />
    // </ParallaxScrollView>
    <SafeAreaView>
      <Button
        title="Show rewarded"
        onPress={() => {
          console.log("Show rewarded");
          rewarded.show();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
