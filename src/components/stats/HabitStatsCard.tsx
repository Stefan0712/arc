import { useMemo } from 'react';
import { isSameDay, isAfter, startOfDay } from 'date-fns';
import type { Habit, Log } from '../../types/types';
import { clsx } from 'clsx';
import { Check, FastForward } from 'lucide-react'; // Added FastForward

interface HabitStatsCardProps {
  habit: Habit;
  logs: Log[];
  daysInInterval: Date[];
}

export default function HabitStatsCard({ habit, logs, daysInInterval }: HabitStatsCardProps) {
  const habitLogs = useMemo(() => logs.filter(l => l.habitId === habit._id), [logs, habit._id]);
  const today = startOfDay(new Date());

  // UPDATED: A "Success" day is now a Day Hit OR a Day Skipped
  const successDays = useMemo(() => {
    return daysInInterval.filter(day => {
      const dayLogs = habitLogs.filter(l => isSameDay(new Date(l.timestamp), day));
      const isSkipped = dayLogs.some(l => l.isSkipped);
      const dailySum = dayLogs.reduce((acc, l) => acc + (l.value || 0), 0);

      if (isSkipped) return true; // Skips count toward the "Days Hit" goal
      if (habit.type === 'boolean') return dayLogs.length > 0;
      if (!habit.target || habit.target === 0) return dayLogs.length > 0;
      return dailySum >= habit.target;
    });
  }, [habitLogs, daysInInterval, habit]); 

  const relevantDaysCount = daysInInterval.filter(day => !isAfter(day, today)).length;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-habit-stats-card border border-habit-stats-card-border p-4 rounded-cards flex flex-col gap-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-secondary">{habit.title}</h3>
          <p className="text-[12px] text-secondary uppercase font-bold">
            {successDays.length} / {relevantDaysCount} Days Hit
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-secondary">
            {habit.target ? `Target: ${habit.target}` : 'No Target'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-2 gap-y-3 w-full">
        {daysInInterval.map((day, i) => {
          const isFuture = isAfter(day, today);
          const dayLogs = habitLogs.filter(l => isSameDay(new Date(l.timestamp), day));
          
          // Check for Skip
          const isSkipped = dayLogs.some(l => l.isSkipped);
          const dailySum = dayLogs.reduce((acc, l) => acc + (l.value || 0), 0);
          
          const progress = habit.target && habit.target > 0 
            ? Math.min(dailySum / habit.target, 1) 
            : 0;

          // A day is "Done" if target met OR it was skipped
          const isDone = isSkipped || (habit.type === 'boolean' ? dayLogs.length > 0 : (habit.target ? dailySum >= habit.target : dayLogs.length > 0));
          const strokeOffset = circumference - progress * circumference;

          return (
            <div key={i} className="relative flex flex-col items-center gap-1 group">
              <div className={clsx(
                "aspect-square w-full rounded-full flex items-center justify-center border border-habit-circle transition-all duration-300 relative",
                isFuture ? "border-skipped" : "bg-circle border-subtle",
                isSkipped && !isFuture && "border-habit-circle-skipped bg-ring-habit-circle-skipped"
              )}>
                
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="text-habit-circle-text"
                    strokeWidth="3"
                    stroke="border-subtle"
                    fill="transparent"
                    r={radius}
                    cx="18"
                    cy="18"
                  />
                  {/* Hide progress ring if skipped, show specific color if done */}
                  {!isSkipped && habit.type === 'numeric' && habit.target && habit.target > 0 && !isFuture && (
                    <circle
                      className="text-habit-circle-text"
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="18"
                      cy="18"
                    />
                  )}
                  {/* Skip Ring Color */}
                  {isSkipped && !isFuture && (
                    <circle
                      className="text-habit-circle-skipped"
                      strokeWidth="3"
                      stroke="border-skipped"
                      fill="transparent"
                      r={radius}
                      cx="18"
                      cy="18"
                    />
                  )}
                  {(habit.type === 'boolean' || !habit.target) && isDone && !isSkipped && !isFuture && (
                    <circle
                      className="text-habit-circle-completed"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="18"
                      cy="18"
                    />
                  )}
                </svg>

                <div className="relative z-10">
                  {isSkipped ? (
                    <FastForward size={14} className="text-skipped" strokeWidth={3} />
                  ) : isDone ? (
                    <Check size={16} className={habit.type === 'boolean' || !habit.target ? "text-accent" : "text-accent"} strokeWidth={3} />
                  ) : (
                    <span className="text-[14px] font-black text-zinc-600 group-hover:text-zinc-300 transition-colors">
                      {i + 1}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}