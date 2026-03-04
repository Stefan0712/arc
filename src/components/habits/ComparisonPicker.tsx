import { clsx } from 'clsx';

type ComparisonType = 'less' | 'less_equal' | 'equal' | 'more_equal' | 'more';

interface Props {
  habitType: 'boolean' | 'numeric';
  comparison: ComparisonType;
  setComparison: (val: ComparisonType) => void;
  target: number;
  setTarget: (val: number) => void;
}

const NUMERIC_OPTIONS: { label: string; value: ComparisonType }[] = [
  { label: '<', value: 'less' },
  { label: '≤', value: 'less_equal' },
  { label: '=', value: 'equal' },
  { label: '≥', value: 'more_equal' },
  { label: '>', value: 'more' },
];

export default function CompletionRequirement({ 
  habitType, comparison, setComparison, target, setTarget 
}: Props) {
  
  const isBoolean = habitType === 'boolean';

  // Helper to handle Boolean Toggle
  const handleBooleanToggle = (type: 'equal' | 'less') => {
    setComparison(type);
    setTarget(1); // Force target to 1 for boolean logic
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      
      <div className='w-full flex items-center justify-between'>
        <label className="text-[12px] uppercase text-secondary font-bold">
          {isBoolean ? 'Goal Direction' : 'Completion Requirement'}
        </label>
        {/* Contextual Feedback */}
        <p className="text-[14px] text-muted italic font-bold text-center">
          {isBoolean 
            ? (comparison === 'equal' ? "Standard habit" : "Avoidance habit")
            : `Target: ${comparison.replace('_', ' ')} ${target}`
          }
        </p>
      </div>
      <div className="flex w-full bg-secondary/10 p-1 rounded-button border border-white/5">
        {isBoolean ? (
          <>
            <button
              type="button"
              onClick={() => handleBooleanToggle('equal')}
              className={clsx(
                "flex-1 py-3 text-xs font-bold rounded-button transition-all",
                comparison === 'equal' ? "bg-secondary/10 text-accent shadow-sm" : "text-secondary hover:text-accent"
              )}
            >
              SUCCESS IF "YES"
            </button>
            <button
              type="button"
              onClick={() => handleBooleanToggle('less')}
              className={clsx(
                "flex-1 py-3 text-xs font-bold rounded-button transition-all",
                comparison === 'less' ? "bg-secondary text-accent shadow-sm" : "text-secondary hover:text-accent"
              )}
            >
              SUCCESS IF "NO"
            </button>
          </>
        ) : (
          NUMERIC_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setComparison(opt.value)}
              className={clsx(
                "flex-1 py-3 text-lg font-medium rounded-lg transition-all",
                comparison === opt.value ? "bg-secondary/20 text-accent scale-[1.05]" : "text-muted"
              )}
            >
              {opt.label}
            </button>
          ))
        )}
      </div>
      

    </div>
  );
}