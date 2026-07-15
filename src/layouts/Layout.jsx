import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Redirect authenticated users away from public routes (like login)
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  // Unauthenticated Layout (Login/Recovery pages)
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Authenticated Enterprise Layout
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-medium text-slate-600">
      {/* Dynamic Sidebar based on the User's Role */}
      <Sidebar role={user?.role} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Top Navbar for profile and actions */}
        <Navbar />
        
        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 transition-all duration-200">
           <div className="max-w-7xl mx-auto h-full animate-fade-in">
             <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
