import { describe, expect, it } from "@jest/globals";
import {
  getBossExtraTimeState,
  getBossFailureTimeLeftMs,
  getBossModalModeForOpen,
  getBossRetryWaitRemainingMs,
  getBossTimerTickState,
  roundBossTimeLeftMs,
  shouldAutoRestartBoss,
  shouldShowBossRetryModal,
} from "@/hooks/bossLevelFlow.helpers";

describe("bossLevelFlow helpers", () => {
  it("rounds timer values to the next whole second", () => {
    expect(roundBossTimeLeftMs(0)).toBe(0);
    expect(roundBossTimeLeftMs(1)).toBe(1000);
    expect(roundBossTimeLeftMs(3999)).toBe(4000);
  });

  it("calculates retry wait remaining without going negative", () => {
    expect(getBossRetryWaitRemainingMs(null, 1000)).toBe(0);
    expect(getBossRetryWaitRemainingMs(5000, 1000)).toBe(4000);
    expect(getBossRetryWaitRemainingMs(500, 1000)).toBe(0);
  });

  it("derives failure time left from either the deadline or the fallback time", () => {
    expect(
      getBossFailureTimeLeftMs({
        bossDeadlineAt: 5500,
        bossTimeLeftMs: 9000,
        now: 1200,
      })
    ).toBe(5000);

    expect(
      getBossFailureTimeLeftMs({
        bossDeadlineAt: null,
        bossTimeLeftMs: 4500,
      })
    ).toBe(5000);
  });

  it("builds timer tick state and expiry", () => {
    expect(
      getBossTimerTickState({
        bossDeadlineAt: 8200,
        now: 1500,
      })
    ).toEqual({
      nextTimeLeftMs: 7000,
      hasExpired: false,
    });

    expect(
      getBossTimerTickState({
        bossDeadlineAt: 2000,
        now: 2500,
      })
    ).toEqual({
      nextTimeLeftMs: 0,
      hasExpired: true,
    });
  });

  it("derives modal mode priority when opening the boss modal", () => {
    expect(getBossModalModeForOpen({ bossTimerExpired: false, hasBossRetryState: false })).toBe("timer");
    expect(getBossModalModeForOpen({ bossTimerExpired: true, hasBossRetryState: false })).toBe("expired");
    expect(getBossModalModeForOpen({ bossTimerExpired: true, hasBossRetryState: true })).toBe("retry");
  });

  it("decides when to show retry modal or auto-restart", () => {
    expect(
      shouldShowBossRetryModal({
        bossLevel: true,
        currentTaskExists: true,
        hasActiveBossRetryCooldown: true,
      })
    ).toBe(true);

    expect(
      shouldAutoRestartBoss({
        bossLevel: true,
        currentTaskExists: true,
        hasBossRetryState: true,
        hasActiveBossRetryCooldown: false,
        isBossTimerModalOpen: false,
        isCurrentBossCompleted: false,
        isCurrentLevel: true,
      })
    ).toBe(true);

    expect(
      shouldAutoRestartBoss({
        bossLevel: true,
        currentTaskExists: true,
        hasBossRetryState: true,
        hasActiveBossRetryCooldown: true,
        isBossTimerModalOpen: false,
        isCurrentBossCompleted: false,
        isCurrentLevel: true,
      })
    ).toBe(false);
  });

  it("calculates extra time for idle and active timers", () => {
    expect(
      getBossExtraTimeState({
        bossDeadlineAt: null,
        bossTimeLeftMs: 10000,
        bossTotalDurationMs: 30000,
        bossTimerStarted: false,
        extraTimeMs: 5000,
        now: 1000,
      })
    ).toEqual({
      nextDeadlineAt: null,
      nextTimeLeftMs: 15000,
      nextTotalDurationMs: 35000,
    });

    expect(
      getBossExtraTimeState({
        bossDeadlineAt: 10000,
        bossTimeLeftMs: 4000,
        bossTotalDurationMs: 30000,
        bossTimerStarted: true,
        extraTimeMs: 5000,
        now: 6000,
      })
    ).toEqual({
      nextDeadlineAt: 15000,
      nextTimeLeftMs: 9000,
      nextTotalDurationMs: 35000,
    });
  });
});
