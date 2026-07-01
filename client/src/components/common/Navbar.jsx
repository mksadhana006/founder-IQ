/**
 * components/common/Navbar.jsx
 * Top navigation bar with user info and logout.
 */

import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
      {/* Brand */}
      <Link to="/dashboard" className="flex items-center gap-2.5 font-display font-bold text-xl">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow-sm">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="gradient-text">Startup Validator</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

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
  );
};

export default Navbar;
