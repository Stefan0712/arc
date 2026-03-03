import { clsx } from 'clsx';
import * as Icons from 'lucide-react';

interface IconPickerProps {
  selectedIcon: string;
  onChange: (icon: string) => void;
}

const iconNames = [
  'Activity', 'Droplet', 'BookOpen', 'Dumbbell', 'Coffee', 'Apple', 
  'Moon', 'Sun', 'Zap', 'Target', 'Flame', 'Heart', 
  'Music', 'Pencil', 'Brain', 'Code', 'Gamepad2', 'Leaf', 
  'Briefcase', 'Home', 'PiggyBank', 'Smile', 'Timer', 'Bed'
];

export default function IconPicker({ selectedIcon, onChange }: IconPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-secondary">Icon</label>
      <div className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x">
        {iconNames.map((iconName) => {
          const IconComponent = (Icons as any)[iconName];
          if (!IconComponent) return null; 
          
          const isSelected = selectedIcon === iconName;

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={clsx(
                'w-12 h-12 rounded-button flex items-center justify-center flex-shrink-0 transition-all snap-start',
                isSelected 
                  ? 'bg-icon-btn-active text-icon-btn-text-active border-icon-btn-border-active shadow-lg shadow-accent/20' 
                  : 'bg-icon-btn border border-icon-btn-border text-icon-text hover:bg-accent'
              )}
            >
              <IconComponent size={24} strokeWidth={isSelected ? 2.5 : 2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}