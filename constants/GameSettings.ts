import type { ImageSourcePropType } from "react-native";
import AchievementIcon10 from "@/assets/images/achievement-icon-10.png";
import AchievementIcon25 from "@/assets/images/achievement-icon-25.png";
import AchievementIcon50 from "@/assets/images/achievement-icon-50.png";
import AchievementIcon100 from "@/assets/images/achievement-icon-100.png";
import AchievementIcon200 from "@/assets/images/achievement-icon-200.png";
import AchievementIcon500 from "@/assets/images/achievement-icon-500.png";
import StreakIcon3 from "@/assets/images/streak-icon-3.png";
import StreakIcon7 from "@/assets/images/streak-icon-7.png";
import StreakIcon14 from "@/assets/images/streak-icon-14.png";
import StreakIcon30 from "@/assets/images/streak-icon-30.png";
import StreakIcon60 from "@/assets/images/streak-icon-60.png";
import StreakIcon90 from "@/assets/images/streak-icon-90.png";
import StreakIcon180 from "@/assets/images/streak-icon-180.png";
import StreakIcon365 from "@/assets/images/streak-icon-365.png";

/**
 * Game settings constants
 * These values can be easily modified to adjust game balance
 */

// Time in minutes before a life is restored
export const LIFE_RESTORE_INTERVAL_MINUTES = 10;

// Maximum number of lives a player can have
export const MAX_LIVES = 5;

// Initial number of lives when starting the game
export const INITIAL_LIVES = 5;

// Initial game state values
export const INITIAL_LEVEL = 1;
export const INITIAL_TASK = 1;
export const DEFAULT_STARS = 0;

// Convert minutes to milliseconds for timers
export const LIFE_RESTORE_INTERVAL_MS = LIFE_RESTORE_INTERVAL_MINUTES * 60 * 1000;

// Number of gems earned from watching an ad
export const GEMS_FROM_AD = 10;

// Cost in gems to purchase a hint
export const HINT_COST = 5;

// Cost in gems to remove one incorrect answer
export const REMOVE_WRONG_ANSWER_COST = 8;

// UI Layout constants
export const ANDROID_TOP_PADDING = 25;
export const LIST_BOTTOM_PADDING = 150;
export const ZIGZAG_CYCLE_LENGTH = 6;
export const ZIGZAG_PEAK = 3;
export const BONUS_MODAL_DELAY_MS = 500;

// Daily streak bonus configuration
// Each milestone defines a day threshold, gem reward, icon, and display text
export type StreakBonusConfig = {
  day: number;
  gems: number;
  icon: ImageSourcePropType;
  title: string;
  description: string;
};

export const STREAK_BONUSES: StreakBonusConfig[] = [
  { day: 3, gems: 25, icon: StreakIcon3, title: "3 dienas pēc kārtas!", description: "Tu esi ugunī! Turpini tā!" },
  { day: 7, gems: 100, icon: StreakIcon7, title: "7 dienas pēc kārtas!", description: "Vesela nedēļa! Izcili!" },
  {
    day: 14,
    gems: 250,
    icon: StreakIcon14,
    title: "14 dienas pēc kārtas!",
    description: "Divas nedēļas! Tu esi čempions!",
  },
  { day: 30, gems: 500, icon: StreakIcon30, title: "30 dienas pēc kārtas!", description: "Vesels mēnesis! Neticami!" },
  {
    day: 60,
    gems: 1000,
    icon: StreakIcon60,
    title: "60 dienas pēc kārtas!",
    description: "Divi mēneši! Tu esi leģenda!",
  },
  { day: 90, gems: 2000, icon: StreakIcon90, title: "90 dienas pēc kārtas!", description: "Trīs mēneši! Neapturams!" },
  {
    day: 180,
    gems: 5000,
    icon: StreakIcon180,
    title: "180 dienas pēc kārtas!",
    description: "Pusgads! Tu esi varonis!",
  },
  {
    day: 365,
    gems: 10000,
    icon: StreakIcon365,
    title: "365 dienas pēc kārtas!",
    description: "Vesels gads! Tu esi absolūts meistars!",
  },
];

// Task count achievement milestones
export type TaskAchievementConfig = {
  gems: number;
  icon: ImageSourcePropType;
  title: string;
  taskCount: number;
  description: string;
};

export const TASK_ACHIEVEMENTS: TaskAchievementConfig[] = [
  {
    taskCount: 10,
    gems: 15,
    icon: AchievementIcon10,
    title: "10 līmeņi!",
    description: "Labs sākums! Turpini mācīties!",
  },
  { taskCount: 25, gems: 30, icon: AchievementIcon25, title: "25 līmeņi!", description: "Tu mācies ātri!" },
  { taskCount: 50, gems: 60, icon: AchievementIcon50, title: "50 līmeņi!", description: "Tavs prāts kļūst stiprāks!" },
  {
    taskCount: 100,
    gems: 120,
    icon: AchievementIcon100,
    title: "100 līmeņi!",
    description: "Tu esi matemātikas zvaigzne!",
  },
  { taskCount: 200, gems: 250, icon: AchievementIcon200, title: "200 līmeņi!", description: "Tu esi čempions!" },
  {
    taskCount: 500,
    gems: 500,
    icon: AchievementIcon500,
    title: "500 līmeņi!",
    description: "Tu esi matemātikas karalis!",
  },
];
