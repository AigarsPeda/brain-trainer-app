export const normalizeLevelParam = (level?: string | string[]) => {
  return Array.isArray(level) ? level[0] : level;
};

export const parseLevelParam = (level?: string | string[]) => {
  const levelParam = normalizeLevelParam(level);
  const levelNumber = Number(levelParam);
  const hasValidLevelNumber = Boolean(levelParam) && Number.isInteger(levelNumber) && levelNumber > 0;

  return {
    levelParam,
    levelNumber,
    hasValidLevelNumber,
  };
};

type BossRetryStateArgs = {
  bossLevel: boolean;
  levelNumber: number;
  lastAttemptedBossLevel: number | null;
  bossRetryAvailableAt: number | null;
  now?: number;
};

export const getBossRetryState = ({
  bossLevel,
  levelNumber,
  lastAttemptedBossLevel,
  bossRetryAvailableAt,
  now = Date.now(),
}: BossRetryStateArgs) => {
  const isCurrentBossRetryLevel = bossLevel && lastAttemptedBossLevel === levelNumber;
  const hasBossRetryState = isCurrentBossRetryLevel && bossRetryAvailableAt !== null;

  return {
    isCurrentBossRetryLevel,
    hasBossRetryState,
    hasActiveBossRetryCooldown: hasBossRetryState && bossRetryAvailableAt > now,
    canRetryBossForFree: hasBossRetryState && bossRetryAvailableAt <= now,
  };
};
