import type { Habit } from '../types/types';

export interface ProgressStat {
  sum: number;
  count: number;
  latest: number;
  isSkipped: boolean;
}

export type HabitDailyStatus = 'COMPLETED' | 'SKIPPED' | 'PARTIAL' | 'PENDING';

export const getHabitDailyStatus = (habit: Habit, stats?: ProgressStat): HabitDailyStatus => {
  if (!stats) return 'PENDING';

  // Did they finish it? (Always overrides a skip)
  const isTargetMet = habit.type === 'boolean' 
    ? stats.latest === 1 
    : (habit.target !== undefined && stats.sum >= habit.target);

  if (isTargetMet) return 'COMPLETED';

  // If not finished, did they log a skip?
  if (stats.isSkipped) return 'SKIPPED';

  // If no skip and not finished, did they log something?
  if (stats.count > 0) return 'PARTIAL';

  // Default state
  return 'PENDING';
};

// Check only if skipped.
export const isSkippedToday = (habit: Habit, stats?: ProgressStat): boolean => {
  return getHabitDailyStatus(habit, stats) === 'SKIPPED';
};