import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore, type Theme } from '../../store/useSettingsStore'; // Import your settings store
import { THEME_ACCENTS } from '../../utils/palettes';

interface ThemeOption {
  id: Theme;
  name: string;
  color: string;
}

const themes: ThemeOption[] = [
  { id: 'amoled', name: 'AMOLED', color: 'bg-black' },
  { id: 'light', name: 'Light', color: 'bg-white' },
  { id: 'dark', name: 'Dark', color: 'bg-zinc-950' },
];

export default function ThemeSettings() {
  const navigate = useNavigate();
  const settings = useSettingsStore();
  
  // Connect to the settings store for accent logic
  const { accentColor, updateSetting, inputRoundness, cardRoundness, buttonRoundness } = useSettingsStore();

  const sliders = [
    { id: 'cardRoundness', label: 'Cards', value: cardRoundness },
    { id: 'buttonRoundness', label: 'Buttons', value: buttonRoundness },
    { id: 'inputRoundness', label: 'Inputs', value: inputRoundness },
  ] as const;

  const resetGeometry = () => {
    updateSetting('buttonRoundness', 12);
    updateSetting('cardRoundness', 8);
    updateSetting('inputRoundness', 8);
  };

  // Get the specific hex array for the currently active theme
  const availableAccents = THEME_ACCENTS[settings.theme] || THEME_ACCENTS.dark;

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Appearance</h1>
      </header>

      <main className="p-4 flex flex-col gap-8 max-w-2xl mx-auto w-full overflow-y-auto mb-20">
        {/* Theme Selection Section */}
        <section>
          <h2 className="text-[14px] font-bold uppercase text-secondary mb-3 ml-2">Themes</h2>
          <div className="bg-menu-section rounded-cards border border-menu-section-border overflow-hidden shadow-xl">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => settings.updateSetting('theme', t.id)}
                className="w-full flex items-center justify-between p-4 active:bg-accent transition-colors border-b border-menu-section-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className={clsx("w-6 h-6 rounded shadow-inner border border-menu-section-border", t.color)} />
                  <span className={clsx(
                    "font-semibold text-sm transition-colors",
                    settings.theme === t.id ? "text-accent" : "text-muted"
                  )}>
                    {t.name}
                  </span>
                </div>
                {settings.theme === t.id && (
                  <Check size={20} className="text-accent" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Accent Color Section */}
        <section>
          <div className="flex items-center justify-between mb-3 ml-2">
            <h2 className="text-[14px] font-bold uppercase text-secondary">Accent Color</h2>
            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">{accentColor}</span>
          </div>
          
          <div className="bg-menu-section rounded-cards border border-menu-section-border p-5 shadow-xl">
            <div className="flex flex-wrap gap-4 justify-between">
              {availableAccents.map((hex: string) => (
                <button
                  key={hex}
                  onClick={() => updateSetting('accentColor', hex)}
                  className="relative group transition-transform active:scale-90"
                >
                  <div 
                    className={clsx(
                      "w-10 h-10 rounded-full border-2 transition-all duration-200",
                      accentColor === hex 
                        ? "border-primary scale-110 shadow-lg" 
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: hex }}
                  />
                  {accentColor === hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check size={18} className="text-white drop-shadow-md" strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[14px] font-bold uppercase text-secondary">Geometry</h2>
            <button 
              onClick={resetGeometry}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-accent hover:opacity-80 transition-opacity"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
          {/* Live Preview Area */}
          <div className="p-8 bg-menu-section rounded-cards border border-menu-section-border flex flex-col gap-4 items-center justify-center">
            <div className="w-full p-4 bg-page rounded-cards border border-menu-section-border shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Card Preview</p>
              <input 
                disabled 
                placeholder="Input Preview" 
                className="w-full px-3 py-2 bg-menu-section border border-menu-section-border rounded-input mb-3"
              />
              <button className="w-full py-2 bg-accent text-white font-bold rounded-button">
                Button Preview
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-menu-section rounded-cards border border-menu-section-border overflow-hidden shadow-xl px-4 py-2">
            {sliders.map((s) => (
              <div key={s.id} className="py-4 border-b border-menu-section-border last:border-0">
                <div className="flex justify-between mb-2 px-1">
                  <span className="text-sm font-semibold text-primary">{s.label}</span>
                  <span className="text-xs font-mono text-accent">{s.value}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={s.value}
                  onChange={(e) => updateSetting(s.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-page rounded-lg cursor-pointer accent-accent"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}