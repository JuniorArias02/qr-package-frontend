import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import driverService from '../../../../services/driverService'
import DashboardLayout from '../../../../components/DashboardLayout'
import {
    Search,
    Filter,
    Package,
    Calendar,
    MapPin,
    Phone,
    User,
    CheckCircle,
    Clock,
    X,
    Download
} from 'lucide-react'

export default function DeliveryHistory() {
    const [packages, setPackages] = useState([])
    const [filteredPackages, setFilteredPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPackage, setSelectedPackage] = useState(null)
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

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200'
            case 'Failed': return 'bg-red-100 text-red-700 border-red-200'
            case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Delivery History</h1>
                <p className="text-slate-600">Review all your past deliveries and their performance</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by reference, recipient or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading history...</p>
                </div>
            ) : filteredPackages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No history found</h3>
                    <p className="text-slate-500">You haven't made any deliveries yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPackages.map(pkg => (
                        <div
                            key={pkg.id}
                            className="bg-white border border-slate-200 rounded-2xl p-5 transition-all text-left shadow-sm group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 font-mono text-lg">{pkg.referencia_qr}</h3>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(pkg.estado)}`}>
                                            {pkg.estado}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-700 font-semibold flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> {pkg.nombre_receptor}</p>
                                        <p className="text-sm text-slate-500 flex items-start gap-1.5"><MapPin className="w-4 h-4 text-slate-400 mt-0.5" /> {pkg.direccion}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-50">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {pkg.fecha}</span>
                                            {pkg.hora && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.hora}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
