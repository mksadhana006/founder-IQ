/**
 * components/common/Navbar.jsx
 * Top navigation bar with user info, logout, and mobile hamburger menu.
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, LogOut, User, ChevronDown, Menu, X, LayoutDashboard, PlusCircle, History } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const MOBILE_NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'New Idea', path: ROUTES.SUBMIT, icon: PlusCircle },
  { label: 'Validation History', path: ROUTES.HISTORY, icon: History },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 font-display font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Founder-IQ</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Mobile hamburger (only when authenticated) */}
        {user && (
          <button
            id="mobile-menu-button"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all mr-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              id="user-menu-button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-primary-400" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 glass-card py-1 shadow-card z-20 animate-slide-up">
                  <button
                    id="logout-button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-danger-400 hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Nav Drawer */}
      {user && mobileOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-35 bg-surface-950/95 backdrop-blur-md border-b border-white/5 md:hidden animate-slide-up">
            <div className="p-4 space-y-1">
              {MOBILE_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600/15 border border-primary-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-white/5 mt-2">
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-danger-400 hover:bg-white/5 transition-all border border-transparent"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
