import { BOSS_LEVEL_INTERVAL } from "@/constants/GameSettings";
import { formatBossTimer, isBossLevel } from "@/utils/bossLevel";

describe("bossLevel utilities", () => {
  it("flags every tenth level as a boss level", () => {
    expect(BOSS_LEVEL_INTERVAL).toBe(10);
    expect(isBossLevel(9)).toBe(false);
    expect(isBossLevel(10)).toBe(true);
    expect(isBossLevel(20)).toBe(true);
  });

  it("formats boss timer text", () => {
    expect(formatBossTimer(90000)).toBe("1:30");
    expect(formatBossTimer(1000)).toBe("0:01");
    expect(formatBossTimer(0)).toBe("0:00");
  });
});
