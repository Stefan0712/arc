import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  startOfDay, 
  isSameDay, 
  subDays, 
  getHours, 
  getMinutes 
} from 'date-fns';
import { Clock, TrendingUp, Zap, type LucideIcon, Calendar } from 'lucide-react';
import { db } from '../../db/db';

type Timeframe = 'Day' | 'Week' | 'Month';

interface HabitStatsWidgetProps {
  habitId: string;
}

export default function HabitStatsWidget({ habitId }: HabitStatsWidgetProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('Week');
  
  const habit = useLiveQuery(() => db.habits.get(habitId), [habitId]);
  const logs = useLiveQuery(
    () => db.logs.where('habitId').equals(habitId).toArray(),
    [habitId]
  );

  const stats = useMemo(() => {
    // Ensuring habit exists before calculating
    if (!habit) return null;

    const now = new Date();
    const days = timeframe === 'Day' ? 1 : timeframe === 'Week' ? 7 : 30;

    // Formatting average time or showing placeholder
    let avgTimeLabel = '--:--';
    if (logs && logs.length > 0) {
      const totalMinutes = logs.reduce((acc, log) => {
        const d = new Date(log.timestamp);
        return acc + (getHours(d) * 60 + getMinutes(d));
      }, 0);
      const avgTotalMinutes = totalMinutes / logs.length;
      const hh = Math.floor(avgTotalMinutes / 60);
      const mm = Math.floor(avgTotalMinutes % 60);
      avgTimeLabel = `${hh % 12 || 12}:${mm.toString().padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
    }

    // Calculating success rate even with zero logs
    let successfulDays = 0;
    if (logs) {
      for (let i = 0; i < days; i++) {
        const checkDate = subDays(now, i);
        const dayLogs = logs.filter(l => isSameDay(new Date(l.timestamp), checkDate));
        const daySum = dayLogs.reduce((acc, l) => acc + l.value, 0);

        const isMet = habit.type === 'boolean' 
          ? dayLogs.some(l => l.value === 1)
          : (habit.target ? daySum >= habit.target : dayLogs.length > 0);
        
        if (isMet) successfulDays++;
      }
    }
    const rate = Math.round((successfulDays / days) * 100);

    // Filtering for period volume
    const periodStart = startOfDay(subDays(now, days - 1));
    const periodLogs = logs?.filter(l => new Date(l.timestamp) >= periodStart) || [];
    const dailySums = periodLogs.reduce((acc, log) => {
      const day = startOfDay(new Date(log.timestamp)).toISOString();
      acc[day] = (acc[day] || 0) + log.value;
      return acc;
    }, {} as Record<string, number>);
    
    const activeDaysCount = Object.keys(dailySums).length;
    const avgValue = activeDaysCount > 0 
      ? Object.values(dailySums).reduce((a, b) => a + b, 0) / activeDaysCount
      : 0;

    return {
      avgTime: avgTimeLabel,
      avgValue: avgValue.toFixed(habit.type === 'numeric' ? 1 : 0),
      rate
    };
  }, [habit, logs, timeframe]);

  const toggleTimeframe = () => {
    const sequence: Timeframe[] = ['Day', 'Week', 'Month'];
    const nextIndex = (sequence.indexOf(timeframe) + 1) % sequence.length;
    setTimeframe(sequence[nextIndex]);
  };

  // Only returning null if the habit itself is missing
  if (!habit || !stats) return null;

  return (
    <div className="bg-dashboard-card border border-dashboard-habit-base rounded-cards overflow-hidden shadow-sm mb-6">
      <div className="flex items-center justify-between px-4 py-3">
        <h4 className="text-[12px] font-black uppercase text-secondary">Insights</h4>
        <button 
          onClick={toggleTimeframe}
          className="flex items-center gap-2 px-3 py-1 bg-dashboard-card border border-dashboard-habit-base rounded-button text-[14px] font-black text-accent hover:text-primary transition-colors active:scale-95"
        >
          <Calendar size={16} />
          {timeframe}
        </button>
      </div>

      <div className="grid grid-cols-3">
        <StatCell 
          icon={Clock} 
          label="Avg Time" 
          value={stats.avgTime} 
        />
        <StatCell 
          icon={TrendingUp} 
          label="Avg Daily" 
          value={`${stats.avgValue}${habit.unit || ''}`} 
        />
        <StatCell 
          icon={Zap} 
          label="Success" 
          value={`${stats.rate}%`} 
        />
      </div>
    </div>
  );
}

interface StatCellProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function StatCell({ icon: Icon, label, value }: StatCellProps) {
  return (
    <div className="p-4 flex flex-col gap-1 items-center text-center">
      <Icon size={16} className="text-secondary mb-1" />
      <p className=" font-black text-secondary tracking-tight">{value}</p>
      <p className="text-[12px] font-bold text-muted uppercase tracking-tighter">{label}</p>
    </div>
  );
}