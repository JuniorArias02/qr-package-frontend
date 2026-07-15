import { NavLink } from 'react-router-dom';
import { getMenuItems } from '../config/menu.config';

const Sidebar = ({ role, isOpen }) => {
  // Navigation links based on roles
  const filteredLinks = getMenuItems(role);

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-20 whitespace-nowrap`}>
      <div className="h-16 flex items-center justify-center border-b border-slate-200 overflow-hidden">
        {isOpen ? (
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-700 tracking-tight animate-fade-in">
            QR Package
          </h1>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md animate-fade-in text-white font-black">
            QR
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 overflow-x-hidden">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              title={!isOpen ? link.name : undefined}
              className={({ isActive }) =>
                `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-[1.02] ${
                  isActive
                    ? 'bg-violet-50 text-violet-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className={`w-5 h-5 shrink-0 ${link.color || 'text-slate-500'}`} />
              {isOpen && <span className="animate-fade-in truncate">{link.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
