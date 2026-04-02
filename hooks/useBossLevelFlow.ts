import {
  BOSS_EXTRA_TIME_COST,
  BOSS_LEVEL_DURATION_MS,
  BOSS_LEVEL_EXTRA_TIME_MS,
  BOSS_RETRY_COST,
  BOSS_RETRY_WAIT_MS,
} from "@/constants/GameSettings";
import type { AppContextActionType } from "@/context/app.context.reducer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type BossModalMode = "timer" | "retry" | "expired";

type UseBossLevelFlowArgs = {
  bossLevel: boolean;
  levelNumber: number;
  gems: number;
  currentTaskExists: boolean;
  bossRetryAvailableAt: number | null;
  hasBossRetryState: boolean;
  hasActiveBossRetryCooldown: boolean;
  canRetryBossForFree: boolean;
  isCurrentBossCompleted: boolean;
  isCurrentLevel: boolean;
  isBossTimerModalOpen: boolean;
  dispatch: React.Dispatch<AppContextActionType>;
  resetTaskUiState: () => void;
  onLevelRestarted: () => void;
  showBossTimerModal: () => void;
  hideBossTimerModal: () => void;
};

type UseBossLevelFlowResult = {
  bossModalMode: BossModalMode;
  bossRetryWaitRemainingMs: number;
  bossTimerExpired: boolean;
  bossTimerProgress: number;
  bossTimerStarted: boolean;
  bossTimeLeftMs: number;
  handleBossFailure: () => void;
  handleBossInteraction: () => void;
  handleBossRetryRequest: () => void;
  handleBuyBossExtraTime: () => void;
  handleBuyBossRetry: () => void;
  handleRestartBoss: () => void;
  openBossModal: () => void;
  resetBossRunState: (shouldHideBossTimerModal?: boolean) => void;
  setBossModalMode: React.Dispatch<React.SetStateAction<BossModalMode>>;
};

