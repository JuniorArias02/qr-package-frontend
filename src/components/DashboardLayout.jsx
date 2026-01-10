import { useState } from 'react'
import AuthService from '../services/auth.service'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Package,
    LayoutDashboard,
    Scan,
    History,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react'

export default function DashboardLayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user')
        return userData ? JSON.parse(userData) : null
    })

    const handleLogout = async () => {
        try {
            await AuthService.logout()
        } catch (error) {
            console.error('Logout error', error)
        } finally {
            navigate('/')
        }
    }

    const menuItems = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard',
            color: 'text-violet-500'
        },
        {
            name: 'Escanear',
            icon: Scan,
            path: '/scan',
            color: 'text-cyan-500'
        },
        {
            name: 'Historial',
            icon: History,
            path: '/history',
            color: 'text-purple-500'
        },
        {
            name: 'Perfil',
            icon: User,
            path: '/profile',
            color: 'text-orange-500'
        },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-slate-200">
                {/* Logo */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-700 bg-clip-text text-transparent">
                                QR Package
                            </h1>
                            <p className="text-xs text-slate-500">Sistema de gestión</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                                    ? 'bg-violet-50 text-violet-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${active ? item.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="font-medium flex-1 text-left">{item.name}</span>
                                {active && (
                                    <ChevronRight className="w-4 h-4 text-violet-500" />
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                                {user?.name || 'Usuario'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || 'email@ejemplo.com'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
                    <aside
                        className="w-72 h-full bg-white flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Logo */}
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-700 bg-clip-text text-transparent">
                                        QR Package
                                    </h1>
                                    <p className="text-xs text-slate-500">Sistema de gestión</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const active = isActive(item.path)

                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path)
                                            setSidebarOpen(false)
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                                            ? 'bg-violet-50 text-violet-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${active ? item.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="font-medium flex-1 text-left">{item.name}</span>
                                        {active && (
                                            <ChevronRight className="w-4 h-4 text-violet-500" />
                                        )}
                                    </button>
                                )
                            })}
                        </nav>

                        {/* User Profile */}
                        <div className="p-4 border-t border-slate-200">
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 text-sm truncate">
                                        {user?.name || 'Usuario'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user?.email || 'email@ejemplo.com'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Cerrar Sesión</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-slate-700" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-lg">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-700 bg-clip-text text-transparent">
                            QR Package
                        </h1>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
