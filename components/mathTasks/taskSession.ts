export type TaskSession = {
  getLevelCompletionDurationMs?: () => number;
  isBossLevel?: boolean;
  onBossFailure?: () => void;
  onBossInteraction?: () => void;
  onBossRetryRequest?: () => void;
};
