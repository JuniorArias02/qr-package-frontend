import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types/auth.types';

export default function DashboardRedirect() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    
    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case UserRole.SUPER_ADMIN:
            return <Navigate to="/super-admin/dashboard" replace />;
        case UserRole.COMPANY_ADMIN:
            return <Navigate to="/admin/dashboard" replace />;
        case UserRole.COORDINATOR:
            return <Navigate to="/coordinator/dashboard" replace />;
        case UserRole.DRIVER:
            return <Navigate to="/driver/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
}
