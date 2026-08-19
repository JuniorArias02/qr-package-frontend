import { useState, useEffect } from 'react'
import superAdminService from '../services/superAdmin.service'
import {
    Activity,
    Users,
    Package,
    TrendingUp,
    Building2,
    Calendar,
    Globe,
    Truck,
    ArrowUpRight
} from 'lucide-react'
import SuperAdminDashboardLoader from '../components/SuperAdminDashboardLoader'

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await superAdminService.getStats()
                setStats(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <>
                <SuperAdminDashboardLoader />
            </>
        )
    }

    if (!stats) {
        return (
            <div className="max-w-7xl mx-auto pb-12 pt-20 flex flex-col items-center justify-center">
                <div className="p-6 bg-rose-50 text-rose-600 rounded-3xl flex flex-col items-center gap-3 border border-rose-100 shadow-sm text-center">
                    <span className="font-black text-xl uppercase tracking-widest">Error al cargar datos</span>
                    <span className="text-sm font-bold opacity-80">No se pudieron obtener las estadísticas globales. Verifica que el servidor (API) esté respondiendo.</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="max-w-7xl mx-auto pb-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                                <Globe className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-violet-600">
                                Panel de Control Global · Super Admin
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                        <p className='text-gray-500 font-bold'>Sistema de seguimiento de paquetes</p>
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Empresas Registradas', value: stats.total_companies, icon: Building2, color: 'from-violet-500 to-indigo-600', shadow: 'shadow-indigo-200' },
                        { label: 'Usuarios Totales', value: stats.total_users, icon: Users, color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-200' },
                        { label: 'Paquetes Registrados', value: stats.total_packages, icon: Package, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200' },
                        { label: 'Entregas del Día', value: stats.today_deliveries, icon: Truck, color: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-200' },
                    ].map((card, i) => (
                        <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.03] -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150 duration-700`} />

                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-2xl text-white shadow-lg ${card.shadow}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-none">
                                    {card.label}
                                </h3>
                            </div>

                            <div className="flex items-end justify-between">
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</p>
                                <div className="flex items-center text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    Global
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secondary Charts / Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Deliveries Last 7 Days (Simplified Chart) */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-violet-600" />
                                Rendimiento Últimos 7 Días
                            </h2>
                        </div>

                        <div className="h-64 flex items-end gap-3 px-4">
                            {stats.deliveries_last_7_days.map((day, i) => {
                                const maxVal = Math.max(...stats.deliveries_last_7_days.map(d => d.count), 1);
                                const height = (day.count / maxVal) * 100;
                                return (
                                    <div key={i} className="flex-1 group relative">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                                            {day.count}
                                        </div>
                                        <div
                                            style={{ height: `${Math.max(8, height)}%` }}
                                            className={`w-full rounded-2xl transition-all duration-500 group-hover:scale-x-110 ${i === 6 ? 'bg-gradient-to-t from-violet-600 to-indigo-700' : 'bg-slate-100 group-hover:bg-violet-200'
                                                }`}
                                        />
                                        <p className="text-[10px] font-black text-slate-400 mt-4 text-center uppercase tracking-tighter">
                                            {day.day}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Companies Status */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                        <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-emerald-500" />
                            Status Empresas
                        </h2>

                        <div className="space-y-6">
                            {stats.companies_status.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-sm font-black text-slate-700 uppercase tracking-wide">{item.name}</p>
                                        <p className="text-lg font-black text-slate-900">{item.value}</p>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${item.name === 'Activas' ? 'bg-emerald-500' : 'bg-red-400'
                                                }`}
                                            style={{ width: `${(item.value / stats.total_companies) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>     
                    </div>
                </div>
            </div>
        </>
    )
}
