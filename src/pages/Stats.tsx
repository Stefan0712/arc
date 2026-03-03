import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  subWeeks, addWeeks, subMonths, addMonths, 
  format, eachDayOfInterval 
} from 'date-fns';
import { db } from '../db/db';
import StatsHeader from '../components/stats/StatsHeader';
import TimeNavigator from '../components/stats/TimeNavigator';
import GlobalInsights from '../components/stats/GlobalInsights';
import HabitStatsCard from '../components/stats/HabitStatsCard';

export default function Stats() {
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [viewDate, setViewDate] = useState(new Date());

  // Calculate the Range
  const range = useMemo(() => {
    return viewType === 'week' 
      ? { start: startOfWeek(viewDate, { weekStartsOn: 1 }), end: endOfWeek(viewDate, { weekStartsOn: 1 }) }
      : { start: startOfMonth(viewDate), end: endOfMonth(viewDate) };
  }, [viewDate, viewType]);

  // Generate the array of individual days for the Heatmaps/Strips
  const daysInInterval = useMemo(() => 
    eachDayOfInterval({ start: range.start, end: range.end }), 
    [range]
  );

  // Database Queries (0 is unarchived)
  const habits = useLiveQuery(() => db.habits.where('archived').equals(0).toArray());
  const logs = useLiveQuery(
    () => db.logs.where('timestamp').between(range.start, range.end).toArray(), 
    [range]
  );

  if (!habits || !logs) return <div className="p-4 text-muted">Loading Stats...</div>;

  return (
    <div className="grid grid-rows-[40px_40px_auto_1fr] overflow-hidden gap-6 p-3">
      <StatsHeader viewType={viewType} setViewType={setViewType} />
      
      <TimeNavigator 
        label={viewType === 'week' 
          ? `${format(range.start, 'MMM d')} - ${format(range.end, 'MMM d')}` 
          : format(range.start, 'MMMM yyyy')}
        onPrev={() => setViewDate(prev => viewType === 'week' ? subWeeks(prev, 1) : subMonths(prev, 1))}
        onNext={() => setViewDate(prev => viewType === 'week' ? addWeeks(prev, 1) : addMonths(prev, 1))}
      />

      <GlobalInsights 
        habits={habits} 
        logs={logs} 
        daysInPeriod={daysInInterval.length} 
      />

      <div className="flex flex-col gap-4 overflow-y-auto flex-grow-1">
        <h2 className="text-[14px] uppercase font-bold text-secondary px-1">
          Habit Breakdown
        </h2>
        {habits.map(habit => (
          <HabitStatsCard 
            key={habit._id} 
            habit={habit} 
            logs={logs} 
            daysInInterval={daysInInterval}
          />
        ))}
      </div>
    </div>
  );
}