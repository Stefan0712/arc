import { NavLink } from 'react-router-dom';
import { LayoutGrid, BarChart3, History, Menu } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Habits' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/menu', icon: Menu, label: 'Menu' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-nav pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'nav-text-selected' : 'nav-text'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium nav-text">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}