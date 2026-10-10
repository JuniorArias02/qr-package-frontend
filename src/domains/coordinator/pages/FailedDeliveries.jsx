import React, { useState, useEffect } from 'react'
import deliveryService from '../services/delivery.service'
import {
    AlertCircle,
    Package,
    RotateCcw,
    CheckCircle,
    X,
    Search,
    RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FailedDeliveries() {
    const navigate = useNavigate()
    const [deliveries, setDeliveries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [requeueingId, setRequeueingId] = useState(null)

    useEffect(() => {
        fetchFailedDeliveries()
    }, [])

    const fetchFailedDeliveries = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await deliveryService.getFailedDeliveries()
            setDeliveries(data)
        } catch (err) {
            console.error(err)
            setError('Error loading failed deliveries')
        } finally {
            setLoading(false)
        }
    }

    const handleRequeue = async (deliveryId) => {
        setRequeueingId(deliveryId)
        setError('')
        setSuccess('')
        try {
            await deliveryService.requeuePackage(deliveryId)
            setSuccess('Package requeued to pending successfully!')
            setDeliveries(deliveries.filter(d => d.id !== deliveryId))
            setTimeout(() => {
                setSuccess('')
            }, 1500)
        } catch (err) {
            console.error(err)
            setError('Failed to requeue package. Please try again.')
        } finally {
            setRequeueingId(null)
        }
    }

    const filteredDeliveries = deliveries.filter(d => {
        const refMatch = d.package?.package_reference?.toLowerCase().includes(searchTerm.toLowerCase())
        const driverMatch = d.driver?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        return refMatch || driverMatch
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold uppercase tracking-widest text-sm">Cargando Incidencias...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-rose-600" />
                        Incidencias
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Gestiona los paquetes fallidos y devuélvelos a la bodega para reasignarlos.
                    </p>
                </div>
                <button
                    onClick={fetchFailedDeliveries}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors font-bold text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 flex items-center justify-between shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-sm animate-in fade-in">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{success}</span>
                </div>
            )}

            <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por referencia o motorizado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium text-slate-900"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-widest text-[10px] font-black">
                                <th className="p-4 pl-6">Paquete</th>
                                <th className="p-4">Motorizado (Fallido)</th>
                                <th className="p-4">Motivo / Observación</th>
                                <th className="p-4 text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDeliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400 font-medium">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        No se encontraron incidencias.
                                    </td>
                                </tr>
                            ) : (
                                filteredDeliveries.map(delivery => (
                                    <tr key={delivery.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-mono font-black text-slate-900">
                                                        {delivery.package?.package_reference || `ID: ${delivery.package_id}`}
                                                    </p>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700">
                                                        Failed
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">
                                                {delivery.driver?.user?.name || 'Desconocido'}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-slate-600 max-w-xs break-words">
                                                {delivery.observation || 'Sin observación'}
                                            </p>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <button
                                                onClick={() => handleRequeue(delivery.id)}
                                                disabled={requeueingId === delivery.id}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                                            >
                                                {requeueingId === delivery.id ? (
                                                    <div className="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                                                ) : (
                                                    <RotateCcw className="w-4 h-4" />
                                                )}
                                                Re-encolar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
