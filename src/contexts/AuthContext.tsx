import { createContext, useState, useEffect, ReactNode } from 'react'
import {
    User,
    UserPermission,
    UserRole
} from '../types/auth.types'
import authService from '../services/authService'

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    hasPermission: (permission: UserPermission) => boolean
    hasRole: (role: UserRole) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse user from local storage", e)
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
        }

        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password })

        localStorage.setItem('token', response.access_token)
        localStorage.setItem('user', JSON.stringify(response.user))

        setToken(response.access_token)
        setUser(response.user)
    }

    const logout = async () => {
        try {
            await authService.logout()
        } catch (e) {
            console.error("Logout error", e)
        }
        localStorage.clear()
        setToken(null)
        setUser(null)
    }

    const hasPermission = (permission: UserPermission): boolean => {
        if (!user) return false
        return user.permissions.includes(permission)
    }

    const hasRole = (role: UserRole): boolean => {
        if (!user) return false
        return user.role === role
    }

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        hasPermission,
        hasRole
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
