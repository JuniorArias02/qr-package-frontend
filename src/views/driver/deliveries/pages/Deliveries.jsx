import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import { useDeliveries } from '../../../../hooks/useDeliveries'
import { PackageStatus } from '../../../../types/package.types'
// import { formatDate } from '../../../../utils/dateUtils'
import {
    Truck,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    User,
    Clock,
    Search,
    ChevronDown,
    ChevronUp,
    Navigation,
    Scan,
    AlertCircle
} from 'lucide-react'

export default function Deliveries() {
    const { deliveries, stats, loading, error, fetchMyDeliveries, updateStatus } = useDeliveries()
    const [searchTerm, setSearchTerm] = useState('')
    const [updatingId, setUpdatingId] = useState(null)
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        fetchMyDeliveries()
    }, [fetchMyDeliveries])

    const handleStatusUpdate = async (packageId, newStatus, currentObs) => {
        setUpdatingId(packageId)
        try {
            let observation = currentObs

            if (newStatus === PackageStatus.NOT_DELIVERED) {
                observation = prompt('Reason for non-delivery:', '')
                if (observation === null) {
                    setUpdatingId(null)
                    return // Cancelled
                }
            }

            await updateStatus({
                delivery_id: packageId,
                estado: newStatus,
                observacion: observation
            })

            setSuccessMsg('Status updated')
            setTimeout(() => setSuccessMsg(''), 3000)

        } catch (err) {
            console.error(err)
            alert('Error updating status')
        } finally {
            setUpdatingId(null)
        }
    }

    const filteredDeliveries = deliveries.filter(delivery => {
        const ref = delivery.package?.package_reference || ''
        const address = delivery.package?.address || ''
        const search = searchTerm.toLowerCase()
        return ref.toLowerCase().includes(search) || address.toLowerCase().includes(search)
    })

    // Sort: Pending first, then by date
    const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
        if (a.status === 'assigned' && b.status !== 'assigned') return -1
        if (a.status !== 'assigned' && b.status === 'assigned') return 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    const getStatusBadge = (delivery) => {
        const { status, observation } = delivery
        
        if (status === 'delivered' || status === 'Entregado') {
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Delivered</span>
        }
        
        if (observation) {
            return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>
        }

        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Deliveries</h1>
                        <p className="text-slate-600">Manage your assigned packages for today</p>
                    </div>
                    <Link 
                        to="/driver/scan" 
                        className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-violet-500/30 transition-all active:scale-95"
                    >
                        <Scan className="w-5 h-5" />
                        Scan Package
                    </Link>
                </div>

                {/* Success Toast */}
                {successMsg && (
                    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce flex items-center gap-2 z-50">
                        <CheckCircle className="w-5 h-5" />
                        {successMsg}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Assigned</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 shadow-sm">
                        <p className="text-xs text-yellow-600 uppercase font-bold">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700">{stats.pendientes}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm">
                        <p className="text-xs text-green-600 uppercase font-bold">Delivered</p>
                        <p className="text-2xl font-bold text-green-700">{stats.entregados}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm">
                        <p className="text-xs text-red-600 uppercase font-bold">Failed</p>
                        <p className="text-2xl font-bold text-red-700">{stats.no_entregados}</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by address, name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none"
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading your deliveries...</p>
                    </div>
                ) : sortedDeliveries.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                        <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No assigned deliveries</h3>
                        <p className="text-slate-500">All caught up for now.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedDeliveries.map(delivery => (
                            <div key={delivery.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-bold text-lg text-slate-900">{delivery.package?.package_reference}</span>
                                                {getStatusBadge(delivery)}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(delivery.created_at).toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {delivery.status === 'assigned' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(delivery.id, 'delivered', delivery.observation)}
                                                    disabled={updatingId === delivery.id}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    {updatingId === delivery.id ? '...' : <CheckCircle className="w-4 h-4" />}
                                                    Deliver
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(delivery.id, 'failed', delivery.observation)}
                                                    disabled={updatingId === delivery.id}
                                                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Failed
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full text-sm">
                                        <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-violet-500 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-700 mb-1">Delivery Address</p>
                                                <p className="text-slate-900 text-base leading-relaxed">{delivery.package?.address}</p>
                                                {delivery.package?.zone && (
                                                    <span className="inline-block mt-2 px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-lg uppercase">
                                                        Zone: {delivery.package?.zone}
                                                    </span>
                                                )}
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.package?.address || '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-500 px-3 py-1.5 rounded-lg mt-3 hover:bg-blue-600 transition-colors shadow-sm"
                                                >
                                                    <Navigation className="w-3.5 h-3.5" />
                                                    View on GPS
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {delivery.observation && (
                                        <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" />
                                            <div>
                                                <span className="font-bold">Observation:</span> {delivery.observation}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
