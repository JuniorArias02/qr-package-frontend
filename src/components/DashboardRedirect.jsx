import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth.types';

const DashboardRedirect = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    switch (user?.role) {
        case UserRole.ADMIN:
            return <Navigate to="/admin/dashboard" replace />;
        case UserRole.COORDINATOR:
            return <Navigate to="/coordinator/dashboard" replace />;
        case UserRole.DRIVER:
            return <Navigate to="/driver/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default DashboardRedirect;
