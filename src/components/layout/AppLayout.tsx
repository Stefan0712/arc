import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import LogModal from '../shared/LogModal';
import { useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function AppLayout() {

  const settings = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);


  return (
    <div className="h-full w-full grid grid-rows-[1fr_60px] bg-app text-primary font-theme overflow-hidden">
      <Outlet />
      <BottomNav />

      <LogModal />
    </div>
  );
}