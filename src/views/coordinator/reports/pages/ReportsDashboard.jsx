import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import ReportFilters from '../components/ReportFilters';
import DashboardLayout from '../../../../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { 
    Package, 
    CheckCircle2, 
    TrendingUp, 
    Clock, 
    RefreshCcw 
} from 'lucide-react';

const ReportsDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [driverPerformance, setDriverPerformance] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const loadData = async (currentFilters) => {
        setLoading(true);
        try {
            const [metricsData, deliveriesData, performanceData, chartDataResponse] = await Promise.all([
                reportService.getMetrics(currentFilters),
                reportService.getDeliveries(currentFilters),
                reportService.getDriverPerformance(currentFilters),
                reportService.getChartData(7)
            ]);
            setMetrics(metricsData);
            setDeliveries(deliveriesData.data);
            setDriverPerformance(performanceData);
            setChartData(chartDataResponse);
        } catch (error) {
            console.error('Error loading report data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(filters);
    }, []);

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        loadData(newFilters);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            delivered: 'bg-green-50 text-green-600 border-green-100',
            assigned: 'bg-blue-50 text-blue-600 border-blue-100'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {status === 'delivered' ? 'Entregado' : 'Asignado'}
            </span>
        );
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reportes de Logística</h1>
                        <p className="text-slate-500 mt-2 font-medium">Monitorea el desempeño de tus entregas y conductores</p>
                    </div>
                    <button 
                        onClick={() => loadData(filters)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 font-bold transition-all shadow-sm active:scale-95 group"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Actualizar Datos
                    </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <MetricCard 
                        title="Total Entregas" 
                        value={metrics?.total_deliveries} 
                        icon={Package} 
                        color="blue"
                        loading={loading}
                    />
                    <MetricCard 
                        title="Entregas Exitosas" 
                        value={metrics?.delivered_count} 
                        icon={CheckCircle2} 
                        color="green"
                        loading={loading}
                    />
                    <MetricCard 
                        title="Tasa de Entrega" 
                        value={`${metrics?.delivery_rate}%`} 
                        icon={TrendingUp} 
                        color="indigo"
                        loading={loading}
                    />
                    <MetricCard 
                        title="Tiempo Promedio" 
                        value={`${metrics?.avg_delivery_time} min`} 
                        icon={Clock} 
                        color="amber"
                        loading={loading}
                    />
                </div>

                <ReportFilters onFilter={handleFilter} />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900">Actividad de Entregas</h3>
                            <span className="text-sm font-bold text-slate-400">Últimos 7 días</span>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={4} />
                                    <Area type="monotone" dataKey="delivered" stroke="#10b981" fillOpacity={0} strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900">Productividad por Conductor</h3>
                            <span className="text-sm font-bold text-slate-400">Entrega vs Pedidos</span>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={driverPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="driver_name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc', radius: 12}}
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{paddingTop: '30px'}} />
                                    <Bar dataKey="delivered" name="Entregas" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                                    <Bar dataKey="pending" name="Pendientes" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Driver Performance Table */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900">Rendimiento</h3>
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conductor</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Entregas</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Promedio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {driverPerformance.map((driver, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{driver.driver_name}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-sm font-black text-slate-600">{driver.delivered}/{driver.total}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-black">{Math.round(driver.avg_time)}m</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Delivery Report Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900">Historial de Entregas</h3>
                            <div className="flex items-center gap-3">
                                 <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                                 <span className="text-xs font-bold text-slate-400">Actualizado recientemente</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/80">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Referencia / Batch</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conductor</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Estado</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {deliveries.map((delivery) => (
                                        <tr key={delivery.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-indigo-600 mb-1">{delivery.package?.package_reference || 'N/A'}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ref: {delivery.daily_batch?.daily_code || 'N/A'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black">
                                                        {delivery.driver?.user?.name?.charAt(0) || 'D'}
                                                    </div>
                                                    <span className="font-bold text-slate-700">{delivery.driver?.user?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <StatusBadge status={delivery.status} />
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <p className="text-sm font-bold text-slate-600">{new Date(delivery.assigned_at).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{delivery.delivered_at ? new Date(delivery.delivered_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Pendiente'}</p>
                                            </td>
                                        </tr>
                                    ))}
                                    {deliveries.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <span className="text-5xl mb-4">🔍</span>
                                                    <p className="text-slate-900 font-black text-xl">Sin resultados</p>
                                                    <p className="text-slate-500 font-bold">Intenta ajustar los filtros de búsqueda</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const MetricCard = ({ title, value, icon: Icon, color, loading }) => {
    const colorClasses = {
        blue: 'from-blue-600 to-indigo-700 text-blue-600 bg-blue-50/50 border-blue-100',
        green: 'from-emerald-500 to-teal-700 text-emerald-600 bg-emerald-50/50 border-emerald-100',
        amber: 'from-amber-500 to-orange-600 text-amber-600 bg-amber-50/50 border-amber-100',
        indigo: 'from-indigo-600 to-violet-700 text-indigo-600 bg-indigo-50/50 border-indigo-100',
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group overflow-hidden relative">
            <div className="flex flex-col relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${colorClasses[color]?.split(' ').slice(2).join(' ')} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
                    {loading ? (
                        <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-xl"></div>
                    ) : (
                        <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                            {value || '0'}
                        </p>
                    )}
                </div>
            </div>
            {/* Elegant gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]?.split(' ').slice(0, 2).join(' ')} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
        </div>
    );
};

export default ReportsDashboard;
