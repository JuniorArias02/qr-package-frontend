import { useAuth } from '../core/auth/AuthContext';
import { Menu, X, Bell, Search, ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="p-4 lg:pt-6 lg:px-8 pb-0 z-40">
      <header className="h-16 lg:h-[4.5rem] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-lg shadow-indigo-100/40 rounded-2xl lg:rounded-[2rem] flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
        
        {/* Left Section */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={toggleSidebar}
            className="p-2.5 text-slate-500 hover:text-violet-600 bg-white/50 hover:bg-white border border-slate-100 hover:border-violet-100 rounded-xl transition-all duration-200 hover:scale-[1.05] active:scale-95 shadow-sm"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </h2>
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role || 'Guest'}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 lg:gap-5">
          
          {/* Search (Icon only for visual premium feel) */}
          <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all duration-200 border border-transparent hover:border-slate-100 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-col text-left hidden sm:flex">
                <span className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'User'}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 hidden sm:block ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 transition-all duration-200 origin-top-right ${showProfileMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <div className="px-4 py-3 border-b border-slate-100 mb-2 sm:hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Guest'}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors">
                <UserIcon className="w-4 h-4" />
                My Profile
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
