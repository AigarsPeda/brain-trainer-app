import { LIFE_RESTORE_INTERVAL_MS, MAX_LIVES } from "@/constants/GameSettings";
import { AppContext, AppContextStateType, appReducer, initialState } from "@/context/app.context.reducer";
import { calculateRestoredLives } from "@/utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

const STORAGE_KEY = "brain_trainer_app_state";

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const isInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(appReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState: AppContextStateType = JSON.parse(savedState);
          const { lives, newLastLifeLostAt } = calculateRestoredLives(parsedState.lives, parsedState.lastLifeLostAt);

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

    if (state.lives >= MAX_LIVES || state.lastLifeLostAt === null) {
      return;
    }

    const elapsed = Date.now() - state.lastLifeLostAt;
    const remaining = Math.max(0, LIFE_RESTORE_INTERVAL_MS - elapsed);

    timerRef.current = setTimeout(() => {
      dispatch({ type: "RESTORE_LIFE" });
    }, remaining);
  }, [state.lives, state.lastLifeLostAt, clearTimer]);

  useEffect(() => {
    if (isLoading) return;

    scheduleLifeRestore();

    return () => {
      clearTimer();
    };
  }, [scheduleLifeRestore, clearTimer, isLoading]);

  if (isLoading) {
    return null;
  }

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
