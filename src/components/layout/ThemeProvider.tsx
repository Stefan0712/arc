import { useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', settings.theme);

    root.style.setProperty('--border-radius-button', `${settings.buttonRoundness}px`);
    root.style.setProperty('--border-radius-cards', `${settings.cardRoundness}px`);
    root.style.setProperty('--border-radius-input', `${settings.inputRoundness}px`);

    root.style.setProperty('--color-accent', settings.accentColor);
    

  }, [settings]);

  return <>{children}</>;
};