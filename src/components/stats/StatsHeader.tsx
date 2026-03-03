import { clsx } from 'clsx';

interface StatsHeaderProps {
  viewType: 'week' | 'month';
  setViewType: (view: 'week' | 'month') => void;
}

export default function StatsHeader({ viewType, setViewType }: StatsHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-2">
      <h1 className="text-2xl font-bold text-secondary">Stats</h1>
      
      <div className="flex bg-stats-toggle p-1 rounded-button border border-stats-toggle-border">
        {(['week', 'month'] as const).map((type) => {
          const isActive = viewType === type;
          return (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={clsx(
                "relative px-4 py-1.5 text-[12px] font-bold uppercase rounded-button transition-all duration-200",
                isActive 
                  ? "bg-stats-button-selected text-stats-button-text-selected shadow-sm" 
                  : "text-secondary hover:text-stats-button-text-selected"
              )}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}