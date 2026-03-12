import { useNavigate, useLocation } from 'react-router-dom'
import {
    Package,
    ChevronRight,
    LogOut
} from 'lucide-react'
import { getMenuItems } from '../config/menu.config'

export default function SidebarContent({ user, logout, onClose }) {
    const navigate = useNavigate()
    const location = useLocation()
    const menuItems = getMenuItems(user?.role)
    const isActive = (path) => location.pathname === path

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            console.error('Logout error', error)
        }
    }

    const ProfileImage = () => {
        if (user?.profile_image) {
            return (
                <img
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${user.profile_image}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                />
            )
        }
        return (
            <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
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
                        <p className="text-xs text-slate-500">Management System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)

                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path)
                                if (onClose) onClose()
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                                ? 'bg-violet-50 text-violet-700 shadow-sm'
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
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        <ProfileImage />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {user?.email || 'email@example.com'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}
