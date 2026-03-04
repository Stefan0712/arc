import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { startOfDay, endOfDay } from 'date-fns';
import { db } from '../db/db';
import HabitCard from '../components/habits/HabitCard';
import { useEffect, useMemo } from 'react';
import { getHabitDailyStatus } from '../utils/habitStatus';

export interface ProgressStat {
  sum: number;
  count: number;
  latest: number;
  isSkipped: boolean;
}

export default function Dashboard() {
  const habits = useLiveQuery(
    () => db.habits.toArray()
  );

  // Fetch all logs recorded today
  const todayLogs = useLiveQuery(
    () => {
      const now = new Date();
      return db.logs
        .where('timestamp')
        .between(startOfDay(now), endOfDay(now))
        .toArray();
    }
  );
  // Takes the array of raw logs and extract stats for each habit
  const progressStats = useMemo(() => {
    return (todayLogs || []).reduce((acc, log) => {
      if (!acc[log.habitId]) {
        acc[log.habitId] = { sum: 0, count: 0, latest: 0, isSkipped: false };
      }
      acc[log.habitId].sum += log.value;
      acc[log.habitId].count += 1;
      acc[log.habitId].latest = log.value;
      
      // Checking if any log for this habit today is a skip
      if (log.isSkipped) acc[log.habitId].isSkipped = true; 
      
      return acc;
    }, {} as Record<string, ProgressStat>);
  }, [todayLogs]);

  // Sorting habits based on progressStats dictionary
  const { sortedHabits, remainingCount } = useMemo(() => {
  if (!habits) return { sortedHabits: [], remainingCount: 0 };

  const sorted = [...habits].sort((a, b) => {
    const statusA = getHabitDailyStatus(a, progressStats[a._id!]);
    const statusB = getHabitDailyStatus(b, progressStats[b._id!]);
    
    // Both completed and skipped push the habit to the bottom
    const aIsDone = statusA === 'COMPLETED' || statusA === 'SKIPPED';
    const bIsDone = statusB === 'COMPLETED' || statusB === 'SKIPPED';
    
    if (aIsDone === bIsDone) return 0;
    return aIsDone ? 1 : -1;
    });

    // Count remaining (anything that isn't completed or skipped)
    const remaining = habits.filter(h => {
      const status = getHabitDailyStatus(h, progressStats[h._id!]);
      return status !== 'COMPLETED' && status !== 'SKIPPED';
    }).length;

    return { sortedHabits: sorted, remainingCount: remaining };
  }, [habits, progressStats]);

  // Updates tab title dynamically based on the number of habits left
  useEffect(() => {
    if (remainingCount > 0) {
      document.title = `(${remainingCount}) Habits Left`;
    } else if (habits && habits.length > 0) {
      document.title = 'All Done!';
    } else {
      document.title = 'Habit Tracker';
    }
  }, [remainingCount, habits]);

  return (
    <div className="grid grid-rows-[50px_1fr] gap-6 pt-2 h-screen w-full p-4">
      
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-header-title">Today</h1>
          <p className="text-sm text-header-subtitle">Keep up the good work!</p>
        </div>
        
        <Link 
          to="/habit/new"
          className="text-primary p-2.5 bg-dashboard-btn"
        >
          <Plus size={24} strokeWidth={2.5} />
        </Link>
      </header>

      {/* Habits List */}
      {!habits ? (
        <div className="flex justify-center mt-10 h-full">
          <div className="w-8 h-8 border-4 border-subtle border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full mt-20 text-muted gap-4">
          <p>No habits yet.</p>
          <Link to="/habit/new" className="text-bold hover:text-accent font-medium">
            Create your first goal
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-20 overflow-y-auto h-full">
          {sortedHabits.map((habit) => (
              <HabitCard 
                key={habit._id} 
                habit={habit} 
                stats={progressStats[habit._id!] || 0} 
              />
          ))}
        </div>
      )}
    </div>
  );
}