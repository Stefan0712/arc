import { clsx } from 'clsx';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const colors: string[] = [
  'red', 'orange', 'amber', 'green', 'emerald', 'teal', 'cyan', 
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

const bgMap: Record<string, string> = {
  red: 'bg-red-500', orange: 'bg-orange-500', amber: 'bg-amber-500',
  green: 'bg-green-500', emerald: 'bg-emerald-500', teal: 'bg-teal-500',
  cyan: 'bg-cyan-500', sky: 'bg-sky-500', blue: 'bg-blue-500',
  indigo: 'bg-indigo-500', violet: 'bg-violet-500', purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500', pink: 'bg-pink-500', rose: 'bg-rose-500',
};

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Color</label>
      <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden snap-x">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={clsx(
              'w-12 h-12 rounded-full flex-shrink-0 transition-transform snap-start',
              bgMap[color],
              selectedColor === color ? 'ring-4 ring-white scale-90' : 'ring-0 hover:scale-105'
            )}
            aria-label={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );
}