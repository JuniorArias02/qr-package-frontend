import { NavLink } from 'react-router-dom';
import { getMenuItems } from '../config/menu.config';

const Sidebar = ({ role, isOpen, onClose }) => {
  // Navigation links based on roles
  const filteredLinks = getMenuItems(role);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          ${isOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-[104px]'}
          bg-white/80 backdrop-blur-2xl border border-white shadow-2xl shadow-indigo-500/5 
          lg:my-6 lg:ml-6 lg:rounded-[2.5rem] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap
        `}
      >
        <div className="h-24 flex items-center justify-center overflow-hidden shrink-0 pt-2 relative">
          {isOpen ? (
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-700 tracking-tight transition-all duration-300">
              QR Package
            </h1>
          ) : (
            <div className="hidden lg:flex w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-700 rounded-[1.25rem] items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-black text-xl hover:rotate-6 transition-transform duration-300 cursor-pointer">
              QR
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3 overflow-x-hidden scrollbar-hide">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024 && isOpen) {
                    onClose();
                  }
                }}
                title={!isOpen ? link.name : undefined}
                className={({ isActive }) =>
                  `flex items-center ${isOpen ? 'gap-4 px-5' : 'justify-center mx-1'} py-4 rounded-2xl font-bold transition-all duration-300 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]'
                      : 'text-slate-500 hover:bg-white hover:text-violet-700 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5'
                  }`
                }
              >
                <Icon className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? '' : 'group-hover:scale-110'} ${link.color && !isOpen ? link.color : ''}`} />
                {isOpen && <span className="tracking-wide text-[15px]">{link.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
