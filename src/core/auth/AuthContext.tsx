import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import {
    User,
    UserPermission,
    UserRole
} from '../types/auth.types';
import authService from '../../domains/auth/services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: UserPermission) => boolean;
    hasRole: (role: UserRole) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                let isExpired = false;
                try {
                    const payloadBase64 = storedToken.split('.')[1];
                    if (payloadBase64) {
                        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                                .join('')
                        );
                        const decoded = JSON.parse(jsonPayload);
                        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                            isExpired = true;
                        }
                    }
                } catch (e) {
                    console.error("Failed to decode token", e);
                }

                if (isExpired) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } else {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });

        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setToken(response.access_token);
        setUser(response.user);
    };

    const logout = () => {
        try {
            authService.logout();
        } catch (e) {
            console.error("Logout error", e);
        }
        setToken(null);
        setUser(null);
    };

    const hasPermission = (permission: UserPermission): boolean => {
        if (!user) return false;
        return user.permissions.includes(permission);
    };

    const hasRole = (role: UserRole): boolean => {
        if (!user) return false;
        return user.role === role;
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        hasPermission,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
