import { NavLink } from 'react-router-dom';
import { getMenuItems } from '../config/menu.config';

const Sidebar = ({ role }) => {
  // Navigation links based on roles
  const filteredLinks = getMenuItems(role);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-slate-200">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-700 tracking-tight">
          QR Package
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-[1.02] ${
                  isActive
                    ? 'bg-violet-50 text-violet-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className={`w-5 h-5 ${link.color || 'text-slate-500'}`} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-400 font-medium">QR Package v2.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
