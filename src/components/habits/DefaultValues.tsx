import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface DefaultValuesInputProps {
  values: number[];
  onChange: (values: number[]) => void;
}

export default function DefaultValuesInput({ values, onChange }: DefaultValuesInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    
    const num = Number(inputValue);
    if (num > 0 && !isNaN(num) && values.length < 5 && !values.includes(num)) {
      onChange([...values, num]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeValue = (indexToRemove: number) => {
    onChange(values.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-secondary">Quick Log Values (Max 5)</label>
      
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((val, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-1.5 bg-input border border-input-border text-primary px-3 py-1.5 rounded-button text-sm"
            >
              <span className="font-medium">{val}</span>
              <button 
                type="button" 
                onClick={() => removeValue(idx)} 
                className="text-primary hover:text-accent transition-colors"
                aria-label={`Remove ${val}`}
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {values.length < 5 && (
        <div className="flex gap-2">
          <input 
            type="number" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 250"
            className="flex-1 bg-input border border-input-border rounded-input p-3 text-input-text focus:outline-none focus:border-accent"
          />
          <button 
            type="button" 
            onClick={handleAdd}
            disabled={!inputValue}
            className="bg-accent/20 text-accent border border-accent/50 px-4 rounded-button hover:bg-accent hover:text-primary disabled:opacity-50 disabled:hover:bg-accent-600/20 disabled:hover:text-accent-500 transition-colors flex items-center justify-center"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
      
      {values.length === 5 && (
        <p className="text-xs text-orange-400">Maximum of 5 quick values reached.</p>
      )}
    </div>
  );
}