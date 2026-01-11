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

// Convert minutes to milliseconds for timers
export const LIFE_RESTORE_INTERVAL_MS = LIFE_RESTORE_INTERVAL_MINUTES * 60 * 1000;

// Number of gems earned from watching an ad
export const GEMS_FROM_AD = 10;

// Cost in gems to purchase a hint
export const HINT_COST = 5;

// Cost in gems to remove one incorrect answer
export const REMOVE_WRONG_ANSWER_COST = 8;
