import {
    AlertCircle,
    LayoutDashboard,
    Scan,
    ClipboardList,
    Users,
    UserPlus,
    Truck,
    History,
    BarChart,
    User,
    Settings,
    Map,
    Building2,
    Globe,
    ShieldCheck,
    Route
} from 'lucide-react'
import { UserRole } from '../core/types/auth.types'

export const menuConfig = {
    [UserRole.SUPER_ADMIN]: [
        {
            name: 'Panel Global',
            icon: Globe,
            path: '/super-admin/dashboard',
            color: 'text-violet-500'
        },
        {
            name: 'Empresas',
            icon: Building2,
            path: '/super-admin/companies',
            color: 'text-indigo-500'
        },
        {
            name: 'Usuarios',
            icon: Users,
            path: '/super-admin/users',
            color: 'text-cyan-500'
        },
        {
            name: 'Entregas Globales',
            icon: Truck,
            path: '/super-admin/deliveries',
            color: 'text-amber-500'
        },
        {
            name: 'Configuración',
            icon: Settings,
            path: '/super-admin/settings',
            color: 'text-slate-500'
        }
    ],
    [UserRole.COMPANY_ADMIN]: [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
            color: 'text-violet-500'
        },
        {
            name: 'Coordinators',
            icon: UserPlus,
            path: '/admin/coordinators',
            color: 'text-indigo-500'
        },
        {
            name: 'Route Planning',
            icon: Map,
            path: '/routes',
            color: 'text-emerald-500'
        },
        {
            name: 'System Reports',
            icon: BarChart,
            path: '/reports',
            color: 'text-pink-500'
        }
    ],
    [UserRole.COORDINATOR]: [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/coordinator/dashboard',
            color: 'text-violet-500'
        },
        {
            name: 'Scanning',
            icon: Scan,
            path: '/coordinator/scan',
            color: 'text-cyan-500'
        },
        {
            name: 'Asig / Exp',
            icon: Route,
            path: '/coordinator/batch-dispatch',
            color: 'text-indigo-500'
        },
        {
            name: 'Incidencias',
            icon: AlertCircle,
            path: '/coordinator/incidents',
            color: 'text-rose-600'
        },
        {
            name: 'Drivers',
            icon: Users,
            path: '/coordinator/drivers',
            color: 'text-amber-500'
        },
        {
            name: 'Branches',
            icon: Building2,
            path: '/coordinator/branches',
            color: 'text-rose-500'
        },
        {
            name: 'Route Planning',
            icon: Map,
            path: '/routes',
            color: 'text-emerald-600'
        },
        {
            name: 'Live Routes',
            icon: Map,
            path: '/coordinator/live-routes',
            color: 'text-emerald-500'
        },
        {
            name: 'Mapa Global',
            icon: Map,
            path: '/coordinator/undelivered-map',
            color: 'text-blue-600'
        },
        {
            name: 'Fleet Stats',
            icon: BarChart,
            path: '/coordinator/reports',
            color: 'text-pink-500'
        }
    ],
    [UserRole.DRIVER]: [
        {
            name: 'Performance',
            icon: BarChart,
            path: '/driver/dashboard',
            color: 'text-violet-500'
        },
        {
            name: 'My Deliveries',
            icon: Truck,
            path: '/driver/deliveries',
            color: 'text-emerald-500'
        },
        {
            name: 'Delivery History',
            icon: History,
            path: '/driver/history',
            color: 'text-slate-500'
        }
    ],
    // Common items for all roles
    common: [
        {
            name: 'Profile',
            icon: User,
            path: '/profile',
            color: 'text-orange-500'
        }
    ]
}

export const getMenuItems = (role) => {
    const roleMenu = menuConfig[role] || []
    return [...roleMenu, ...menuConfig.common]
}
