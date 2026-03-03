import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Edit2, Trash2, History as HistoryIcon, FastForward } from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../db/db';
import HabitStatsWidget from '../components/habits/HabitStatsWidget';
import LoadingPage from '../components/shared/Loading';
import { useState } from 'react';
import ConfirmationModal from '../components/layout/ConfirmationModal';
import { AnimatePresence } from 'framer-motion';

export default function Habit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habitId = id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const habit = useLiveQuery(() => (habitId ? db.habits.get(habitId) : undefined), [habitId]);

  const logs = useLiveQuery(
    () => {
      if (habitId) {
        return db.logs.where('habitId').equals(habitId).reverse().toArray();
      }
      return [];
    },
    [habitId]
  );

  const handleDeleteHabit = async (id: string) => {
      await db.transaction('rw', db.habits, db.logs, async () => {
        await db.logs.where('habitId').equals(id).delete();
        await db.habits.delete(habitId);
      });
      navigate('/');
    
  };

  const handleDeleteLog = async (logId: string) => {
    await db.logs.delete(logId);
  };
  if(!habit) return <LoadingPage />

  return (
    <div className="flex flex-col min-h-screen bg-app text-primary">
      <AnimatePresence>
        {showDeleteModal && habitId ? <ConfirmationModal title='Are you sure?' isOpen={showDeleteModal} message='You cannot recover this habit or its logs after deletion' onConfirm={()=>handleDeleteHabit(habitId)} onClose={()=>setShowDeleteModal(false)} /> : null}
      </AnimatePresence>
      <header className="flex items-center justify-between p-4 sticky top-0 z-10 ">
        <button onClick={() => navigate(-1)} className="p-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold truncate px-2">{habit.title}</h1>
        <div className="flex gap-1">
          <Link to={`/habit/${habit._id}/edit`} className="p-2 text-secondary hover:text-accent transition-colors">
            <Edit2 size={20} />
          </Link>
          <button onClick={()=>setShowDeleteModal(true)} className="p-2 text-secondary hover:text-accent transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <main className="p-4 flex flex-col gap-6">
        <HabitStatsWidget habitId={habitId!} />

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <HistoryIcon size={18} />
            <h2 className="font-bold">Recent History</h2>
          </div>

          {!logs || logs.length === 0 ? (
            <div className=" border border-dashed border-secondary rounded-2xl p-8 text-center text-secondary">
              No logs yet. Start by logging from the dashboard!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log) => (
                <div 
                  key={log._id} 
                  className="bg-history-card border border-history-card-border p-4 rounded-cards flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {log.isSkipped ? (
                        <div className="flex items-center gap-1.5 text-secondary">
                          <FastForward size={16} />
                          <span className="text-lg font-bold uppercase tracking-tight">Rest Day</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-secondary">
                          +{log.value} {habit.unit || (habit.type === 'boolean' ? '' : 'units')}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-secondary">
                      {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                    </span>
                    {log.note && (
                      <p className="text-sm text-secondary mt-1 italic italic italic">"{log.note}"</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDeleteLog(log._id)}
                    className="p-2 text-secondary hover:text-accent transition-colors"
                    aria-label="Delete log"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}