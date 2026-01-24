import type { TaskType } from "@/context/app.context.reducer";

// Import all level modules - Metro requires static imports
// To add a new level: 1) Add require below (TOTAL_LEVELS auto-updates)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const levelModules: any[] = [
  null, // index 0 unused (levels start at 1)
  require("@/data/math-1-level"),
  require("@/data/math-2-level"),
  require("@/data/math-3-level"),
  require("@/data/math-4-level"),
  require("@/data/math-5-level"),
  require("@/data/math-6-level"),
  require("@/data/math-7-level"),
  require("@/data/math-8-level"),
  require("@/data/math-9-level"),
  require("@/data/math-10-level"),
  require("@/data/math-11-level"),
  require("@/data/math-12-level"),
  require("@/data/math-13-level"),
  require("@/data/math-14-level"),
  require("@/data/math-15-level"),
  require("@/data/math-16-level"),
  require("@/data/math-17-level"),
  require("@/data/math-18-level"),
  require("@/data/math-19-level"),
  require("@/data/math-20-level"),
  require("@/data/math-21-level"),
  require("@/data/math-22-level"),
  require("@/data/math-23-level"),
  require("@/data/math-24-level"),
  require("@/data/math-25-level"),
  require("@/data/math-26-level"),
  require("@/data/math-27-level"),
  require("@/data/math-28-level"),
  require("@/data/math-29-level"),
  require("@/data/math-30-level"),
  require("@/data/math-31-level"),
  require("@/data/math-32-level"),
  require("@/data/math-33-level"),
  require("@/data/math-34-level"),
  require("@/data/math-35-level"),
  require("@/data/math-36-level"),
  require("@/data/math-37-level"),
  require("@/data/math-38-level"),
  require("@/data/math-39-level"),
  require("@/data/math-40-level"),
  require("@/data/math-41-level"),
  require("@/data/math-42-level"),
  require("@/data/math-43-level"),
  require("@/data/math-44-level"),
  require("@/data/math-45-level"),
  require("@/data/math-46-level"),
  require("@/data/math-47-level"),
  require("@/data/math-48-level"),
  require("@/data/math-49-level"),
  require("@/data/math-50-level"),
  require("@/data/math-51-level"),
];

// Total levels = array length minus the null at index 0
export const TOTAL_LEVELS = levelModules.length - 1;

/**
 * Gets a level's tasks synchronously.
 * Returns null if level doesn't exist.
 */
export function getLevel(levelNumber: number): TaskType[] | null {
  const module = levelModules[levelNumber];
  if (!module) {
    return null;
  }

  // Level exports are named LEVEL_1, LEVEL_2, etc.
  const levelData = module[`LEVEL_${levelNumber}`] as TaskType[];
  return levelData ?? null;
}
