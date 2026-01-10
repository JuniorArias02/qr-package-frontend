import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AuthService from '../services/auth.service'

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setIsAuthenticated(false)
                return
            }

            try {
                // Optional: Verify token valid via API if needed, 
                // but for now verifying existence and maybe User object is enough.
                // Or try to get profile?
                // await AuthService.getProfile()
                setIsAuthenticated(true)
            } catch (error) {
                // Token invalid
                // AuthService.logout() handles removal
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setIsAuthenticated(false)
            }
        }
        checkAuth()
    }, [])

    if (isAuthenticated === null) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}
