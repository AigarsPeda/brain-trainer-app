import * as Device from "expo-device";
import { useEffect, useState, useCallback, useRef } from "react";
import MobileAds, { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from "react-native-google-mobile-ads";

// These should be AD UNIT IDs (with /), not APP IDs (with ~)
// Create these in your AdMob console under Apps > Ad Units > Add Ad Unit > Rewarded
// For now, using test IDs until you create real ad unit IDs
const iosAdUnitId = "ca-app-pub-5238286944896076/XXXXXXXXXX"; // Replace XXXXXXXXXX with your iOS rewarded ad unit ID
const androidAdUnitId = "ca-app-pub-5238286944896076/XXXXXXXXXX"; // Replace XXXXXXXXXX with your Android rewarded ad unit ID

// Always use test IDs in development, or if real IDs aren't set up yet
const getAdUnitId = () => {
  if (__DEV__) {
    return TestIds.REWARDED;
  }

  const adUnitId = Device.osName === "iOS" ? iosAdUnitId : androidAdUnitId;

  // If ad unit ID still contains placeholder, use test ID
  if (adUnitId.includes("XXXXXXXXXX")) {
    console.warn("Using test ad unit ID - please configure real ad unit IDs for production");
    return TestIds.REWARDED;
  }

  return adUnitId;
};

type AdStateListener = (loaded: boolean, error: string | null) => void;

class AdManager {
  private isLoaded = false;
  private isInitialized = false;
  private error: string | null = null;
  private unsubscribers: (() => void)[] = [];
  private rewardedAd: RewardedAd | null = null;
  private static instance: AdManager | null = null;
  private listeners: Set<AdStateListener> = new Set();
  private onRewardCallback: (() => void) | null = null;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await MobileAds().initialize();
      console.log("Google Mobile Ads initialized successfully");
      this.isInitialized = true;
      this.loadAd();
    } catch (err) {
      console.error("Failed to initialize Google Mobile Ads:", err);
      this.error = "Failed to initialize ads";
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.isLoaded, this.error);
    });
  }

  subscribe(listener: AdStateListener) {
    this.listeners.add(listener);
    listener(this.isLoaded, this.error);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private cleanup() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    this.unsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        // Ignore cleanup errors
      }
    });
    this.unsubscribers = [];
  }

  private loadAd() {
    this.cleanup();

    try {
      const newAd = RewardedAd.createForAdRequest(getAdUnitId(), {
        keywords: ["games", "kids", "fun", "education", "learning"],
      });
      this.rewardedAd = newAd;
      this.isLoaded = false;
      this.error = null;
      this.notifyListeners();

      const unsubscribeLoaded = newAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log("Ad loaded successfully");
        this.isLoaded = true;
        this.error = null;
        this.notifyListeners();
      });

      const unsubscribeEarned = newAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log("User earned reward of ", reward);
        if (this.onRewardCallback) {
          this.onRewardCallback();
          this.onRewardCallback = null;
        }
      });

      const unsubscribeClosed = newAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log("Ad closed, loading new ad");
        this.isLoaded = false;
        this.notifyListeners();
        // Load next ad after this one closes
        this.loadAd();
      });

      const unsubscribeError = newAd.addAdEventListener(AdEventType.ERROR, (adError) => {
        console.error("Ad error:", adError);
        this.error = "Failed to load ad";
        this.isLoaded = false;
        this.notifyListeners();
        // Retry after delay
        this.retryTimeout = setTimeout(() => {
          this.loadAd();
        }, 5000);
      });

      this.unsubscribers = [unsubscribeLoaded, unsubscribeEarned, unsubscribeClosed, unsubscribeError];
      newAd.load();
    } catch (err) {
      console.error("Failed to create ad:", err);
      this.error = "Failed to create ad";
      this.notifyListeners();
      this.retryTimeout = setTimeout(() => {
        this.loadAd();
      }, 5000);
    }
  }

  showAd(onReward: () => void): boolean {
    if (this.isLoaded && this.rewardedAd) {
      this.onRewardCallback = onReward;
      try {
        this.rewardedAd.show();
        return true;
      } catch (err) {
        console.error("Failed to show ad:", err);
        this.loadAd();
        return false;
      }
    }
    return false;
  }

  getState() {
    return { loaded: this.isLoaded, error: this.error };
  }
}

const adManager = AdManager.getInstance();

// ============ HOOK ============

function useGoogleAd() {
  const [loaded, setLoaded] = useState(adManager.getState().loaded);
  const [error, setError] = useState<string | null>(adManager.getState().error);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Initialize ads on first mount
    if (!initializedRef.current) {
      initializedRef.current = true;
      adManager.initialize();
    }

    // Subscribe to ad state changes
    const unsubscribe = adManager.subscribe((isLoaded, adError) => {
      setLoaded(isLoaded);
      setError(adError);
    });

    return unsubscribe;
  }, []);

  const showAdForReward = useCallback((onReward: () => void) => {
    return adManager.showAd(onReward);
  }, []);

  return {
    error,
    loaded,
    showAdForReward,
  };
}

export default useGoogleAd;
