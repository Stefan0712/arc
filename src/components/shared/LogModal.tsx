import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { X, Delete, FastForward, AlignLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { db } from '../../db/db';
import { useUIStore } from '../../store/uiStore';
import LogDecisionModal from './LogDecisionModal';
import { triggerVibration } from '../../utils/haptics';
import { addDays, endOfWeek, format, isSameDay, parseISO, startOfWeek, subDays } from 'date-fns';
import clsx from 'clsx';
import { ObjectId } from 'bson';

export default function LogModal() {
  const { isLogModalOpen, activeHabitId, closeLogModal } = useUIStore();
  const [inputValue, setInputValue] = useState('');
  const [note, setNote] = useState('');
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const habit = useLiveQuery(
    () => activeHabitId ? db.habits.get(activeHabitId) : undefined,
    [activeHabitId]
  );
  // Get all logs from current week
  const weeklyLogs = useLiveQuery(async () => {
    if (!activeHabitId) return [];
    const start = startOfWeek(logDate, { weekStartsOn: 1 });
    const end = endOfWeek(logDate, { weekStartsOn: 1 });
    return await db.logs
      .where('habitId')
      .equals(activeHabitId)
      .filter(log => log.timestamp >= start && log.timestamp <= end)
      .toArray();
  }, [activeHabitId]);

  const logsFromSelectedDay = weeklyLogs?.filter(log => 
    isSameDay(new Date(log.timestamp), new Date(logDate))
  );

  const uniqueSkippedDays = new Set(weeklyLogs?.filter(l => l.isSkipped).map(l => new Date(l.timestamp).toISOString().split('T')[0])).size;
  const canSkip = (habit?.allowedSkipsPerWeek || 0) > uniqueSkippedDays;

  const currentSum = logsFromSelectedDay?.reduce((acc, log) => acc + log.value, 0) || 0;

  if (!isLogModalOpen || !habit) return null;

  const handleClose = () => {
    setInputValue('');
    closeLogModal();
  };


  const handleNumpadClick = (val: string) => {
    triggerVibration(20);
    if (inputValue.length < 6) setInputValue(prev => prev + val);
  };

  const handleDelete = () => {
    triggerVibration(20);
    setInputValue(prev => prev.slice(0, -1));
  };

  const submitLog = async (valueToLog: number) => {
    if (valueToLog <= 0) return;

    // Find and destroy all skip logs for this habit on this day
    const skipLogIds = logsFromSelectedDay?.filter(l => l.isSkipped).map(l => l._id).filter((id): id is string => id !== undefined);

    if (skipLogIds && skipLogIds.length > 0) {
      await Promise.all(skipLogIds.map(id => db.logs.delete(id)));
    }

    triggerVibration(50);
    await db.logs.add({
      _id: new ObjectId().toHexString(),
      habitId: habit._id!,
      value: valueToLog,
      timestamp: new Date(logDate),
      snapshotTarget: habit.target,
      isSkipped: false,
      note: note.trim()
    });
    setInputValue('')
    setNote('')
    setLogDate(format(new Date(), "yyyy-MM-dd"))
    handleClose();
  };

  const handleSkip = async () => {
    if (!canSkip) return;
    if(activeHabitId) {
      triggerVibration(50);
        await db.logs.add({
          _id: new ObjectId().toHexString(),
          habitId: activeHabitId,
          value: 0,
          timestamp: new Date(logDate),
          snapshotTarget: habit.target || 0,
          note: note.trim() || 'Rest day',
          isSkipped: true
        });
        setInputValue('');
        setNote('');
        setLogDate(format(new Date(), "yyyy-MM-dd"))
        closeLogModal();
      }
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

  const percentage = habit && habit.target && habit.target > 0 
  ? Math.min((currentSum / habit.target) * 100, 100) 
  : 0;

  if(habit.type === 'boolean'){ return <LogDecisionModal /> }
  else{
    return (
        <div className="fixed inset-0 z-[100] w-screen h-screen bg-numpad p-6 flex flex-col gap-6 animate-slide-up">
          
          {/* Header */}
          <header className="w-full flex items-center justify-between text-numpad-header mb-1 gap-2">
              <h3 className="text-xl font-bold">{habit.title}</h3>
              <button onClick={closeLogModal}><X /></button>
          </header>
          <div className="flex items-center gap-2">
            {/* Backward Button */}
            <button 
              onClick={handlePrevDay}
              className="p-3 bg-numpad-date-selector border numpad-button-border rounded-button text-primary active:scale-90 transition-all"
              type="button"
            >
              <ChevronLeft size={20} />
            </button>

            {/* The Actual Input Area */}
            <div className="relative flex-1 group ">
              <ChevronLeft 
                size={16} 
                className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors pointer-events-none" 
              />
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-card border numpad-button-border rounded-button py-3 pl-11 pr-4 text-sm date-text appearance-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Forward Button */}
            <button 
              onClick={handleNextDay}
              className="p-3 bg-card border numpad-button-border rounded-button text-nunmpad-value hover:text-dim active:scale-90 transition-all"
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className='w-full grid grid-cols-[1fr_auto] gap-2 items-center'>
            <div className='w-full h-4 rounded-full bg-dashboard-habit-progress'>
              <div 
                  className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: habit.color}}
                />
            </div>
            <div className='w-full p-2 flex items-center justify-center gap-2'>
              <p style={{color: habit.color, fontWeight: 'bold'}}>{currentSum}</p>
              {habit && habit.target && habit.target > 0 ? <p className='text-muted'>/{habit.target} {habit.unit || null}</p> : null}
            </div>
          </div>
          {/* The Input Display */}
          <div className="flex mt-auto items-center justify-center py-2 bg-card rounded-button border numpad-button-border">
            <span className="text-5xl font-bold text-primary">
              {inputValue || '0'}
            </span>
            {inputValue && habit.unit && (
              <span className="ml-2 text-xl text-primary mt-4">{habit.unit}</span>
            )}
          </div>

          {/* Quick Log Default Values */}
          {habit.defaultValues && habit.defaultValues.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x">
              {habit.defaultValues.map((val) => (
                <button
                  key={val}
                  onClick={() => setInputValue(val.toString())}
                  className="whitespace-nowrap flex-shrink-0 snap-start flex items-center justify-center px-5 py-2.5 rounded-button bg-accent/60 border border-numpad-value text-on-accent font-medium active:scale-95 transition-transform"
                >
                  +{val} {habit.unit}
                </button>
              ))}
            </div>
          )}

          {/* Numpad Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumpadClick(num.toString())}
                className="h-16 rounded-button border border-numpad-button-border bg-numpad-button text-2xl font-medium numpad-button-text"
              >
                {num}
              </button>
            ))}
            <button onClick={() => handleNumpadClick('.')} className="h-16 rounded-button border border-numpad-button-border bg-numpad-button text-2xl font-medium numpad-button-text">.</button>
            <button onClick={() => handleNumpadClick('0')} className="h-16 rounded-button border border-numpad-button-border bg-numpad-button text-2xl font-medium numpad-button-text">0</button>
            <button onClick={handleDelete} className="h-16 rounded-button border border-numpad-button-border bg-numpad-button text-2xl font-medium numpad-button-text flex items-center justify-center">
              <Delete size={24} />
            </button>
          </div>
          {/* Context / Note Input */}
          <div className="flex flex-col gap-2 w-full h-[50px] flex-shrink-0 mb-2">
            <label className="flex items-center gap-2 text-[12px] font-bold uppercase text-section-title ml-1">
              <AlignLeft size={12} />
              Context / Note
            </label>
            <input
              type="text"
              placeholder="Optional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-full min-h-[44px] border input text-input border-input-border rounded-input p-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-secondary"
            />
          </div>
          <div className='grid grid-cols-[1fr_3fr] gap-3 h-[50px] flex-shrink-0 items-center'>
            <button
              onClick={handleSkip}
              disabled={!canSkip}
              title={!canSkip ? "No skips left this week" : "Skip / Rest Day"}
              className={clsx(
                "w-full h-full flex items-center justify-center rounded-button transition-all border border-skip-btn",
                canSkip
                  ? "bg-transparent border-subtle text-primary hover:bg-accent hover:text-zinc-200 active:scale-95"
                  : "bg-transparent border-button text-muted cursor-not-allowed"
              )}
            >
              <FastForward size={24} />
            </button>
            <button
              onClick={() => submitLog(Number(inputValue))}
              disabled={!inputValue || Number(inputValue) <= 0}
              className={clsx(
                "w-full h-full transition-all duration-200",
                "flex items-center justify-center",
                "rounded-button font-bold text-lg active:scale-95",
                "bg-bg-numpad-button text-text-numpad-button border-border-numpad-button",
                "border border-border-numpad-button", 
                "disabled:bg-bg-button-disabled disabled:text-text-button-disabled disabled:border-border-button-disabled",
                "active:border-border-button-active"
              )}>
              Log Progress
            </button>
          </div>
        </div>
    );
  }
}