import { useAuth } from '../core/auth/AuthContext';
import { Menu, X, Bell, Search, ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserRole } from '../core/types/auth.types';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from '../domains/notifications/components/NotificationsDropdown';


const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simulate API search call
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simular un request a la API con un pequeño delay
    const timer = setTimeout(() => {
      let results = [];
      const query = debouncedQuery;
      
      switch (user?.role) {
        case UserRole.SUPER_ADMIN:
          results = [
            { id: 1, title: `Empresa: ${query} S.A.`, subtitle: 'Empresa', path: `/super-admin/companies?search=${query}` },
            { id: 2, title: `Usuario: ${query}`, subtitle: 'Usuario del Sistema', path: `/super-admin/users?search=${query}` }
          ];
          break;
        case UserRole.COMPANY_ADMIN:
          results = [
            { id: 1, title: `Coordinador: ${query}`, subtitle: 'Personal', path: `/admin/coordinators?search=${query}` }
          ];
          break;
        case UserRole.COORDINATOR:
          results = [
            { id: 1, title: `Conductor: ${query}`, subtitle: 'Rutas Activas', path: `/coordinator/drivers?search=${query}` },
            { id: 2, title: `Paquete: QR-${query.toUpperCase()}`, subtitle: 'Envío', path: `/coordinator/assignments?search=${query}` }
          ];
          break;
        case UserRole.DRIVER:
          results = [
            { id: 1, title: `Entrega en: ${query}`, subtitle: 'Mis Entregas', path: `/driver/deliveries?search=${query}` },
            { id: 2, title: `Referencia: QR-${query.toUpperCase()}`, subtitle: 'Historial', path: `/driver/history?search=${query}` }
          ];
          break;
      }
      setSearchResults(results);
      setIsSearching(false);
    }, 600); // 600ms de network delay ficticio

    return () => clearTimeout(timer);
  }, [debouncedQuery, user?.role]);

  const getSearchPlaceholder = () => {
    switch (user?.role) {
      case UserRole.SUPER_ADMIN: return 'Search companies or users...';
      case UserRole.COMPANY_ADMIN: return 'Search coordinators or reports...';
      case UserRole.COORDINATOR: return 'Search drivers or assignments...';
      case UserRole.DRIVER: return 'Search deliveries...';
      default: return 'Search...';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Navegación contextual simulando una búsqueda
    switch (user?.role) {
      case UserRole.SUPER_ADMIN: 
        navigate(`/super-admin/companies?q=${encodeURIComponent(searchQuery)}`);
        break;
      case UserRole.COMPANY_ADMIN:
        navigate(`/admin/coordinators?q=${encodeURIComponent(searchQuery)}`);
        break;
      case UserRole.COORDINATOR:
        navigate(`/coordinator/drivers?q=${encodeURIComponent(searchQuery)}`);
        break;
      case UserRole.DRIVER:
        navigate(`/driver/deliveries?q=${encodeURIComponent(searchQuery)}`);
        break;
      default:
        break;
    }
    setSearchQuery(''); // Limpiar el input luego de buscar
  };

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
            {/* <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role || 'Guest'}
            </span> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 lg:gap-5">
          
          {/* Contextual Search - Modern Premium Expandable Input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors z-10">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getSearchPlaceholder()}
              className="bg-slate-50/80 hover:bg-slate-100/80 border-2 border-transparent hover:border-slate-200 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10 text-sm font-bold text-slate-700 placeholder-slate-400 rounded-xl py-2 pl-10 pr-4 w-56 xl:w-64 focus:w-72 xl:focus:w-80 transition-all duration-300 outline-none shadow-sm"
            />
            <button type="submit" className="absolute inset-y-0 right-0 pr-2 flex items-center opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
               <span className="text-[10px] font-black text-slate-400 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 border border-slate-200 px-1.5 py-0.5 rounded-md shadow-sm transition-colors cursor-pointer">↵</span>
            </button>

            {/* Live Search Dropdown */}
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-50">
                <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/80 flex items-center justify-between">
                  <span>Sugerencias de Búsqueda</span>
                  {isSearching && (
                    <span className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
                  )}
                </div>
                
                <div className="mt-1 max-h-64 overflow-y-auto">
                  {!isSearching && searchResults.length === 0 && debouncedQuery && (
                    <div className="px-3 py-4 text-center text-sm font-bold text-slate-400">
                      No se encontraron coincidencias
                    </div>
                  )}

                  {searchResults.map((result) => (
                    <button 
                      key={result.id}
                      type="button" 
                      onClick={() => {
                        navigate(result.path);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-all duration-200 flex flex-col group/btn mb-1"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate pr-2">{result.title}</span>
                        <Search className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity shrink-0 text-violet-600" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{result.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* Notifications */}
          <NotificationsDropdown />

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
              <button 
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors"
              >
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
