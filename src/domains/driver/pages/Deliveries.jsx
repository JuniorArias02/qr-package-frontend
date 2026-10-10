import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDeliveries } from '../hooks/useDeliveries'
import { PackageStatus } from '../../../core/types/package.types'
import DeliveryMap from '../components/DeliveryMap'
import {
    Truck,
    CheckCircle,
    XCircle,
    MapPin,
    Clock,
    Search,
    Navigation,
    Scan,
    AlertCircle,
    Package,
    CheckCircle2,
    List,
    Map as MapIcon,
    Flag,
    AlertOctagon,
    Loader2,
    X,
    ChevronUp,
    ChevronDown,
    Wand2
} from 'lucide-react'
import driverService from '../services/driverService'

export default function Deliveries() {
    const { deliveries, stats, loading, error, fetchMyDeliveries, updateStatus } = useDeliveries()
    const [searchTerm, setSearchTerm] = useState('')
    const [updatingId, setUpdatingId] = useState(null)
    const [successMsg, setSuccessMsg] = useState('')
    const [showMapModal, setShowMapModal] = useState(false)
    const [isReordering, setIsReordering] = useState(false)
    const [reorderList, setReorderList] = useState([])
    const [loadingReorder, setLoadingReorder] = useState(false)
    const [loadingOptimize, setLoadingOptimize] = useState(false)
    const [showFinishModal, setShowFinishModal] = useState(false)
    const [finishingRoute, setFinishingRoute] = useState(false)

    const handleOptimize = async () => {
        setLoadingOptimize(true)
        try {
            const res = await driverService.optimizeDeliveries()
            setSuccessMsg(res.message || 'Ruta optimizada con éxito')
            fetchMyDeliveries()
        } catch (err) {
            console.error(err)
            alert('Error optimizando ruta')
        } finally {
            setLoadingOptimize(false)
            setTimeout(() => setSuccessMsg(''), 5000)
        }
    }

    const startReorder = () => {
        setIsReordering(true)
        // Ensure sortedDeliveries is captured from the closure
        setReorderList([...deliveries].sort((a, b) => {
            const orderA = typeof a.delivery_order === 'number' ? a.delivery_order : 9999;
            const orderB = typeof b.delivery_order === 'number' ? b.delivery_order : 9999;
            return orderA - orderB;
        }))
    }

    const moveUp = (index) => {
        if (index === 0) return
        const newList = [...reorderList]
        const temp = newList[index - 1]
        newList[index - 1] = newList[index]
        newList[index] = temp
        setReorderList(newList)
    }

    const moveDown = (index) => {
        if (index === reorderList.length - 1) return
        const newList = [...reorderList]
        const temp = newList[index + 1]
        newList[index + 1] = newList[index]
        newList[index] = temp
        setReorderList(newList)
    }

    const handleSaveOrder = async () => {
        setLoadingReorder(true)
        try {
            const ids = reorderList.map(d => d.delivery_id || d.id)
            await driverService.reorderDeliveries(ids)
            setSuccessMsg('Ruta reordenada con éxito')
            setIsReordering(false)
            fetchMyDeliveries()
        } catch (err) {
            console.error(err)
            alert('Error guardando el orden de la ruta')
        } finally {
            setLoadingReorder(false)
            setTimeout(() => setSuccessMsg(''), 5000)
        }
    }

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

            setSuccessMsg('Status updated successfully')
            setTimeout(() => setSuccessMsg(''), 3000)

        } catch (err) {
            console.error(err)
            alert('Error updating status')
        } finally {
            setUpdatingId(null)
        }
    }

    const handleFinishRoute = async () => {
        setFinishingRoute(true)
        try {
            const res = await driverService.finishRoute()
            setSuccessMsg(res.message || `Route finished. ${res.returned_count || 0} packages returned.`)
            setShowFinishModal(false)
            fetchMyDeliveries()
            setTimeout(() => setSuccessMsg(''), 5000)
        } catch (err) {
            console.error(err)
            alert('Error finishing route')
        } finally {
            setFinishingRoute(false)
        }
    }

    const filteredDeliveries = deliveries.filter(delivery => {
        const ref = delivery.package?.package_reference || ''
        const address = delivery.package?.geocoded_address?.full_address || delivery.package?.address || ''
        const search = searchTerm.toLowerCase()
        return ref.toLowerCase().includes(search) || address.toLowerCase().includes(search)
    })

    // Sort: Strictly by delivery_order
    const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
        const orderA = typeof a.delivery_order === 'number' ? a.delivery_order : 9999;
        const orderB = typeof b.delivery_order === 'number' ? b.delivery_order : 9999;
        return orderA - orderB;
    })

    const getStatusBadge = (delivery) => {
        const { status, observation } = delivery
        
        if (status === 'delivered' || status === 'Entregado') {
            return (
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" /> Delivered
                </div>
            )
        }
        
        if (observation) {
            return (
                <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-red-100">
                    <XCircle className="w-4 h-4" /> Failed
                </div>
            )
        }

        return (
            <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-amber-100 shadow-sm">
                <Clock className="w-4 h-4" /> Pending
            </div>
        )
    }

    return (
        <>
            <div className="max-w-[1400px] mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Route</h1>
                        <p className="text-slate-500 font-medium mt-2">Manage your assigned packages for today's route</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowFinishModal(true)}
                            className="px-8 py-4 bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95 group"
                        >
                            <Flag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Finish Route
                        </button>
                        <Link 
                            to="/driver/scan" 
                            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 hover:to-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-indigo-500/30 transition-all active:scale-95 group"
                        >
                            <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Scan Package
                        </Link>
                    </div>
                </div>

                {/* Success Toast */}
                {successMsg && (
                    <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl shadow-slate-900/20 animate-bounce flex items-center gap-3 z-50 font-bold border border-slate-800">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        {successMsg}
                    </div>
                )}

                {/* Premium Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="relative z-10">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-2">Total Assigned</p>
                            <p className="text-4xl font-black text-slate-900">{stats.total || 0}</p>
                        </div>
                        <div className="absolute top-6 right-6 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[2rem] border border-amber-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="relative z-10">
                            <p className="text-[10px] text-amber-600/70 uppercase font-black tracking-[0.2em] mb-2">Pending</p>
                            <p className="text-4xl font-black text-amber-700">{stats.pendientes || 0}</p>
                        </div>
                        <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="relative z-10">
                            <p className="text-[10px] text-emerald-600/70 uppercase font-black tracking-[0.2em] mb-2">Delivered</p>
                            <p className="text-4xl font-black text-emerald-700">{stats.entregados || 0}</p>
                        </div>
                        <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-[2rem] border border-red-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="relative z-10">
                            <p className="text-[10px] text-red-600/70 uppercase font-black tracking-[0.2em] mb-2">Failed</p>
                            <p className="text-4xl font-black text-red-700">{stats.no_entregados || 0}</p>
                        </div>
                        <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Route Actions */}
                <div className="flex flex-wrap gap-4 justify-center mb-8 relative z-10">
                    <button
                        onClick={() => setShowMapModal(true)}
                        className="py-4 px-6 bg-white border border-slate-200 text-slate-700 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <MapIcon className="w-4 h-4 text-violet-600" />
                        Ver Mapa
                    </button>
                    {!isReordering ? (
                        <>
                            <button
                                onClick={startReorder}
                                className="py-4 px-6 bg-white border border-slate-200 text-slate-700 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <List className="w-4 h-4 text-amber-500" />
                                Organizar Ruta
                            </button>
                            <button
                                onClick={handleOptimize}
                                disabled={loadingOptimize}
                                className="py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25"
                            >
                                {loadingOptimize ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                Optimizar Ruta
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsReordering(false)}
                                disabled={loadingReorder}
                                className="py-4 px-6 bg-slate-100 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-200 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                disabled={loadingReorder}
                                className="py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                            >
                                {loadingReorder ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Guardar Orden
                            </button>
                        </>
                    )}
                </div>

                {/* Advanced Search */}
                <div className="relative mb-8 max-w-2xl mx-auto lg:mx-0">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                        <Search className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by address, name or QR reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:bg-slate-50 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none font-medium text-slate-900 transition-all shadow-sm relative z-10"
                    />
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-6"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Synchronizing route...</p>
                    </div>
                ) : sortedDeliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center px-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                            <Truck className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No assigned deliveries</h3>
                        <p className="text-slate-500 font-medium max-w-md">You're all caught up for now. Check back later or scan a new package manually.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                        {(isReordering ? reorderList : sortedDeliveries).map((delivery, index) => {
                            const addressStr = delivery.package?.geocoded_address?.full_address || delivery.package?.address || '';
                            const lat = delivery.package?.geocoded_address?.latitude;
                            const lng = delivery.package?.geocoded_address?.longitude;
                            const hasCoords = lat && lng;

                            return (
                                <div key={delivery.id} className={`bg-white rounded-[2.5rem] border ${isReordering ? 'border-amber-400 shadow-amber-500/10 shadow-lg' : 'border-slate-200'} overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col`}>
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-start mb-6 gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100 shrink-0">
                                                        <span className="font-black text-violet-700 text-xl">{isReordering ? index + 1 : (delivery.delivery_order || '#')}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reference Code</p>
                                                        <span className="font-mono font-black text-xl text-slate-900 leading-none">{delivery.package?.package_reference}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isReordering ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => moveUp(index)} disabled={index === 0} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-violet-100 hover:text-violet-600 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 transition-colors">
                                                        <ChevronUp className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => moveDown(index)} disabled={index === reorderList.length - 1} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-violet-100 hover:text-violet-600 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 transition-colors">
                                                        <ChevronDown className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                getStatusBadge(delivery)
                                            )}
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-[2rem] mb-2 border border-slate-100 relative overflow-hidden">
                                            <div className="relative z-10 flex items-start gap-4">
                                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                                    <MapPin className="w-6 h-6 text-violet-500" />
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Destination Address</p>
                                                    <p className="text-slate-900 font-bold text-lg leading-snug mb-3">{addressStr}</p>
                                                    
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        {delivery.package?.zone && (
                                                            <span className="px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-black rounded-xl uppercase tracking-wider">
                                                                Zone {delivery.package?.zone}
                                                            </span>
                                                        )}
                                                        <a
                                                            href={hasCoords 
                                                                ? `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` 
                                                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-black text-white bg-slate-900 px-4 py-2 rounded-xl hover:bg-violet-600 transition-colors shadow-sm"
                                                        >
                                                            <Navigation className="w-4 h-4" />
                                                            {hasCoords ? 'Waze Route' : 'GPS Route'}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {delivery.observation && (
                                            <div className="mt-4 p-5 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-800 flex items-start gap-3">
                                                <div className="p-2 bg-rose-100 rounded-xl shrink-0">
                                                    <AlertCircle className="w-5 h-5 text-rose-600" />
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/70 mb-1">Issue Reported</p>
                                                    <p className="text-sm font-bold leading-relaxed">{delivery.observation}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons Footer */}
                                    {!isReordering && delivery.status === 'assigned' && (
                                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-4">
                                            <button
                                                onClick={() => handleStatusUpdate(delivery.id, 'failed', delivery.observation)}
                                                disabled={updatingId === delivery.id}
                                                className="flex-1 py-4 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Mark Failed
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(delivery.id, 'delivered', delivery.observation)}
                                                disabled={updatingId === delivery.id}
                                                className="flex-[1.5] py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                {updatingId === delivery.id ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                )}
                                                Confirm Delivery
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Map Modal */}
                {showMapModal && (
                    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shadow-sm bg-white relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Ruta en Mapa</h2>
                                <p className="text-slate-500 text-sm font-medium">Vista general de tus entregas</p>
                            </div>
                            <button 
                                onClick={() => setShowMapModal(false)}
                                className="p-3 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 relative bg-slate-50">
                            <DeliveryMap deliveries={sortedDeliveries} />
                        </div>
                    </div>
                )}

                {/* Finish Route Modal */}
                {showFinishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8 text-center relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <AlertOctagon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Finish Route?</h3>
                                <p className="text-slate-500 font-medium mb-8">
                                    This will mark the end of your shift. Any pending packages will be automatically returned to the branch. This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowFinishModal(false)}
                                        disabled={finishingRoute}
                                        className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleFinishRoute}
                                        disabled={finishingRoute}
                                        className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/25 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {finishingRoute ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
