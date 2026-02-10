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
// Each milestone defines a day threshold, gem reward, emoji, and display text
export type StreakBonusConfig = {
  day: number;
  gems: number;
  emoji: string;
  title: string;
  description: string;
};

export const STREAK_BONUSES: StreakBonusConfig[] = [
  { day: 3, gems: 25, emoji: "🔥", title: "3 dienas pēc kārtas!", description: "Tu esi ugunī! Turpini tā!" },
  { day: 7, gems: 100, emoji: "⭐", title: "7 dienas pēc kārtas!", description: "Vesela nedēļa! Izcili!" },
  { day: 14, gems: 250, emoji: "🏆", title: "14 dienas pēc kārtas!", description: "Divas nedēļas! Tu esi čempions!" },
  { day: 30, gems: 500, emoji: "👑", title: "30 dienas pēc kārtas!", description: "Vesels mēnesis! Neticami!" },
  { day: 60, gems: 1000, emoji: "💎", title: "60 dienas pēc kārtas!", description: "Divi mēneši! Tu esi leģenda!" },
  { day: 90, gems: 2000, emoji: "🌟", title: "90 dienas pēc kārtas!", description: "Trīs mēneši! Neapturams!" },
  { day: 180, gems: 5000, emoji: "🎯", title: "180 dienas pēc kārtas!", description: "Pusgads! Tu esi varonis!" },
  {
    day: 365,
    gems: 10000,
    emoji: "🏅",
    title: "365 dienas pēc kārtas!",
    description: "Vesels gads! Tu esi absolūts meistars!",
  },
];

// Task count achievement milestones
export type TaskAchievementConfig = {
  gems: number;
  emoji: string;
  title: string;
  taskCount: number;
  description: string;
};

export const TASK_ACHIEVEMENTS: TaskAchievementConfig[] = [
  { taskCount: 10, gems: 15, emoji: "🌱", title: "10 uzdevumi!", description: "Labs sākums! Turpini mācīties!" },
  { taskCount: 25, gems: 30, emoji: "📚", title: "25 uzdevumi!", description: "Tu mācies ātri!" },
  { taskCount: 50, gems: 60, emoji: "🧠", title: "50 uzdevumi!", description: "Tavs prāts kļūst stiprāks!" },
  { taskCount: 100, gems: 120, emoji: "🚀", title: "100 uzdevumi!", description: "Tu esi matemātikas zvaigzne!" },
  { taskCount: 200, gems: 250, emoji: "🏆", title: "200 uzdevumi!", description: "Tu esi čempions!" },
  { taskCount: 500, gems: 500, emoji: "👑", title: "500 uzdevumi!", description: "Tu esi matemātikas karalis!" },
];
