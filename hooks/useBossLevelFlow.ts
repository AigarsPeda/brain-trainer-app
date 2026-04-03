import {
  BOSS_EXTRA_TIME_COST,
  BOSS_LEVEL_DURATION_MS,
  BOSS_LEVEL_EXTRA_TIME_MS,
  BOSS_RETRY_COST,
  BOSS_RETRY_WAIT_MS,
} from "@/constants/GameSettings";
import type { AppContextActionType } from "@/context/app.context.reducer";
import {
  BossModalMode,
  getBossExtraTimeState,
  getBossFailureTimeLeftMs,
  getBossModalModeForOpen,
  getBossRetryWaitRemainingMs,
  getBossTimerTickState,
  shouldAutoRestartBoss,
  shouldShowBossRetryModal,
} from "@/hooks/bossLevelFlow.helpers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type { BossModalMode };

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
  bossActions: {
    handleBossFailure: () => void;
    handleBossInteraction: () => void;
    handleBossRetryRequest: () => void;
    handleBuyBossExtraTime: () => void;
    handleBuyBossRetry: () => void;
    handleRestartBoss: () => void;
    openBossModal: () => void;
    setBossModalMode: React.Dispatch<React.SetStateAction<BossModalMode>>;
  };
  bossState: {
    bossModalMode: BossModalMode;
    bossRetryWaitRemainingMs: number;
    bossTimerExpired: boolean;
    bossTimerProgress: number;
    bossTimerStarted: boolean;
    bossTimeLeftMs: number;
  };
  resetBossRunState: (shouldHideBossTimerModal?: boolean) => void;
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
      setBossRetryWaitRemainingMs(getBossRetryWaitRemainingMs(bossRetryAvailableAt));
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

      const { hasExpired, nextTimeLeftMs } = getBossTimerTickState({
        bossDeadlineAt: bossDeadlineAtRef.current,
      });

      setBossTimeLeftMs(nextTimeLeftMs);

      if (hasExpired) {
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

    setBossTimeLeftMs(
      getBossFailureTimeLeftMs({
        bossDeadlineAt: bossDeadlineAtRef.current,
        bossTimeLeftMs,
      })
    );
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
    if (
      !shouldShowBossRetryModal({
        bossLevel,
        currentTaskExists,
        hasActiveBossRetryCooldown,
      })
    ) {
      return;
    }

    showBossModal("retry");
  }, [bossLevel, currentTaskExists, hasActiveBossRetryCooldown, showBossModal]);

  useEffect(() => {
    if (
      !shouldAutoRestartBoss({
        bossLevel,
        currentTaskExists,
        hasBossRetryState,
        hasActiveBossRetryCooldown,
        isBossTimerModalOpen,
        isCurrentBossCompleted,
        isCurrentLevel,
      })
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
    showBossModal(
      getBossModalModeForOpen({
        bossTimerExpired,
        hasBossRetryState,
      })
    );
  }, [bossTimerExpired, hasBossRetryState, showBossModal]);

  const handleBuyBossExtraTime = useCallback(() => {
    dispatch({ type: "SPEND_GEMS", payload: BOSS_EXTRA_TIME_COST });

    const { nextDeadlineAt, nextTimeLeftMs, nextTotalDurationMs } = getBossExtraTimeState({
      bossDeadlineAt: bossDeadlineAtRef.current,
      bossTimeLeftMs,
      bossTotalDurationMs,
      bossTimerStarted,
      extraTimeMs: BOSS_LEVEL_EXTRA_TIME_MS,
    });

    bossDeadlineAtRef.current = nextDeadlineAt;
    setBossTotalDurationMs(nextTotalDurationMs);
    setBossTimeLeftMs(nextTimeLeftMs);
    setBossTimerExpired(false);
    hideBossTimerModal();
  }, [bossTimeLeftMs, bossTimerStarted, bossTotalDurationMs, dispatch, hideBossTimerModal]);

  const bossTimerProgress = useMemo(() => {
    if (!bossLevel) {
      return 0;
    }

    return Math.max(0, Math.min(1, bossTimeLeftMs / bossTotalDurationMs));
  }, [bossLevel, bossTimeLeftMs, bossTotalDurationMs]);

  return {
    bossActions: {
      handleBossFailure,
      handleBossInteraction,
      handleBossRetryRequest,
      handleBuyBossExtraTime,
      handleBuyBossRetry,
      handleRestartBoss,
      openBossModal,
      setBossModalMode,
    },
    bossState: {
      bossModalMode,
      bossRetryWaitRemainingMs,
      bossTimerExpired,
      bossTimerProgress,
      bossTimerStarted,
      bossTimeLeftMs,
    },
    resetBossRunState,
  };
}
