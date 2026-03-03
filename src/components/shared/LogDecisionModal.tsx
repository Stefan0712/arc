import { useState } from 'react';
import { Check, X, AlignLeft, ChevronRight, ChevronLeft, FastForward } from 'lucide-react';
import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { useUIStore } from '../../store/uiStore';
import { clsx } from 'clsx';
import { ObjectId } from 'bson';
import LoadingPage from './Loading';
import { triggerVibration } from '../../utils/haptics';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function LogDecisionModal() {
  const { activeHabitId, closeLogModal } = useUIStore();
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState('');
  const [answer, setAnswer] = useState<'yes' | 'no' | 'skip' | null>(null);

  const settings = useSettingsStore();

  const habit = useLiveQuery(
    () => (activeHabitId ? db.habits.get(activeHabitId) : undefined),
    [activeHabitId]
  );

  const existingLog = useLiveQuery(async () => {
    if (!activeHabitId) return undefined;
    const date = new Date(logDate);
    return await db.logs
      .where('habitId')
      .equals(activeHabitId)
      .filter(log => isSameDay(new Date(log.timestamp), date))
      .first();
  }, [activeHabitId, logDate]);

  const handleLog = async () => {
    if (!activeHabitId || !habit) return;

    const selectedDate = new Date(logDate);
    
    // Find everything on this day for this habit
    const logsOnDay = await db.logs
      .where('habitId')
      .equals(activeHabitId)
      .filter(log => isSameDay(new Date(log.timestamp), selectedDate))
      .toArray();

    if (logsOnDay.length > 0) {
      await Promise.all(logsOnDay.map(l => db.logs.delete(l._id)));
    }

    // Add the new entry
    await db.logs.add({
      _id: new ObjectId().toHexString(),
      habitId: activeHabitId,
      value: answer === 'no' ? 0 : answer === 'yes' ? 1 : 0,
      timestamp: selectedDate,
      snapshotTarget: habit.target || 0,
      isSkipped: answer === 'skip',
      note: note.trim()
    });

    closeLogModal();
  };

  const handlePrevDay = () => {
    const currentDate = parseISO(logDate);
    const prevDate = subDays(currentDate, 1);
    setLogDate(format(prevDate, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const currentDate = parseISO(logDate);
    const nextDate = addDays(currentDate, 1);
    setLogDate(format(nextDate, 'yyyy-MM-dd'));
  };

  const vibrate = () => {
    if(settings.hapticsEnabled) {
      triggerVibration();
    }
  }

  const canSkip = !existingLog?.isSkipped;

  if (!habit) return <LoadingPage />
  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center p-4 backdrop-blur-sm bg-zinc-950/60">
      <div className="w-full bg-boolean border border-boolean-date-border rounded-button overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex flex-col gap-6">
          
          <header className="flex flex items-center justify-between">
              <h3 className="text-xl font-bold text-boolean-header">{habit.title}</h3>
              <button onClick={closeLogModal}><X /></button>
          </header>
          
          <div className="flex items-center gap-2">
            {/* Backward Button */}
            <button 
              onClick={()=>(vibrate(), handlePrevDay())}
              className="p-3 bg-boolean-date border border-boolean-date-border rounded-button text-zinc-400  active:scale-90 transition-all"
              type="button"
            >
              <ChevronLeft size={20} />
            </button>

            {/* The Actual Input Area */}
            <div className="relative flex-1 group">
              <ChevronLeft 
                size={16} 
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" 
              />
              <input
                type="date"
                value={logDate}
                onChange={(e) => (vibrate(), setLogDate(e.target.value))}
                className="w-full bg-boolean-date border border-boolean-date-border rounded-button py-3 pl-11 pr-4 text-sm text-primary transition-all appearance-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Forward Button */}
            <button 
              onClick={()=>(vibrate(), handleNextDay())}
              className="p-3 bg-boolean-date border border-boolean-date-border rounded-xl text-zinc-400 hover:text-primary active:scale-90 transition-all"
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => (vibrate(), setAnswer('yes'))}
              className={clsx(
                "flex flex-col items-center gap-3 p-6 rounded-button border transition-all active:scale-95",
                answer === 'yes'
                  ? "bg-boolean-yes border-boolean-yes text-boolean-yes-text" 
                  : "bg-tranparent border-general text-secondary hover:bg-boolean-yes"
              )}
            >
              <Check size={32} strokeWidth={3} />
              <span className="font-black uppercase tracking-widest text-[10px]">Yes</span>
            </button>

            <button
              onClick={() => (vibrate(), setAnswer('no'))}
              className={clsx(
                "flex flex-col items-center gap-3 p-6 rounded-button border transition-all active:scale-95",
                answer === 'no'
                  ? "bg-boolean-no border-boolean-no-border text-boolean-no-text" 
                  : "bg-tranparent border-general text-secondary hover:bg-boolean-no"
              )}
            >
              <X size={32} strokeWidth={3} />
              <span className="font-black uppercase tracking-widest text-[10px]">No</span>
            </button>
          </div>
            <button
              onClick={() => (vibrate(), setAnswer('skip'))}
              disabled={!canSkip}
              className={clsx(
                "w-full h-14 mt-3 flex items-center justify-center gap-2 p-3 rounded-button border transition-all active:scale-95",
                existingLog?.isSkipped || answer === 'skip'
                  ? "border-accent bg-accent/50 text-on-accent"
                  : "bg-translarent border-boolean-skip-border text-secondary",
                !canSkip && "opacity-30 cursor-not-allowed grayscale pointer-events-none"
              )}
            >
              <FastForward size={18} className='text-white' />
              <span className="font-black uppercase tracking-widest text-[14px]">
                {answer === 'skip' ? "Skipped" : "Skip"}
              </span>
            </button>
            <div className="flex flex-col gap-2 mt-1">
              <label className="flex items-center gap-2 text-[12px] font-black uppercase text-section-title ml-1">
                <AlignLeft size={12} />
                Context / Note
              </label>
              <input
                type="text"
                placeholder="e.g., Felt great today, or skipped because sick..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-input border border-input-border rounded-input p-3 text-sm text-text-input focus:outline-none focus:border-accent transition-all placeholder:text-muted"
              />
            </div>
            <button type='button' className='w-full h-[50px] rounded-button bg-bg-button-focus text-text-button' onClick={()=>(vibrate(), handleLog())}>Save Log</button>
        </div>
      </div>
    </div>
  );
}