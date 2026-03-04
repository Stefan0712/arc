import type { Habit } from '../types/types';

export interface ProgressStat {
  sum: number;
  count: number;
  latest: number;
  isSkipped: boolean;
}

export type HabitDailyStatus = 'COMPLETED' | 'SKIPPED' | 'PARTIAL' | 'PENDING';

// Get a status to decide how to render the UI
export const getHabitDailyStatus = (habit: Habit, stats?: ProgressStat): HabitDailyStatus => {
  if (!stats) return 'PENDING';

  // If the target is met, it is market as completed, even if it was skipped. Complete status > skipped status
  const isTargetMet = habit.type === 'boolean' 
    ? stats.latest === 1 
    : (habit.target !== undefined && stats.sum >= habit.target);

  if (isTargetMet) return 'COMPLETED';

  // If not finished, check if it's skipped
  if (stats.isSkipped) return 'SKIPPED';

  // If no skip and not finished, then it it's still in progress
  if (stats.count > 0) return 'PARTIAL';

  // Default state
  return 'PENDING';
};

// Check only if skipped.
export const isSkippedToday = (habit: Habit, stats?: ProgressStat): boolean => {
  return getHabitDailyStatus(habit, stats) === 'SKIPPED';
};