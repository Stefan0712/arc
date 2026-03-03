import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types/types';

interface UIState extends AppSettings {
  setTheme: (theme: AppSettings['theme']) => void;
  
  isLogModalOpen: boolean;
  activeHabitId: string | null;
  openLogModal: (habitId: string) => void;
  closeLogModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        const root = window.document.documentElement;
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      
      isLogModalOpen: false,
      activeHabitId: null,
      openLogModal: (habitId) => set({ isLogModalOpen: true, activeHabitId: habitId }),
      closeLogModal: () => set({ isLogModalOpen: false, activeHabitId: null }),
    }),
    {
      name: 'ui-settings',
      partialize: (state) => ({ theme: state.theme }), 
    }
  )
);