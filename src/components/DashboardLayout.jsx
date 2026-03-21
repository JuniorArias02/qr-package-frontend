import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../types/auth.types'
import {
    Menu,
    Package
} from 'lucide-react'
import MobileSidebar from './MobileSidebar'
import SidebarContent from './SidebarContent'

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-slate-200 shrink-0">
                <SidebarContent user={user} logout={logout} />
            </aside>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
                logout={logout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 z-40">
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
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.profile_image ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${user.profile_image}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
