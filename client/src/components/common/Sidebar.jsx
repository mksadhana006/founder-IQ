/**
 * components/common/Sidebar.jsx
 * Navigation sidebar for authenticated dashboard views.
 */

import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      label: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: 'New Idea',
      path: ROUTES.SUBMIT,
      icon: PlusCircle,
    },
    {
      label: 'Validation History',
      path: ROUTES.HISTORY,
      icon: History,
    },
  ];

  return (
    <aside className="fixed top-16 left-0 bottom-0 z-30 w-64 border-r border-white/5 bg-surface-950/40 backdrop-blur-md hidden md:block">
      <div className="flex flex-col gap-1 p-4 h-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path.replace('/:id', '')));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary-600/15 border border-primary-500/30 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}

        {/* Upcoming Features */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Coming Soon</p>
          {[
            { label: 'SWOT Analysis' },
            { label: 'Financial Forecast' },
            { label: 'Pitch Deck Generator' },
            { label: 'Investor Readiness' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs text-slate-600 cursor-not-allowed"
            >
              <span>{item.label}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-primary-600/10 border border-primary-500/20 text-primary-500 text-[10px] font-semibold tracking-wide">
                SOON
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
