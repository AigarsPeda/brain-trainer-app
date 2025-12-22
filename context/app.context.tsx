import { appReducer, initialState, AppContext, AppContextStateType } from "@/context/app.context.reducer";
import { LIFE_RESTORE_INTERVAL_MS, MAX_LIVES } from "@/constants/GameSettings";
import { useReducer, useEffect, useRef, useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "brain_trainer_app_state";

// Calculate how many lives should be restored based on elapsed time
const calculateRestoredLives = (
  currentLives: number,
  lastLifeLostAt: number | null
): { lives: number; newLastLifeLostAt: number | null } => {
  if (lastLifeLostAt === null || currentLives >= MAX_LIVES) {
    return { lives: currentLives, newLastLifeLostAt: null };
  }

  const elapsed = Date.now() - lastLifeLostAt;
  const livesToRestore = Math.floor(elapsed / LIFE_RESTORE_INTERVAL_MS);

  if (livesToRestore <= 0) {
    return { lives: currentLives, newLastLifeLostAt: lastLifeLostAt };
  }

  const newLives = Math.min(MAX_LIVES, currentLives + livesToRestore);

  // If fully restored, clear the timestamp
  if (newLives >= MAX_LIVES) {
    return { lives: newLives, newLastLifeLostAt: null };
  }

  // Otherwise, update timestamp to account for partial intervals
  const remainingTime = elapsed % LIFE_RESTORE_INTERVAL_MS;
  const newLastLifeLostAt = Date.now() - remainingTime;

  return { lives: newLives, newLastLifeLostAt };
};

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(appReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Load persisted state on app start
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState: AppContextStateType = JSON.parse(savedState);

          // Calculate lives that should be restored while app was closed
          const { lives, newLastLifeLostAt } = calculateRestoredLives(parsedState.lives, parsedState.lastLifeLostAt);

          // Dispatch action to restore state with updated lives
          dispatch({
            type: "HYDRATE_STATE",
            payload: {
              ...parsedState,
              lives,
              lastLifeLostAt: newLastLifeLostAt,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load persisted state:", error);
      } finally {
        setIsLoading(false);
        isInitializedRef.current = true;
      }
    };

    loadPersistedState();
  }, []);

  // Persist state to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const persistState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to persist state:", error);
      }
    };

    persistState();
  }, [state]);

  const scheduleLifeRestore = useCallback(() => {
    clearTimer();

    // Don't schedule if we have max lives or no timestamp
    if (state.lives >= MAX_LIVES || state.lastLifeLostAt === null) {
      return;
    }

    // Calculate remaining time until next life restore
    const elapsed = Date.now() - state.lastLifeLostAt;
    const remaining = Math.max(0, LIFE_RESTORE_INTERVAL_MS - elapsed);

    timerRef.current = setTimeout(() => {
      dispatch({ type: "RESTORE_LIFE" });
    }, remaining);
  }, [state.lives, state.lastLifeLostAt, clearTimer]);

  // Set up the life restoration timer
  useEffect(() => {
    if (isLoading) return;

    scheduleLifeRestore();

    return () => {
      clearTimer();
    };
  }, [scheduleLifeRestore, clearTimer, isLoading]);

  // Show nothing while loading (or you could show a loading spinner)
  if (isLoading) {
    return null;
  }

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
