import { Target, Activity, Zap, Calendar, type LucideIcon } from 'lucide-react';
import { isSameDay, startOfDay } from 'date-fns';
import type { Habit, Log } from '../../types/types';

interface GlobalInsightsProps {
  habits: Habit[];
  logs: Log[];
  daysInPeriod: number;
}

export default function GlobalInsights({ habits, logs, daysInPeriod }: GlobalInsightsProps) {
  
  // Get the total count of "completed" habit-day combinations
  const totalHabitCompletions = habits.reduce((acc, habit) => {
    const habitLogs = logs.filter(l => l.habitId === habit._id);
    
    // Group logs by day to see if the target was met for each day
    const completedDaysForHabit = new Set(
      habitLogs.filter(log => {
        const dayLogs = habitLogs.filter(l => isSameDay(l.timestamp, log.timestamp));
        const dailySum = dayLogs.reduce((sum, curr) => sum + curr.value, 0);

        if (habit.type === 'boolean') return true; 
        if (!habit.target || habit.target === 0) return true; 
        return dailySum >= habit.target;
      }).map(log => startOfDay(log.timestamp).toISOString())
    ).size;

    return acc + completedDaysForHabit;
  }, 0);

  // Calculate the average number of habits finished per day
  const avgDailyCompleted = (totalHabitCompletions / daysInPeriod).toFixed(1);

  // Get unique days with at least one log entry
  const activeDaysCount = new Set(
    logs.map(l => startOfDay(l.timestamp).toISOString())
  ).size;

  // Calculate days in the period where no logging happened
  const missedDays = Math.max(0, daysInPeriod - activeDaysCount);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard 
        icon={<Target size={18}/>} 
        label="Daily Average" 
        value={`${avgDailyCompleted} / ${habits.length}`} 
        color="text-indigo-400" 
      />
      <StatCard 
        icon={<Activity size={18}/>} 
        label="Missed Days" 
        value={missedDays.toString()} 
        color="text-rose-400" 
      />
      <StatCard 
        icon={<Zap size={18}/>} 
        label="Active Days" 
        value={`${activeDaysCount}d`} 
        color="text-amber-500" 
      />
      <StatCard 
        icon={<Calendar size={18}/>} 
        label="Total Logs" 
        value={logs.length.toString()} 
        color="text-emerald-400" 
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-stats-general-card border border-stats-general-card-border text-stats-general-card-text p-4 rounded-cards flex items-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-default-icon-background border border-subtle ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-lg text-secondary font-bold">{value}</p>
        <p className="text-[10px] font-bold uppercase text-muted">{label}</p>
      </div>
    </div>
  );
}