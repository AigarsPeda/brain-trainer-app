import type { TaskType } from "@/context/app.context.reducer";
import { GENERATED_TOTAL_LEVELS, LEVEL_LOADERS } from "@/data/levelLoaders.generated";

type LevelModule = Partial<Record<`LEVEL_${number}`, TaskType[]>>;
type LevelLoader = () => LevelModule;

const levelCache = new Map<number, TaskType[]>();
export const TOTAL_LEVELS = GENERATED_TOTAL_LEVELS;

export function getLevel(levelNumber: number): TaskType[] | null {
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > TOTAL_LEVELS) {
    return null;
  }

  const cached = levelCache.get(levelNumber);
  if (cached) {
    return cached;
  }

  const loader = LEVEL_LOADERS[levelNumber] as LevelLoader | undefined;
  if (!loader) {
    return null;
  }

  const levelModule = loader();
  const levelData = levelModule[`LEVEL_${levelNumber}`];

  if (!Array.isArray(levelData)) {
    return null;
  }

  levelCache.set(levelNumber, levelData);
  return levelData;
}