export function useBossLevelFlow({
  bossLevel,
  levelNumber,
  gems,
  currentTaskExists,
  bossRetryAvailableAt,
  hasBossRetryState,
  hasActiveBossRetryCooldown,
  canRetryBossForFree,
  isCurrentBossCompleted,
  isCurrentLevel,
  isBossTimerModalOpen,
  dispatch,
  resetTaskUiState,
  onLevelRestarted,
  showBossTimerModal,
  hideBossTimerModal,
}: UseBossLevelFlowArgs): UseBossLevelFlowResult {
  const bossDeadlineAtRef = useRef<number | null>(null);
  const [bossTimeLeftMs, setBossTimeLeftMs] = useState(BOSS_LEVEL_DURATION_MS);
  const [bossTotalDurationMs, setBossTotalDurationMs] = useState(BOSS_LEVEL_DURATION_MS);
  const [bossTimerStarted, setBossTimerStarted] = useState(false);
  const [bossTimerExpired, setBossTimerExpired] = useState(false);
  const [bossModalMode, setBossModalMode] = useState<BossModalMode>("timer");
  const [bossRetryWaitRemainingMs, setBossRetryWaitRemainingMs] = useState(0);

  const showBossModal = useCallback(
    (mode: BossModalMode) => {
      setBossModalMode(mode);
      showBossTimerModal();
    },
    [showBossTimerModal]
  );

  const resetBossRunState = useCallback(
    (shouldHideBossTimerModal = false) => {
      bossDeadlineAtRef.current = null;
      setBossTimeLeftMs(BOSS_LEVEL_DURATION_MS);
      setBossTotalDurationMs(BOSS_LEVEL_DURATION_MS);
      setBossTimerStarted(false);
      setBossTimerExpired(false);
      setBossModalMode("timer");

      if (shouldHideBossTimerModal) {
        hideBossTimerModal();
      }
    },
    [hideBossTimerModal]
  );

  useEffect(() => {
    if (!bossLevel || !hasBossRetryState || bossRetryAvailableAt === null) {
      setBossRetryWaitRemainingMs(0);
      return;
    }

    const updateRetryWait = () => {
      setBossRetryWaitRemainingMs(Math.max(0, bossRetryAvailableAt - Date.now()));
    };

    updateRetryWait();
    const interval = setInterval(updateRetryWait, 1000);

    return () => clearInterval(interval);
  }, [bossLevel, bossRetryAvailableAt, hasBossRetryState]);

  useEffect(() => {
    if (!bossLevel || !bossTimerStarted || bossTimerExpired) {
      return;
    }

    const updateBossTimer = () => {
      if (!bossDeadlineAtRef.current) {
        return;
      }

      const rawTimeLeft = Math.max(0, bossDeadlineAtRef.current - Date.now());
      const nextTimeLeft = Math.ceil(rawTimeLeft / 1000) * 1000;
      setBossTimeLeftMs(nextTimeLeft);

      if (nextTimeLeft === 0) {
        dispatch({ type: "SET_BOSS_RETRY_COOLDOWN", payload: Date.now() + BOSS_RETRY_WAIT_MS });
        setBossTimerExpired(true);
        showBossModal("expired");
      }
    };

    updateBossTimer();
    const interval = setInterval(updateBossTimer, 1000);

    return () => clearInterval(interval);
  }, [bossLevel, bossTimerExpired, bossTimerStarted, dispatch, showBossModal]);

  const handleBossInteraction = useCallback(() => {
    if (!bossLevel || bossTimerStarted || bossTimerExpired) {
      return;
    }

    dispatch({ type: "SET_LAST_ATTEMPTED_BOSS_LEVEL", payload: levelNumber });
    bossDeadlineAtRef.current = Date.now() + bossTimeLeftMs;
    setBossTimerStarted(true);
  }, [bossLevel, bossTimeLeftMs, bossTimerExpired, bossTimerStarted, dispatch, levelNumber]);

  const handleBossFailure = useCallback(() => {
    if (!bossLevel) {
      return;
    }

    const remainingTimeMs = bossDeadlineAtRef.current
      ? Math.max(0, bossDeadlineAtRef.current - Date.now())
      : bossTimeLeftMs;
    const nextTimeLeft = Math.ceil(remainingTimeMs / 1000) * 1000;

    setBossTimeLeftMs(nextTimeLeft);
    setBossTimerStarted(false);
    bossDeadlineAtRef.current = null;
  }, [bossLevel, bossTimeLeftMs]);

  const handleRestartBoss = useCallback(() => {
    dispatch({ type: "SET_BOSS_RETRY_COOLDOWN", payload: null });
    dispatch({
      type: "RESTART_LEVEL",
      payload: { level: levelNumber },
    });
    resetTaskUiState();
    resetBossRunState();
    onLevelRestarted();
    hideBossTimerModal();
  }, [dispatch, hideBossTimerModal, levelNumber, onLevelRestarted, resetBossRunState, resetTaskUiState]);

  useEffect(() => {
    if (!bossLevel || !currentTaskExists || !hasActiveBossRetryCooldown) {
      return;
    }

    showBossModal("retry");
  }, [bossLevel, currentTaskExists, hasActiveBossRetryCooldown, showBossModal]);

  useEffect(() => {
    if (
      !bossLevel ||
      !currentTaskExists ||
      !hasBossRetryState ||
      hasActiveBossRetryCooldown ||
      isBossTimerModalOpen ||
      isCurrentBossCompleted ||
      !isCurrentLevel
    ) {
      return;
    }

    handleRestartBoss();
  }, [
    bossLevel,
    currentTaskExists,
    handleRestartBoss,
    hasActiveBossRetryCooldown,
    hasBossRetryState,
    isBossTimerModalOpen,
    isCurrentBossCompleted,
    isCurrentLevel,
  ]);

  const handleBuyBossRetry = useCallback(() => {
    dispatch({ type: "SPEND_GEMS", payload: BOSS_RETRY_COST });
    handleRestartBoss();
  }, [dispatch, handleRestartBoss]);

  const handleBossRetryRequest = useCallback(() => {
    if (canRetryBossForFree) {
      handleRestartBoss();
      return;
    }

    if (gems >= BOSS_RETRY_COST) {
      handleBuyBossRetry();
      return;
    }

    showBossModal("retry");
  }, [canRetryBossForFree, gems, handleBuyBossRetry, handleRestartBoss, showBossModal]);

  const openBossModal = useCallback(() => {
    if (hasBossRetryState) {
      showBossModal("retry");
      return;
    }

    if (bossTimerExpired) {
      showBossModal("expired");
      return;
    }

    showBossModal("timer");
  }, [bossTimerExpired, hasBossRetryState, showBossModal]);

  const handleBuyBossExtraTime = useCallback(() => {
    dispatch({ type: "SPEND_GEMS", payload: BOSS_EXTRA_TIME_COST });

    if (bossTimerStarted) {
      const currentDeadline = bossDeadlineAtRef.current ?? Date.now();
      bossDeadlineAtRef.current = Math.max(currentDeadline, Date.now()) + BOSS_LEVEL_EXTRA_TIME_MS;
    }

    setBossTotalDurationMs((previousTotalDuration) => previousTotalDuration + BOSS_LEVEL_EXTRA_TIME_MS);
    setBossTimeLeftMs((previousTimeLeft) =>
      bossTimerStarted
        ? Math.max(0, (bossDeadlineAtRef.current ?? Date.now()) - Date.now())
        : previousTimeLeft + BOSS_LEVEL_EXTRA_TIME_MS
    );
    setBossTimerExpired(false);
    hideBossTimerModal();
  }, [bossTimerStarted, dispatch, hideBossTimerModal]);

  const bossTimerProgress = useMemo(() => {
    if (!bossLevel) {
      return 0;
    }

    return Math.max(0, Math.min(1, bossTimeLeftMs / bossTotalDurationMs));
  }, [bossLevel, bossTimeLeftMs, bossTotalDurationMs]);

  return {
    bossModalMode,
    bossRetryWaitRemainingMs,
    bossTimerExpired,
    bossTimerProgress,
    bossTimerStarted,
    bossTimeLeftMs,
    handleBossFailure,
    handleBossInteraction,
    handleBossRetryRequest,
    handleBuyBossExtraTime,
    handleBuyBossRetry,
    handleRestartBoss,
    openBossModal,
    resetBossRunState,
    setBossModalMode,
  };
}
