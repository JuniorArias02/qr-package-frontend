import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import driverService from '../services/driverService'
import {
    Search,
    Package,
    Calendar,
    MapPin,
    User,
    Clock,
    History
} from 'lucide-react'

export default function DeliveryHistory() {
    const [packages, setPackages] = useState([])
    const [filteredPackages, setFilteredPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchHistory()
    }, [])

    useEffect(() => {
        filterPackages()
    }, [searchTerm, filterStatus, packages])

    const fetchHistory = async () => {
        try {
            const data = await driverService.getHistory()
            setPackages(data.objeto || [])
        } catch (err) {
            console.error(err)
            setError('Error loading history')
        } finally {
            setLoading(false)
        }
    }

    const filterPackages = () => {
        let filtered = packages

        if (searchTerm) {
            filtered = filtered.filter(pkg =>
                pkg.referencia_qr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.nombre_receptor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(pkg => pkg.estado === filterStatus)
        }

        setFilteredPackages(filtered)
    }

    const getStatusBadge = (estado) => {
        switch (estado) {
            case 'Delivered': 
                return <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">{estado}</span>
            case 'Failed': 
                return <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">{estado}</span>
            case 'Assigned': 
                return <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">{estado}</span>
            default: 
                return <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">{estado}</span>
        }
    }

    return (
        <>
            <div className="max-w-[1400px] mx-auto pb-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Delivery History</h1>
                    <p className="text-slate-500 font-medium">Review all your past deliveries and their performance</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 mb-10 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by reference, recipient or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Failed">Failed</option>
                                <option value="Assigned">Assigned</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-6"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading history...</p>
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center px-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                            <History className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No history found</h3>
                        <p className="text-slate-500 font-medium max-w-md">You haven't made any deliveries yet matching this criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPackages.map(pkg => (
                            <div
                                key={pkg.id}
                                className="bg-white border border-slate-200 rounded-[2rem] p-8 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 border border-violet-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Package className="w-7 h-7" />
                                    </div>
                                    {getStatusBadge(pkg.estado)}
                                </div>

                                <div className="mb-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Reference Code</p>
                                    <h3 className="font-black text-slate-900 font-mono text-xl">{pkg.referencia_qr}</h3>
                                </div>

                                <div className="space-y-4 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recipient</p>
                                            <p className="text-sm text-slate-900 font-bold leading-tight">{pkg.nombre_receptor}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Address</p>
                                            <p className="text-sm text-slate-900 font-bold leading-tight">{pkg.direccion}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-violet-500" />
                                        <span className="text-xs font-bold text-slate-600">{pkg.fecha}</span>
                                    </div>
                                    {pkg.hora && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-slate-600">{pkg.hora}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
