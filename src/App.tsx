import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layout & Pages
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'stats', element: <Stats /> },
      { path: 'history', element: <History /> },
      { path: 'menu', element: <Menu /> },
      { path: 'menu/settings', element: <GeneralSettings /> },
      { path: 'menu/themes', element: <ThemeSettings /> },
      { path: 'menu/data', element: <DataSettings /> },
      { path: 'menu/export', element: <ExportPage /> },
      { path: 'menu/import', element: <ImportPage /> },
      { path: 'habit/new', element: <ManageHabit /> },
      { path: 'habit/:id', element: <Habit /> },
      { path: 'habit/:id/edit', element: <ManageHabit /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
], {
  basename: '/arc/'
});

export default function App() {
  return (
    <ThemeProvider>
      <NotificationContainer />
      
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}