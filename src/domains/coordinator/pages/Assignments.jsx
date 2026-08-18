import React, { useState, useEffect } from 'react'
import deliveryService from '../services/delivery.service'
import coordinatorService from '../services/coordinatorService'
import {
    ClipboardList,
    Search,
    Truck,
    Package,
    ArrowRight,
    MapPin,
    CheckCircle,
    X,
    Map
} from 'lucide-react'

const getAddressString = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') return address.full_address || address.normalized_address || 'Address';
    return String(address);
}

export default function Assignments() {
    const [pendingDeliveries, setPendingDeliveries] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)

    // UI State
    const [selectedDelivery, setSelectedDelivery] = useState(null)
    const [selectedDriver, setSelectedDriver] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [assigning, setAssigning] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [deliveriesData, driversData] = await Promise.all([
                deliveryService.getPendingDeliveries(),
                coordinatorService.getDrivers()
            ])
            
            setPendingDeliveries(Array.isArray(deliveriesData) ? deliveriesData : [])
            
            // Handle different API response structures (objeto vs data)
            const resolvedDrivers = driversData?.objeto || driversData?.data || (Array.isArray(driversData) ? driversData : [])
            setDrivers(resolvedDrivers)
        } catch (err) {
            console.error("Failed to load assignments data", err)
            setError('Failed to load pending assignments')
        } finally {
            setLoading(false)
        }
    }

    const handleAssign = async () => {
        if (!selectedDelivery || !selectedDriver) return

        setAssigning(true)
        setError('')
        setSuccess('')

        try {
            await deliveryService.assignPackage(selectedDelivery.package_id, selectedDriver.id)

            setSuccess(`Package assigned to ${selectedDriver.user?.name || 'Driver'}`)
            
            // Remove the assigned delivery from the list instead of full reload for better UX
            setPendingDeliveries(prev => prev.filter(d => d.id !== selectedDelivery.id))
            setSelectedDelivery(null)
            setSelectedDriver(null)

            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Error assigning package')
        } finally {
            setAssigning(false)
        }
    }

    const filteredDeliveries = pendingDeliveries.filter(delivery => {
        const ref = delivery.package?.package_reference?.toLowerCase() || ''
        const address = getAddressString(delivery.package?.address).toLowerCase()
        const search = searchTerm.toLowerCase()
        return ref.includes(search) || address.includes(search)
    })

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Package Assignments</h1>
                <p className="text-slate-600 font-medium">Assign pending deliveries to drivers</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 flex items-center gap-3 shadow-sm animate-in fade-in">
                    <X className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-sm animate-in fade-in">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{success}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN: PENDING DELIVERIES */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Package className="w-6 h-6 text-violet-600" />
                            Unassigned Packages
                        </h2>
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-xl text-sm font-bold shadow-sm">
                            {filteredDeliveries.length} Pending
                        </span>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by package reference or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden h-[600px] flex flex-col shadow-lg shadow-slate-200/50">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                                Loading pending deliveries...
                            </div>
                        ) : filteredDeliveries.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <p className="font-bold text-lg text-slate-700">All Caught Up!</p>
                                <p className="text-sm mt-1">No pending packages to assign.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 p-3 overflow-y-auto flex-1 scrollbar-hide">
                                {filteredDeliveries.map(delivery => {
                                    const pkg = delivery.package;
                                    const addressStr = getAddressString(pkg?.address);
                                    
                                    return (
                                        <button
                                            key={delivery.id}
                                            onClick={() => setSelectedDelivery(delivery)}
                                            className={`w-full p-4 text-left transition-all rounded-2xl mb-2 group ${
                                                selectedDelivery?.id === delivery.id 
                                                    ? 'bg-violet-50 border-2 border-violet-500 shadow-md shadow-violet-100' 
                                                    : 'bg-white border-2 border-transparent hover:border-slate-200 hover:bg-slate-50 hover:scale-[1.01]'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`font-mono font-black tracking-tight text-lg ${selectedDelivery?.id === delivery.id ? 'text-violet-700' : 'text-slate-900 group-hover:text-violet-600'}`}>
                                                    {pkg?.package_reference}
                                                </span>
                                                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg">
                                                    Pending
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-slate-600 mb-3">
                                                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                <span className="line-clamp-2 font-medium">{addressStr}</span>
                                            </div>
                                            {delivery.route && (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 w-max px-2.5 py-1.5 rounded-xl">
                                                    <Map className="w-3.5 h-3.5" />
                                                    Suggested Route: {delivery.route.name}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: ASSIGNMENT FORM */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Truck className="w-6 h-6 text-blue-600" />
                            Select Driver
                        </h2>
                        
                        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-lg shadow-slate-200/50 max-h-[300px] overflow-y-auto scrollbar-hide">
                            {drivers.length === 0 ? (
                                <p className="text-sm text-slate-500 p-6 text-center font-medium">No active drivers found.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {drivers.map(driver => (
                                        <button
                                            key={driver.id}
                                            onClick={() => setSelectedDriver(driver)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 group hover:scale-[1.02] active:scale-95 ${
                                                selectedDriver?.id === driver.id 
                                                    ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-100' 
                                                    : 'bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-white'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-colors ${
                                                selectedDriver?.id === driver.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                                            }`}>
                                                {driver.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left overflow-hidden">
                                                <p className={`font-bold truncate ${selectedDriver?.id === driver.id ? 'text-blue-900' : 'text-slate-800'}`}>
                                                    {driver.user?.name}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-lg shadow-slate-200/50">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 border-b border-slate-100 pb-3">Assignment Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className={`p-5 rounded-2xl border-2 transition-colors ${selectedDelivery ? 'bg-violet-50 border-violet-200' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Package</p>
                                {selectedDelivery ? (
                                    <div>
                                        <p className="font-mono font-black text-violet-900 text-lg">{selectedDelivery.package?.package_reference}</p>
                                        <p className="text-sm text-slate-600 truncate font-medium mt-1">
                                            {getAddressString(selectedDelivery.package?.address)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Select a package from the list</p>
                                )}
                            </div>

                            <div className="flex justify-center text-slate-300">
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            <div className={`p-5 rounded-2xl border-2 transition-colors ${selectedDriver ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Driver</p>
                                {selectedDriver ? (
                                    <div>
                                        <p className="font-black text-blue-900 text-lg">{selectedDriver.user?.name}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Select a driver above</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAssign}
                            disabled={!selectedDelivery || !selectedDriver || assigning}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-violet-500/30 disabled:opacity-50 disabled:shadow-none hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                        >
                            {assigning ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Assigning Package...
                                </>
                            ) : (
                                <>
                                    <ClipboardList className="w-6 h-6" />
                                    Confirm Assignment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
