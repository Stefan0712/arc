import { Plus, Check, type LucideIcon} from 'lucide-react';
import { clsx } from 'clsx';
import * as Icons from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import type { Habit } from '../../types/types';
import { Link } from 'react-router-dom';
import { getHabitDailyStatus, type ProgressStat } from '../../utils/habitStatus';

interface HabitCardProps {
  habit: Habit;
  stats: ProgressStat;
}

export default function HabitCard({ habit, stats }: HabitCardProps) {
  const { openLogModal } = useUIStore();
  
  // Casting the entire library to a searchable Record of LucideIcons
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[habit.icon] || Icons.Circle;
  
  const status = getHabitDailyStatus(habit, stats);

  const handleLogClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openLogModal(habit._id!);
  };


  const getSubtitle = () => {
    if (habit.type === 'boolean') {
      if (stats.count > 0) {
        return stats.latest === 1 ? 'Yes' : 'No';
      }
      return 'Pending';
    }

    if (!habit.target) {
      return habit.allowOneLogPerDay 
        ? `Logged: ${stats.latest ?? 0} ${habit.unit || ''}` 
        : `Total: ${stats.sum ?? 0} ${habit.unit || ''}`;
    }
    return `${stats.sum ?? 0} / ${habit.target} ${habit.unit || ''}`;
  };

  return (
    <div className={clsx(
      "bg-dashboard-card border border-dashboard-habit-base transition-all duration-300 rounded-dashboard-habit p-4 flex flex-col gap-3 active:scale-[0.98] cursor-pointer",
      status === 'COMPLETED' ? "border-dashboard-habit-completed" : 
      status === 'SKIPPED' ? "border-dashboard-habit-skipped opacity-70" : 
      "border-dashboard-habit-base hover:border-bold"
    )}>
      <div className="flex items-center justify-between">
        <Link to={`/habit/${habit._id}`} className="flex-1">
          <div className="flex items-center gap-3">
            {/* Icon Container */}
            <div className={clsx(
              'p-2.5 rounded-xl transition-colors', 
              status === 'COMPLETED' ? 'border-dashboard-habit-completed text-completed' : 
              status === 'SKIPPED' ? 'bg-skipped text-skipped' : ''
            )}>
              <IconComponent size={24} strokeWidth={2.5} />
            </div>

            {/* Text Content */}
            <div>
              <h3 className={clsx(
                "font-semibold text-lg transition-colors",
                status === 'COMPLETED' ? "text-copmleted" : 
                status === 'SKIPPED' ? "text-skipped" : 
                "text-primary"
              )}>
                {habit.title}
              </h3>
              {/* Override subtitle with "Rest Day" if skipped */}
              <p className="text-dashboard-habit-subtitle text-sm">
                {status === 'SKIPPED' ? 'Skipped' : getSubtitle()}
              </p>
            </div>
          </div>
        </Link>
        
        {/* Dynamic Log Button */}
        <button 
          onClick={handleLogClick}
          className={clsx(
            'h-10 w-10 flex items-center justify-center transition-all active:scale-90',
            status === 'COMPLETED' ? 'text-completed' : 
            status === 'SKIPPED' ? 'text-skipped hover:text-skipped' : 
            'text-primary'
          )}
        >
          {status === 'COMPLETED' ? (
            <Check size={20} strokeWidth={3} />
          ) : status === 'SKIPPED' ? (
            <Icons.FastForward size={20} strokeWidth={2.5} />
          ) : (
            <Plus size={20} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Progress Bar - Only visible for numeric habits that are NOT completed/skipped */}
      {(status === 'PENDING' || status === 'PARTIAL') && habit.type === 'numeric' && habit.target !== undefined && habit.target > 0 && (
        <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden mt-1">
          <div 
            className='h-full transition-all duration-700 ease-out' style={{backgroundColor: habit.color, width: `${Math.min(((stats?.sum || 0) / habit.target) * 100, 100)}%`}}
          />
        </div>
      )}
    </div>
  );
}