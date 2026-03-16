import { clsx } from 'clsx';
import { HABIT_COLORS } from '../../utils/palettes';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}
export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Color</label>
      <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
        {HABIT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={clsx(
              'w-12 h-12 rounded-full flex-shrink-0 transition-transform snap-start',
              selectedColor === color ? 'ring-4 ring-white scale-90' : 'ring-0 hover:scale-105'
            )}
            style={{backgroundColor: color}}
            aria-label={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );
}