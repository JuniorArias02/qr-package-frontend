import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { formatDate } from '../utils/dateUtils'
import StatisticsService from '../services/statistics.service'
import {
    Scan,
    History,
    Package,
    TrendingUp,
    Clock,
    CheckCircle,
    ArrowRight
} from 'lucide-react'

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [statsData, setStatsData] = useState({
        total_scans: 0,
        active_packages: 0,
        week_scans: 0,
        completed_packages: 0
    })
    const [recentActivity, setRecentActivity] = useState([])
    const [monthlyStats, setMonthlyStats] = useState({
        scans: 0,
        completed: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token) {
            navigate('/')
            return
        }

        if (userData) {
            setUser(JSON.parse(userData))
        }

        fetchStatistics()
    }, [navigate])

    const fetchStatistics = async () => {
        try {
            const data = await StatisticsService.getDashboardStats()
            setStatsData(data.stats)
            setRecentActivity(data.recent_activity)
            setMonthlyStats(data.monthly)
        } catch (error) {
            console.error('Error fetching statistics:', error)
        } finally {
            setLoading(false)
        }
    }

    const stats = [
        {
            title: 'Total Escaneos',
            value: statsData.total_scans,
            change: 'Total',
            icon: Scan,
            color: 'from-cyan-500 to-blue-500',
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600'
        },
        {
            title: 'Paquetes Activos',
            value: statsData.active_packages,
            change: 'Actual',
            icon: Package,
            color: 'from-violet-500 to-purple-500',
            bgColor: 'bg-violet-50',
            iconColor: 'text-violet-600'
        },
        {
            title: 'Esta Semana',
            value: statsData.week_scans,
            change: 'Semanal',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Completados',
            value: statsData.completed_packages,
            change: 'Histórico',
            icon: CheckCircle,
            color: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        },
    ]

    const quickActions = [
        {
            title: 'Escanear Código QR',
            description: 'Registra un nuevo paquete',
            icon: Scan,
            color: 'from-cyan-500 to-blue-500',
            action: () => navigate('/scan')
        },
        {
            title: 'Ver Historial',
            description: 'Revisa todos los escaneos',
            icon: History,
            color: 'from-purple-500 to-pink-500',
            action: () => navigate('/history')
        },
    ]

    // Calculate percentages for bars (safe division)
    const scanPercentage = monthlyStats.scans > 0 ? Math.min(100, (monthlyStats.scans / 50) * 100) : 0
    const completedPercentage = monthlyStats.completed > 0 ? Math.min(100, (monthlyStats.completed / 50) * 100) : 0

    return (
        <DashboardLayout>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    ¡Hola, {user?.name || 'Usuario'}! 👋
                </h1>
                <p className="text-slate-600">
                    Aquí está un resumen de tu actividad reciente
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                        {stat.value}
                                    </h3>
                                    <p className="text-sm text-slate-600">{stat.title}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon
                                    return (
                                        <button
                                            key={index}
                                            onClick={action.action}
                                            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all hover:scale-[1.02] text-left"
                                        >
                                            <div className={`inline-flex p-3 bg-gradient-to-br ${action.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 mb-4">
                                                {action.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-violet-600 font-medium text-sm group-hover:gap-3 transition-all">
                                                <span>Ir ahora</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 mt-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Actividad Reciente</h3>
                                {recentActivity.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentActivity.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                                                    }`}>
                                                    <Package className={`w-5 h-5 ${activity.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                                                        }`} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900 text-sm">
                                                        {activity.package}
                                                    </p>
                                                    <p className="text-xs text-slate-600">{activity.action}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-xs">{formatDate(activity.time, 'relative')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        No hay actividad reciente
                                    </div>
                                )}
                                <button
                                    onClick={() => navigate('/history')}
                                    className="w-full mt-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                                >
                                    Ver todo el historial →
                                </button>
                            </div>
                        </div>

                        {/* Tips & Info */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Consejos</h2>

                            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Scan className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">¿Sabías que?</h3>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    Puedes escanear múltiples códigos QR de forma consecutiva sin salir de la pantalla de escaneo.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-3">Estadísticas del Mes</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Escaneos</span>
                                        <span className="font-bold text-slate-900">{monthlyStats.scans}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${scanPercentage}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-sm text-slate-600">Completados</span>
                                        <span className="font-bold text-slate-900">{monthlyStats.completed}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${completedPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    )
}
