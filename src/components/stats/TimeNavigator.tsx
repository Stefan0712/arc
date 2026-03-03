import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function TimeNavigator({ label, onPrev, onNext }: TimeNavigatorProps) {
  return (
    <div className="flex items-center justify-between text-stats-date-text bg-stats-date border border-stats-date-border p-1 rounded-button">
      <button onClick={onPrev} className="p-2 hover:text-primary text-secondary transition-colors">
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-medium tracking-tight">
        {label}
      </span>
      <button onClick={onNext} className="p-2 hover:text-primary text-secondary transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}