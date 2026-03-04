import type { Habit } from '../types/types';

export interface ProgressStat {
  sum: number;
  count: number;
  latest: number;
  isSkipped: boolean;
}

// Keeping your original status names for consistency
export type HabitDailyStatus = 'COMPLETED' | 'SKIPPED' | 'PARTIAL' | 'PENDING' | 'FAILED';

export const getHabitDailyStatus = (habit: Habit, stats?: ProgressStat): HabitDailyStatus => {
  if (!stats || stats.count === 0) return 'PENDING';

  const target = habit.target ?? 0;
  const comparison = habit.comparison || 'more_equal';

  // 1. COMPLETED CHECK (Target Met)
  const isTargetMet = () => {
    switch (comparison) {
      case 'less': return stats.sum < target;
      case 'less_equal': return stats.sum <= target;
      case 'equal': return stats.sum === target;
      case 'more': return stats.sum > target;
      case 'more_equal':
      default: return stats.sum >= target;
    }
  };

  if (isTargetMet()) return 'COMPLETED';

  // 2. SKIPPED CHECK (Only if target isn't already met)
  if (stats.isSkipped) return 'SKIPPED';

  // 3. FAILED CHECK (Specific to "Less Than" habits)
  // If you are tracking "Less than 2 coffees" and you've had 3, you've already failed.
  if (comparison === 'less' || comparison === 'less_equal') {
    if (stats.sum > target) return 'FAILED';
  }

  // 4. PARTIAL CHECK
  // If no skip and not finished/failed, but they logged something
  return 'PARTIAL';
};

export const isSkippedToday = (habit: Habit, stats?: ProgressStat): boolean => {
  return getHabitDailyStatus(habit, stats) === 'SKIPPED';
};