import { HashRouter, Routes, Route } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ManageHabit from './pages/ManageHabbit';
import Habit from './pages/Habit';
import History from './pages/History';
import Stats from './pages/Stats';
import Menu from './pages/Menu';
import GeneralSettings from './pages/Menu/GenerlSettings';
import ThemeSettings from './pages/Menu/Themes';
import DataSettings from './pages/Menu/DataSettings';
import ExportPage from './pages/Menu/Export';
import ImportPage from './pages/Menu/Import';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { NotificationContainer } from './components/layout/NotificationContainer';
import AboutPage from './pages/About';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationContainer />
      
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="stats" element={<Stats />} />
            <Route path="history" element={<History />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/settings" element={<GeneralSettings />} />
            <Route path="menu/themes" element={<ThemeSettings />} />
            <Route path="menu/data" element={<DataSettings />} />
            <Route path="menu/export" element={<ExportPage />} />
            <Route path="menu/import" element={<ImportPage />} />
            <Route path="habit/new" element={<ManageHabit />} />
            <Route path="habit/:id" element={<Habit />} />
            <Route path="habit/:id/edit" element={<ManageHabit />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}