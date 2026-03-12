import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const RoleBasedRoute = ({ allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth()

    if (loading) return null

    if (!isAuthenticated) return <Navigate to="/" replace />

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default RoleBasedRoute
