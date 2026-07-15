import { useAuth } from '../core/auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Global Search could go here */}
        <h2 className="text-lg font-bold text-slate-900 hidden sm:block">
          Welcome back, {user?.name || 'User'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Button with hover micro-animations */}
        <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-full transition-all duration-200 hover:scale-[1.02]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User Profile Info */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-bold text-slate-900">{user?.name || 'Guest'}</span>
            <span className="text-xs font-medium text-slate-400 capitalize">{user?.role || 'Guest'}</span>
          </div>
          
          <button 
            onClick={logout}
            title="Click to logout"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md hover:scale-[1.05] transition-transform"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
