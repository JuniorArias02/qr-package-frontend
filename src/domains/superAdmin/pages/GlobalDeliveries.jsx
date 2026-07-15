import { useState, useEffect } from 'react'
import deliveriesGlobalService from '../services/deliveriesGlobal.service'
import companyService from '../services/company.service'
import {
    Truck,
    Building2,
    Calendar,
    Activity,
    MapPin,
    Package,
    ChevronRight,
    FilterX
} from 'lucide-react'
import GlobalDeliveriesLoader from '../components/GlobalDeliveriesLoader'

export default function GlobalDeliveries() {
    const [deliveries, setDeliveries] = useState([])
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ company_id: '', status: '', date: '' })

    useEffect(() => {
        fetchCompanies()
        fetchDeliveries()
    }, [filters])

    const fetchCompanies = async () => {
        try {
            const data = await companyService.getAll()
            setCompanies(data || [])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchDeliveries = async () => {
        setLoading(true)
        try {
            const data = await deliveriesGlobalService.getAll(filters)
            setDeliveries(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'pending':   return 'bg-amber-50 text-amber-600 border-amber-100'
            case 'failed':    return 'bg-red-50 text-red-600 border-red-100'
            case 'in_transit': return 'bg-blue-50 text-blue-600 border-blue-100'
            default: return 'bg-slate-50 text-slate-600 border-slate-100'
        }
    }

    return (
        <>
            <div className="max-w-7xl mx-auto pb-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                                Auditoría Operativa Global
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Entregas</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Visibilidad total de la logística multi-empresa</p>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-violet-600 transition-colors" />
                            <select
                                value={filters.company_id}
                                onChange={e => setFilters({...filters, company_id: e.target.value})}
                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                            >
                                <option value="">Todas las Empresas</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="relative group">
                            <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-violet-600 transition-colors" />
                            <select
                                value={filters.status}
                                onChange={e => setFilters({...filters, status: e.target.value})}
                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                            >
                                <option value="">Todos los Estados</option>
                                <option value="pending">Pendientes</option>
                                <option value="in_transit">En Camino</option>
                                <option value="delivered">Entregadas</option>
                                <option value="failed">Fallidas</option>
                            </select>
                        </div>

                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-violet-600 transition-colors" />
                            <input
                                type="date"
                                value={filters.date}
                                onChange={e => setFilters({...filters, date: e.target.value})}
                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-700 uppercase"
                            />
                        </div>

                        <button 
                            onClick={() => setFilters({ company_id: '', status: '', date: '' })}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all font-black text-xs uppercase"
                        >
                            <FilterX className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                {loading ? (
                    <GlobalDeliveriesLoader />
                ) : deliveries.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                        <Truck className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No hay entregas registradas</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium tracking-tight">Aún no se ha iniciado el flujo de paquetes para los filtros seleccionados.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {deliveries.map(delivery => (
                            <div key={delivery.id} className="group bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-slate-100 rounded-xl">
                                                <Building2 className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">
                                                {delivery.company?.name || 'Sistema Global'}
                                            </span>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-colors ${getStatusColor(delivery.status)}`}>
                                            {delivery.status.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Package className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Paquete/Ref</p>
                                                <p className="text-sm font-black text-slate-900 truncate font-mono tracking-tight">{delivery.package?.reference || 'REF-82937'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-sm uppercase">
                                                {delivery.driver?.user?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Driver</p>
                                                <p className="text-sm font-bold text-slate-800 truncate">{delivery.driver?.user?.name || 'Sin Asignar'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold pt-4 border-t border-slate-100">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{delivery.package?.delivery_address || 'Dirección no especificada'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between group-hover:px-2 transition-all duration-300">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            {new Date(delivery.created_at).toLocaleDateString()}
                                        </span>
                                        <button className="flex items-center gap-1 text-xs font-black text-violet-600 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest translate-x-4 group-hover:translate-x-0">
                                            Detalles
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}