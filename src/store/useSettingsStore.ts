import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'amoled';

interface AppSettings {
  theme: Theme;
  accentColor: string;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  buttonRoundness: number;
  cardRoundness: number;
  inputRoundness: number;
  firstDayOfWeek: 'monday' | 'sunday';
}

interface SettingsActions {
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
}

const initialState: AppSettings = {
  theme: 'dark',
  accentColor: '#7c3aed',
  soundEnabled: true,
  hapticsEnabled: true,
  notificationsEnabled: false,
  buttonRoundness: 12,
  cardRoundness: 16,
  inputRoundness: 8,
  firstDayOfWeek: 'monday',
};

export const useSettingsStore = create<AppSettings & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,
      updateSetting: (key, value) => 
        set((state) => ({ ...state, [key]: value })),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'habit-app-settings',
    }
  )
);