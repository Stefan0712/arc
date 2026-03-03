import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckSquare, Square, Infinity as InfinityIcon, Calendar } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { db } from '../../db/db';
import { clsx } from 'clsx';

export default function ExportPage() {
  const navigate = useNavigate();
  const habits = useLiveQuery(() => db.habits.toArray()) || [];
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAllTime, setIsAllTime] = useState(false); // New state
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);

  const toggleHabit = (id: string) => {
    setSelectedHabitIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedHabitIds.length === 0) return alert("Select at least one habit.");

    const allLogs = await db.logs
      .where('habitId')
      .anyOf(selectedHabitIds)
      .toArray();

    // Bypass filter if isAllTime is true
    const filteredLogs = isAllTime 
      ? allLogs 
      : allLogs.filter(log => 
          isWithinInterval(new Date(log.timestamp), {
            start: startOfDay(new Date(startDate)),
            end: endOfDay(new Date(endDate))
          })
        );

    const filteredHabits = habits.filter(h => selectedHabitIds.includes(h._id));

    const exportData = {
      version: "1.0",
      habits: filteredHabits,
      logs: filteredLogs,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isAllTime ? `habit-export-all-time.json` : `habit-export-${startDate}-to-${endDate}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans">
      <header className="p-4 flex items-center gap-4 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-dim hover:text-primary"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black">Export Data</h1>
      </header>

      <main className="p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {/* Time Period Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center ml-1">
            <h2 className="text-xs font-bold uppercase text-secondary">Time Period</h2>
            <button 
              onClick={() => setIsAllTime(!isAllTime)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-2 rounded-button text-[12px] font-bold uppercase transition-all border",
                isAllTime ? "bg-accent border-accent text-white" : "bg-menu-section border-menu-section-border text-secondary"
              )}
            >
              {isAllTime ? <InfinityIcon size={16} /> : <Calendar size={16} />}
              {isAllTime ? "All Time Active" : "Set All Time"}
            </button>
          </div>
          
          <div className={clsx("grid grid-cols-2 gap-2 transition-opacity", isAllTime && "opacity-30 pointer-events-none")}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-input border border-input-border p-3 rounded-input text-sm text-input-text" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-input border border-input-border p-3 rounded-input text-sm text-input-text" />
          </div>
        </section>

        {/* Habit Selection Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center ml-1">
            <h2 className="text-xs font-bold uppercase text-dim">Select Habits</h2>
            <button onClick={() => setSelectedHabitIds(habits.map(h => h._id))} className="text-[10px] text-accent font-bold uppercase">Select All</button>
          </div>
          <div className="bg-menu-section rounded-cards border border-menu-section-border divide-y divide-zinc-800/50">
            {habits.map(habit => (
              <button key={habit._id} onClick={() => toggleHabit(habit._id)} className="w-full flex items-center justify-between p-4 active:bg-action transition-colors">
                <span className="text-sm font-medium">{habit.title}</span>
                {selectedHabitIds.includes(habit._id) ? <CheckSquare size={20} className="text-accent" /> : <Square size={20} className="text-primary" />}
              </button>
            ))}
          </div>
        </section>

        <button onClick={handleExport} className="mt-4 w-full bg-bg-button hover:bg-accent text-on-accent font-bold py-4 rounded-button transition-all flex items-center justify-center gap-2">
          <Download size={20} /> Generate Export
        </button>
      </main>
    </div>
  );
}