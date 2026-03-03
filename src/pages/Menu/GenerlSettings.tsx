import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Bell, Volume2, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function GeneralSettings() {
  const navigate = useNavigate();
  const { 
    hapticsEnabled, 
    soundEnabled, 
    notificationsEnabled, 
    firstDayOfWeek, 
    updateSetting 
  } = useSettingsStore();

  const toggleSetting = (key: 'hapticsEnabled' | 'soundEnabled' | 'notificationsEnabled') => {
    const currentValue = useSettingsStore.getState()[key];
    updateSetting(key, !currentValue);
    
    if (key === 'hapticsEnabled' && !currentValue && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="min-h-screen bg-app text-primary flex flex-col font-sans">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">General</h1>
      </header>

      <main className="p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-secondary ml-1">Device Feedback</h2>
          <div className="bg-menu-section rounded-cards border border-menu-section-border divide-y divide-menu-section-border shadow-xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-icon-background rounded-lg text-primary">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Haptic Feedback</p>
                  <p className="text-xs text-secondary">Vibrate on interactions</p>
                </div>
              </div>
              <Toggle active={hapticsEnabled} onToggle={() => toggleSetting('hapticsEnabled')} />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-icon-background rounded-lg text-primary">
                  <Volume2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Sound Effects</p>
                  <p className="text-xs text-secondary">Audio feedback for actions</p>
                </div>
              </div>
              <Toggle active={soundEnabled} onToggle={() => toggleSetting('soundEnabled')} />
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-secondary ml-1">Notifications</h2>
          <div className="bg-menu-section rounded-cards border border-menu-section-border shadow-xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-icon-background rounded-lg text-primary">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Enable Notifications</p>
                  <p className="text-xs text-secondary">Daily reminders and alerts</p>
                </div>
              </div>
              <Toggle active={notificationsEnabled} onToggle={() => toggleSetting('notificationsEnabled')} />
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-secondary ml-1">Calendar</h2>
          <div className="bg-menu-section rounded-cards border border-menu-section-border shadow-xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-icon-background rounded-lg text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">First Day of Week</p>
                  <p className="text-xs text-secondary">Customize calendar layout</p>
                </div>
              </div>
              <select 
                value={firstDayOfWeek}
                onChange={(e) => updateSetting('firstDayOfWeek', e.target.value as 'monday' | 'sunday')}
                className="bg-transparent text-sm font-bold text-accent outline-none cursor-pointer"
              >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={clsx(
        "w-11 h-6 rounded-full p-1 transition-all flex items-center border border-menu-toggle-border",
        active ? 'bg-accent justify-end border-transparent' : 'bg-menu-toggle'
      )}
    >
      <div className={clsx(
        "w-4 h-4 rounded-full transition-all shadow-sm",
        active ? 'bg-white' : 'bg-toggle-core'
      )} />
    </button>
  );