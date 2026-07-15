import { useState, useEffect } from 'react'
import { usePackages } from '../../../core/hooks/usePackages'
import coordinatorService from '../services/coordinatorService'
import {
    ClipboardList,
    Search,
    Truck,
    Package,
    ArrowRight,
    MapPin,
    Calendar,
    CheckCircle,
    X,
    Filter
} from 'lucide-react'
// import { formatDate } from '../../../../../core/utils/dateUtils' // Assuming it exists

export default function Assignments() {
    const { packages, fetchPackages, loading: packagesLoading } = usePackages()
    const [routes, setRoutes] = useState([])
    const [loadingRoutes, setLoadingRoutes] = useState(false)

    // UI State
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [selectedRoute, setSelectedRoute] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [packageType, setPackageType] = useState('unico')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [assigning, setAssigning] = useState(false)

    useEffect(() => {
        fetchPackages()
        // fetchRoutes() // To be implemented or updated in coordinatorService
    }, [fetchPackages])

    const handleAssign = async () => {
        if (!selectedPackage || !selectedRoute) return

        setAssigning(true)
        setError('')
        setSuccess('')

        try {
            await coordinatorService.assignPackage({
                package_id: selectedPackage.id,
                route_id: selectedRoute.id,
                driver_id: selectedRoute.driver_id,
                type: packageType
            })

            setSuccess('Package assigned successfully')
            fetchPackages() // Refresh list
            setSelectedPackage(null)
            setSelectedRoute(null)

            // Auto hide success message
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Error assigning package')
        } finally {
            setAssigning(false)
        }
    }

    // Filter unassigned packages
    const unassignedPackages = packages.filter(pkg =>
        !pkg.route_id &&
        (pkg.referencia_qr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Package Assignment</h1>
                    <p className="text-slate-600">Assign pending packages to routes and drivers</p>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 animate-fadeIn flex items-center gap-3">
                        <X className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-fadeIn flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        {success}
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: PACKAGES LIST */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Package className="w-5 h-5 text-violet-600" />
                                Pending Packages
                            </h2>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">
                                {unassignedPackages.length}
                            </span>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search package..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none"
                            />
                        </div>

                        {/* List */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-[600px] overflow-y-auto shadow-sm">
                            {packagesLoading ? (
                                <div className="p-8 text-center text-slate-500">Loading packages...</div>
                            ) : unassignedPackages.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    No pending packages
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {unassignedPackages.map(pkg => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${selectedPackage?.id === pkg.id ? 'bg-violet-50 hover:bg-violet-50 border-l-4 border-violet-500' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-mono font-bold text-slate-900">{pkg.referencia_qr}</span>
                                                <span className="text-xs text-slate-500">{pkg.created_at}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="truncate">{pkg.direccion}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">Recipient: {pkg.nombre_receptor}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ASSIGNMENT FORM */}
                    <div className="space-y-6">
                        {/* ROUTES SELECTION - MOCKED FOR NOW */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Truck className="w-5 h-5 text-blue-600" />
                                Select Route
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <p className="col-span-2 text-sm text-slate-500 italic">No routes available or yet to be implemented</p>
                            </div>
                        </div>

                        {/* SUMMARY & ACTION */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 border-b border-slate-100 pb-2">Assignment Summary</h3>

                            <div className="space-y-4 mb-6">
                                {/* Selected Package */}
                                <div className={`p-3 rounded-xl border ${selectedPackage ? 'bg-violet-50 border-violet-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Package</p>
                                    {selectedPackage ? (
                                        <div>
                                            <p className="font-mono font-bold text-slate-900">{selectedPackage.referencia_qr}</p>
                                            <p className="text-xs text-slate-600 truncate">{selectedPackage.direccion}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Select a package</p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <div className="flex justify-center text-slate-400">
                                    <ArrowRight className="w-5 h-5 animate-pulse" />
                                </div>

                                {/* Selected Route */}
                                <div className={`p-3 rounded-xl border ${selectedRoute ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Target Route</p>
                                    {selectedRoute ? (
                                        <div>
                                            <p className="font-bold text-slate-900">{selectedRoute.name}</p>
                                            <p className="text-xs text-slate-600">Driver: {selectedRoute.driver?.name}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Select a route</p>
                                    )}
                                </div>

                                {/* Package Type Selection */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 block mb-2">Package Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPackageType('unico')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${packageType === 'unico' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            Single
                                        </button>
                                        <button
                                            onClick={() => setPackageType('doble')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${packageType === 'doble' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            Double
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAssign}
                                disabled={!selectedPackage || !selectedRoute || assigning}
                                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {assigning ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <ClipboardList className="w-5 h-5" />
                                        Confirm Assignment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
