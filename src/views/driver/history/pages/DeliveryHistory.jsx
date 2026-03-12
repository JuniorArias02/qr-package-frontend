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
            case 'Entregado': return 'bg-green-100 text-green-700 border-green-200'
            case 'No entregado': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Delivery History</h1>
                <p className="text-slate-600">Review all your past deliveries and their status</p>
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
                <div className="text-center py-12 text-slate-500">Loading history...</div>
            ) : filteredPackages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No history found</h3>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPackages.map(pkg => (
                        <button
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className="bg-white border border-slate-200 hover:border-violet-300 rounded-2xl p-5 transition-all text-left shadow-sm group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 font-mono">{pkg.referencia_qr}</h3>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(pkg.estado)}`}>
                                            {pkg.estado}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-1.5"><User className="w-4 h-4" /> {pkg.nombre_receptor}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {pkg.direccion}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
