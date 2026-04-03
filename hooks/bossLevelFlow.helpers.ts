export type BossModalMode = "timer" | "retry" | "expired";

type BossFailureTimeArgs = {
  bossDeadlineAt: number | null;
  bossTimeLeftMs: number;
  now?: number;
};

type BossExtraTimeArgs = {
  bossDeadlineAt: number | null;
  bossTimeLeftMs: number;
  bossTotalDurationMs: number;
  bossTimerStarted: boolean;
  extraTimeMs: number;
  now?: number;
};

type BossTimerTickArgs = {
  bossDeadlineAt: number | null;
  now?: number;
};

type BossModalOpenArgs = {
  bossTimerExpired: boolean;
  hasBossRetryState: boolean;
};

type BossRetryModalArgs = {
  bossLevel: boolean;
  currentTaskExists: boolean;
  hasActiveBossRetryCooldown: boolean;
};

type BossAutoRestartArgs = {
  bossLevel: boolean;
  currentTaskExists: boolean;
  hasBossRetryState: boolean;
  hasActiveBossRetryCooldown: boolean;
  isBossTimerModalOpen: boolean;
  isCurrentBossCompleted: boolean;
  isCurrentLevel: boolean;
};

export const roundBossTimeLeftMs = (timeLeftMs: number) => {
  return Math.ceil(Math.max(0, timeLeftMs) / 1000) * 1000;
};

export const getBossRetryWaitRemainingMs = (bossRetryAvailableAt: number | null, now = Date.now()) => {
  if (bossRetryAvailableAt === null) {
    return 0;
  }

  return Math.max(0, bossRetryAvailableAt - now);
};

export const getBossFailureTimeLeftMs = ({ bossDeadlineAt, bossTimeLeftMs, now = Date.now() }: BossFailureTimeArgs) => {
  const remainingTimeMs = bossDeadlineAt ? Math.max(0, bossDeadlineAt - now) : bossTimeLeftMs;
  return roundBossTimeLeftMs(remainingTimeMs);
};

export const getBossTimerTickState = ({ bossDeadlineAt, now = Date.now() }: BossTimerTickArgs) => {
  const rawTimeLeft = bossDeadlineAt ? Math.max(0, bossDeadlineAt - now) : 0;
  const nextTimeLeftMs = roundBossTimeLeftMs(rawTimeLeft);

  return {
    nextTimeLeftMs,
    hasExpired: nextTimeLeftMs === 0,
  };
};

export const getBossModalModeForOpen = ({ bossTimerExpired, hasBossRetryState }: BossModalOpenArgs): BossModalMode => {
  if (hasBossRetryState) {
    return "retry";
  }

  if (bossTimerExpired) {
    return "expired";
  }

  return "timer";
};

export const shouldShowBossRetryModal = ({
  bossLevel,
  currentTaskExists,
  hasActiveBossRetryCooldown,
}: BossRetryModalArgs) => {
  return bossLevel && currentTaskExists && hasActiveBossRetryCooldown;
};

export const shouldAutoRestartBoss = ({
  bossLevel,
  currentTaskExists,
  hasBossRetryState,
  hasActiveBossRetryCooldown,
  isBossTimerModalOpen,
  isCurrentBossCompleted,
  isCurrentLevel,
}: BossAutoRestartArgs) => {
  return (
    bossLevel &&
    currentTaskExists &&
    hasBossRetryState &&
    !hasActiveBossRetryCooldown &&
    !isBossTimerModalOpen &&
    !isCurrentBossCompleted &&
    isCurrentLevel
  );
};

export const getBossExtraTimeState = ({
  bossDeadlineAt,
  bossTimeLeftMs,
  bossTotalDurationMs,
  bossTimerStarted,
  extraTimeMs,
  now = Date.now(),
}: BossExtraTimeArgs) => {
  const nextDeadlineAt = bossTimerStarted ? Math.max(bossDeadlineAt ?? now, now) + extraTimeMs : bossDeadlineAt;

  return {
    nextDeadlineAt,
    nextTimeLeftMs: bossTimerStarted ? Math.max(0, (nextDeadlineAt ?? now) - now) : bossTimeLeftMs + extraTimeMs,
    nextTotalDurationMs: bossTotalDurationMs + extraTimeMs,
  };
};
