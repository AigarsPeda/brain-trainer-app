import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import MobileAds, { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";

const ios = "ca-app-pub-5238286944896076/6557213296";
const android = "ca-app-pub-5238286944896076/2318585385";

const adDeviceId = Device.osName === "iOS" ? ios : android;
const adUnitId = __DEV__ ? TestIds.REWARDED : adDeviceId;

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ["games", "kids", "fun", "education", "learning"],
});

function useGoogleAd() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isRewarded, setIsRewarded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    async function initializeAds() {
      try {
        await MobileAds().initialize();
        console.log("Google Mobile Ads initialized successfully");
        setInitializing(true);
      } catch (err) {
        console.error("Failed to initialize Google Mobile Ads:", err);
        setError("Failed to initialize ads");
        setInitializing(false);
      }
    }

    if (initializing) {
      return;
    }

    initializeAds();
  }, [initializing]);

  useEffect(() => {
    if (!initializing) {
      return;
    }

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log("User earned reward of ", reward);

      if (reward.type === "coins") {
        setIsRewarded(true);
      }

      // router.navigate("/");
    });

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [initializing]);

  useEffect(() => {
    if (isRewarded) {
      router.navigate("/");
    }
  }, [isRewarded, router]);

  return {
    loaded,
    isRewarded,
    rewarded,
    error,
  };
}

export default useGoogleAd;
