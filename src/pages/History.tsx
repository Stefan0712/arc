import { useLiveQuery } from 'dexie-react-hooks';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { Trash2, History as HistoryIcon } from 'lucide-react';
import { db } from '../db/db';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function History() {
  const logs = useLiveQuery(() => db.logs.reverse().toArray());
  const habits = useLiveQuery(() => db.habits.toArray());


  if (!logs || !habits) return null;

  const habitMap = habits.reduce((acc, h) => {
    acc[h._id!] = h;
    return acc;
  }, {} as Record<string, typeof habits[0]>);

  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = startOfDay(log.timestamp).toISOString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, typeof logs>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM do');
  };

  const handleDeleteLog = async (id: string) => {
    if (confirm('Delete this log entry?')) {
      await db.logs.delete(id);
    }
  };
  

  return (
    <div className="grid grid-rows-[50px_1fr] overflow-hidden gap-6 p-4">
      <header className="flex items-center gap-2">
        <div className="p-2 text-primary rounded">
          <HistoryIcon size={24} />
        </div>
        <h1 className="text-2xl font-bold text-secondary">All Activity</h1>
      </header>

      <div className='flex flex-col h-full overflow-y-auto'>
        {sortedDates.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p>No logs found. Start tracking to see your history!</p>
          </div>
        ) : (
          sortedDates.map((dateStr) => (
            <div key={dateStr} className="flex flex-col gap-3 mb-2">
              <h2 className="text-sm font-bold text-secondary uppercase px-1">
                {formatDateHeader(dateStr)}
              </h2>
              
              <div className="flex flex-col gap-2">
                {groupedLogs[dateStr].map((log) => {
                  const habit = habitMap[log.habitId];
                  if (!habit) return null;

                  return (
                    <div 
                      key={log._id} 
                      className="bg-history-card border border-history-card-border p-4 rounded-cards flex items-center justify-between group"
                    >
                      <Link 
                        to={`/habit/${habit._id}`}
                        className="flex items-center gap-4 flex-1"
                      >
                        <div className={`w-2 h-10 rounded-full`} style={{backgroundColor: habit.color}} />
                        <div className="flex flex-col">
                          <span className="text-primary font-bold">{habit.title}</span>
                          <span className="text-xs text-secondary">
                            {format(log.timestamp, 'h:mm a')} • {log.value} {habit.unit || ''}
                          </span>
                        </div>
                      </Link>

                      <button 
                        onClick={() => log._id && handleDeleteLog(log._id)}
                        className="p-2 text-zinc-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}