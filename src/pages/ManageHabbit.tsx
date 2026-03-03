import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { db } from '../db/db';
import { clsx } from 'clsx';
import type { HabbitType } from '../types/types';
import IconPicker from '../components/habits/IconPicker';
import ColorPicker from '../components/habits/ColorPicker';
import DefaultValuesInput from '../components/habits/DefaultValues';
import { ObjectId } from 'bson';


export default function ManageHabit() {

  const navigate = useNavigate();
  const {id} = useParams();
  const isEditing = Boolean(id);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabbitType>('numeric');
  const [color, setColor] = useState<string>('blue');
  const [icon, setIcon] = useState('Activity');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [defaultValues, setDefaultValues] = useState<number[]>([]);
  const [allowOneLogPerDay, setAllowOneLogPerDay] = useState(false);
  const [allowedSkips, setAllowedSkips] = useState(0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const habitId = id || new ObjectId().toHexString();
    await db.habits.put({
      _id: habitId,
      title: title.trim(),
      type,
      color,
      icon,
      archived: 0,
      allowOneLogPerDay: type === 'boolean' ? true : allowOneLogPerDay,
      allowedSkipsPerWeek: allowedSkips,
      createdAt: new Date(),
      ...(type === 'numeric' && {
        target: Number(target),
        unit: unit.trim() || 'times',
        defaultValues: defaultValues.length > 0 ? defaultValues : undefined,
      }),
    });

    navigate('/');
  };

  // Inside ManageHabit component:
  useEffect(() => {
    if (id && isEditing) {
      db.habits.get(id).then(habit => {
        if (habit) {
          setTitle(habit.title);
          setType(habit.type);
          setIcon(habit.icon);
          setColor(habit.color);
          setTarget(habit.target?.toString() || '');
          setUnit(habit.unit || '');
          setDefaultValues(habit.defaultValues || []);
          setAllowOneLogPerDay(habit.allowOneLogPerDay || false);
          setAllowedSkips(habit.allowedSkipsPerWeek || 0);
        }
      });
    }
  }, [id]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-app text-primary pb-8">
      <header className="flex items-center justify-between p-4 text-header">
        <button onClick={() => navigate(-1)} className="p-2 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{isEditing ? 'Edit Habit' : 'New Habit'}</h1>
        <div className="w-10" />
      </header>

      <form onSubmit={handleSave} className="p-4 flex flex-col gap-6 flex-1 overflow-y-auto">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-secondary">Habit Name</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Drink Water"
            className="bg-input border border-input-border rounded-input p-3 text-input-text focus:outline-none focus:border-accent"
            required
          />
        </div>

        {/* Type Toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-secondary">Tracking Type</label>
          <div className="flex gap-2">
            {(['numeric', 'boolean'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={clsx(
                  'flex-1 py-2 px-4 rounded-button border border-toggle-border capitalize transition-colors',
                  type === t ? 'bg-accent border-toggle-border-active text-on-accent' : ' bg-card text-secondary'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-secondary">Settings</label>
          <button
            type="button"
            onClick={() => setAllowOneLogPerDay(!allowOneLogPerDay)}
            disabled={type === 'boolean'}
            className={clsx(
              "flex items-center justify-between p-4 rounded-button border border-toggle-border transition-all",
              allowOneLogPerDay || type === 'boolean' 
                ? "bg-toggle-active border-toggle-border-active" 
                : "bg-toggle border-toggle-border",
              type === 'boolean' && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="text-left">
              <p className={clsx(
                "font-medium text-sm",
                allowOneLogPerDay || type === 'boolean' ? "text-on-accent" : "text-secondary"
              )}>
                One log per day
              </p>
              <p className="text-xs text-on-accent">
                {type === 'boolean' 
                  ? "Enabled by default for boolean habits" 
                  : "Useful for tracking weight or mood"}
              </p>
            </div>
            
            {/* Simple Toggle Switch UI */}
            <div className={clsx(
              "w-10 h-6 rounded-full border border-subtle relative transition-colors p-1",
              allowOneLogPerDay || type === 'boolean' ? "bg-accent" : "bg-action"
            )}>
              <div className={clsx(
                "w-4 h-4 bg-white rounded-full border border-subtle transition-transform shadow-sm",
                (allowOneLogPerDay || type === 'boolean') ? "translate-x-4" : "translate-x-0"
              )} />
            </div>
          </button>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm text-secondary">
              Allowed Skips (Per Week)
            </label>
            <div className="grid grid-cols-7 items-center gap-3">
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setAllowedSkips(num)}
                  className={clsx(
                    "w-full aspect-square rounded-button font-bold text-sm transition-all",
                    allowedSkips === num 
                      ? "bg-icon-btn-active text-icon-btn-text-active border-icon-btn-border-active" 
                      : "bg-icon-btn border border-icon-btn-border text-muted hover:bg-icon-btn-active"
                  )}
                >
                  {num === 0 ? '0' : num}
                </button>
              ))}
            </div>
            <p className="text-xs text-secondary mt-1">
              {allowedSkips === 0 
                ? "Strict daily habit. Missing a day breaks your streak." 
                : `You can skip ${allowedSkips} day${allowedSkips > 1 ? 's' : ''} a week without losing your streak.`}
            </p>
          </div>
        </div>
        {/* Numeric-only fields */}
        {type === 'numeric' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-secondary">Daily Target</label>
                <input 
                  type="number" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g., 2000"
                  className="bg-input border border-input-border rounded-input p-3 text-input-text focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-secondary">Unit</label>
                <input 
                  type="text" 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., ml, mins"
                  className="bg-input border border-input-border rounded-input p-3 text-input-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <DefaultValuesInput values={defaultValues} onChange={setDefaultValues} />
          </div>
        )}
        <IconPicker selectedIcon={icon} onChange={setIcon} />
        <ColorPicker selectedColor={color} onChange={setColor} />
        {/* Save Button */}
        <button 
          type="submit"
          className="mt-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent text-on-accent p-4 rounded-button font-bold transition-colors active:scale-95"
        >
          <Save size={20} />
          Save Habit
        </button>
      </form>
    </div>
  );
}