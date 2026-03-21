import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import {
    Package,
    CheckCircle2,
    Clock,
    TrendingUp,
    MapPin,
    AlertCircle,
    ArrowRight
} from 'lucide-react'
import driverService from '../../../../services/driverService'
import DashboardLayout from '../../../../components/DashboardLayout'

export default function DriverDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response = await driverService.getDashboardAnalytics()
            setData(response.objeto)
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError('No se pudieron cargar las métricas. Intenta de nuevo más tarde.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex items-center gap-4">
                    <AlertCircle className="w-6 h-6" />
                    <p className="font-bold">{error}</p>
                </div>
            </DashboardLayout>
        )
    }

    const { metrics, daily_progress, weekly_activity } = data

    return (
        <DashboardLayout>
            <div className="max-w-[1200px] mx-auto pb-10">
                {/* Header section */}
                <div className="mb-10">
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">My Performance</h1>
                    <p className="text-slate-600">Monitor your deliveries and personal efficiency</p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Stats Column */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* KPI Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="Total Deliveries" 
                                value={metrics.total_delivered} 
                                icon={Package} 
                                color="blue"
                            />
                            <StatCard 
                                title="Efficiency" 
                                value={`${metrics.efficiency}%`} 
                                icon={TrendingUp} 
                                color="green"
                            />
                            <StatCard 
                                title="Average Time" 
                                value={`${metrics.avg_delivery_time}m`} 
                                icon={Clock} 
                                color="indigo"
                            />
                        </div>

                        {/* Weekly Activity Chart */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h3 className="text-xl font-black text-slate-900">Weekly Activity</h3>
                                <div className="px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-xs font-bold ring-1 ring-violet-200">Last 7 days</div>
                            </div>
                            
                            <div className="h-64 w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weekly_activity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f8fafc', radius: 12 }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl border border-slate-800 text-sm">
                                                            <p className="font-bold">{payload[0].value} deliveries</p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <Bar dataKey="delivered" radius={[10, 10, 10, 10]} barSize={32}>
                                            {weekly_activity.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={index === weekly_activity.length - 1 ? '#7c3aed' : '#cbd5e1'} 
                                                    className="hover:fill-violet-600 transition-colors duration-300"
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Accent decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                        </div>
                    </div>

                    {/* Side Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Daily Progress Card */}
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl shadow-violet-500/20 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">Today's Progress</h3>
                                    <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Today</div>
                                </div>
                                
                                <div className="flex flex-col items-center py-4">
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="transparent"
                                                stroke="rgba(255,255,255,0.15)"
                                                strokeWidth="12"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="transparent"
                                                stroke="white"
                                                strokeWidth="12"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * daily_progress.percentage) / 100}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-black">{daily_progress.percentage}%</span>
                                            <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Completed</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex gap-8 w-full justify-center">
                                        <div className="text-center">
                                            <p className="text-2xl font-black">{daily_progress.completed}</p>
                                            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Delivered</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-black">{daily_progress.total}</p>
                                            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Total</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Animated blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                        </div>

                        {/* Last Delivery Peek */}
                        {metrics.last_delivery && (
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    Last Delivery
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                                            <Package className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reference</p>
                                            <p className="text-sm font-bold text-slate-900 font-mono italic">{metrics.last_delivery.reference}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                                            <MapPin className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Address</p>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{metrics.last_delivery.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate('/driver/history')} 
                                    className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                                >
                                    View Full History
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

function StatCard({ title, value, icon: Icon, color }) {
    const colors = {
        blue: "from-blue-600/10 to-indigo-600/10 text-indigo-600 ring-indigo-500/20 bg-blue-50/50",
        green: "from-emerald-500/10 to-teal-500/10 text-emerald-600 ring-emerald-500/20 bg-emerald-50/50",
        indigo: "from-violet-600/10 to-purple-600/10 text-violet-600 ring-violet-500/20 bg-violet-50/50"
    }

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden">
            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ring-1 transition-transform duration-500 group-hover:scale-110 shadow-sm ${colors[color]}`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
                    <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{value}</p>
                </div>
            </div>
            {/* Elegant glass accent */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-white/0 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        </div>
    )
}
