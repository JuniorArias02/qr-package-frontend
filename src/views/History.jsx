import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import PackageService from '../services/package.service'
import { formatDate } from '../utils/dateUtils'
import DashboardLayout from '../components/DashboardLayout'
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

export default function History() {
    const navigate = useNavigate()
    const [packages, setPackages] = useState([])
    const [filteredPackages, setFilteredPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchPackages()
    }, [])

    useEffect(() => {
        filterPackages()
    }, [searchTerm, filterStatus, packages])

    const fetchPackages = async () => {
        try {
            const data = await PackageService.getAll()
            setPackages(data)
        } catch (err) {
            console.error(err)
            setError('Error al cargar el historial')
        } finally {
            setLoading(false)
        }
    }

    const filterPackages = () => {
        let filtered = packages

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(pkg =>
                pkg.referencia_qr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.nombre_receptor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(pkg => pkg.estado === filterStatus)
        }

        setFilteredPackages(filtered)
    }

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Entregado':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'En tránsito':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'Pendiente':
                return 'bg-orange-100 text-orange-700 border-orange-200'
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    const getStatusIcon = (estado) => {
        switch (estado) {
            case 'Entregado':
                return <CheckCircle className="w-4 h-4" />
            case 'En tránsito':
                return <Clock className="w-4 h-4" />
            default:
                return <Package className="w-4 h-4" />
        }
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Historial de Paquetes
                </h1>
                <p className="text-slate-600">
                    Gestiona y revisa todos tus paquetes registrados
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por referencia, destinatario o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="Entregado">Entregado</option>
                            <option value="En tránsito">En tránsito</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-3 text-sm text-slate-600">
                    Mostrando <span className="font-semibold text-slate-900">{filteredPackages.length}</span> de <span className="font-semibold text-slate-900">{packages.length}</span> paquetes
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600">Cargando historial...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <X className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            ) : filteredPackages.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {searchTerm || filterStatus !== 'all' ? 'No se encontraron resultados' : 'No hay paquetes registrados'}
                    </h3>
                    <p className="text-slate-600 text-sm">
                        {searchTerm || filterStatus !== 'all'
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza escaneando tu primer código QR'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPackages.map(pkg => (
                        <button
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className="group bg-white border border-slate-200 hover:border-violet-300 hover:shadow-lg rounded-2xl p-5 transition-all hover:scale-[1.01] text-left"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1 font-mono">
                                                {pkg.referencia_qr}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <User className="w-4 h-4" />
                                                <span className="truncate">{pkg.nombre_receptor}</span>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(pkg.estado)}`}>
                                            {getStatusIcon(pkg.estado)}
                                            {pkg.estado}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate max-w-[200px]">{pkg.direccion}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(pkg.created_at, 'short')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex-shrink-0 text-slate-400 group-hover:text-violet-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white relative">
                            <button
                                onClick={() => setSelectedPackage(null)}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Detalle del Paquete</h2>
                                    <p className="text-white/80 text-sm font-mono">{selectedPackage.referencia_qr}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* QR Code */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-slate-100">
                                    <QRCodeSVG
                                        value={selectedPackage.referencia_qr}
                                        size={180}
                                        fgColor="#000000"
                                        bgColor="#ffffff"
                                        level="H"
                                    />
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex justify-center mb-6">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(selectedPackage.estado)}`}>
                                    {getStatusIcon(selectedPackage.estado)}
                                    {selectedPackage.estado}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <User className="w-5 h-5 text-violet-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destinatario</p>
                                            <p className="text-slate-900 font-medium">{selectedPackage.nombre_receptor}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <MapPin className="w-5 h-5 text-violet-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dirección</p>
                                            <p className="text-slate-900">{selectedPackage.direccion}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <Phone className="w-5 h-5 text-violet-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Teléfono</p>
                                            <p className="text-slate-900">{selectedPackage.telefono_receptor}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <Calendar className="w-5 h-5 text-violet-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fecha de Registro</p>
                                            <p className="text-slate-900">
                                                {formatDate(selectedPackage.created_at, 'long')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setSelectedPackage(null)}
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar QR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
