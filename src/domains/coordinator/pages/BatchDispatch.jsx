import React, { useState, useEffect, useRef } from 'react'
import branchService from '../services/branch.service'
import coordinatorService from '../services/coordinatorService'
import deliveryService from '../services/delivery.service'
import { Link } from 'react-router-dom'
import {
    MapPin,
    Package,
    Truck,
    Route,
    Scan,
    X,
    CheckCircle,
    AlertCircle,
    Play
} from 'lucide-react'

export default function BatchDispatch() {
    // State
    const [branches, setBranches] = useState([])
    const [drivers, setDrivers] = useState([])
    
    // Selections & Bag
    const [selectedBranch, setSelectedBranch] = useState('')
    const [scannedPackages, setScannedPackages] = useState([]) // Array of package references (strings) or IDs. Wait, the endpoint expects package_ids. We'll store objects: { id: int, reference: string } if possible. But the prompt says "una vista donde se escanean los paquetes... el frontend lo añade a un estado local (ej. array package_ids)". 
    // Usually, a barcode scanner scans the "package_reference". If we need the "package_id", we might need to fetch it or the backend might accept package_references. Let's assume the user scans references and we send references, OR the backend endpoint /generate-batch can accept references. Let's check `deliveryService.scanPackage`. It sends `package_reference`.
    // Wait, the prompt explicitly says: `POST /api/v1/delivery/generate-batch enviando { "branch_id": 1, "package_ids": [...], "driver_ids": [...] }`.
    // How does the frontend know the `package_id` from a scanned `package_reference`? It would need to look it up, OR we just use the reference.
    // For now, I'll make the scanner input do a quick lookup via `deliveryService.scanPackage` or similar if needed, or assume the scanner inputs IDs directly (less likely).
    // Actually, I can fetch pending deliveries first to map references to IDs. Let's do that!
    
    const [pendingDeliveries, setPendingDeliveries] = useState([])
    const [scanInput, setScanInput] = useState('')
    const [selectedDrivers, setSelectedDrivers] = useState([])
    
    // UI State
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const scanInputRef = useRef(null)

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [branchesData, driversData, pendingData] = await Promise.all([
                branchService.getBranches(),
                coordinatorService.getDrivers(),
                deliveryService.getPendingDeliveries()
            ])
            
            const branchesList = branchesData.objeto || branchesData.data || branchesData || []
            setBranches(Array.isArray(branchesList) ? branchesList : [])
            
            const driversList = driversData.objeto || driversData.data || driversData || []
            setDrivers(Array.isArray(driversList) ? driversList : [])

            const pendingList = Array.isArray(pendingData) ? pendingData : []
            setPendingDeliveries(pendingList)

            // Auto-populate the bag with all unassigned packages initially
            setScannedPackages(pendingList.map(d => ({
                id: d.package_id,
                reference: d.package?.package_reference || d.package_id.toString(),
                address: d.package?.address || ''
            })))

        } catch (err) {
            console.error("Failed to load initial data", err)
            setError('Failed to load required data. Please refresh.')
        } finally {
            setLoading(false)
        }
    }

    const handleScan = (e) => {
        e.preventDefault()
        if (!scanInput.trim()) return

        const reference = scanInput.trim()
        
        // Find the package in the pending deliveries to get its ID
        const matchedDelivery = pendingDeliveries.find(d => 
            d.package?.package_reference === reference || d.package_id.toString() === reference
        )

        if (!matchedDelivery) {
            setError(`Package ${reference} not found in pending deliveries`)
            setTimeout(() => setError(''), 3000)
        } else if (scannedPackages.find(p => p.id === matchedDelivery.package_id)) {
            setError(`Package ${reference} is already in the virtual bag`)
            setTimeout(() => setError(''), 3000)
        } else {
            setScannedPackages([...scannedPackages, {
                id: matchedDelivery.package_id,
                reference: matchedDelivery.package?.package_reference || reference,
                address: matchedDelivery.package?.address || ''
            }])
            setSuccess(`Added ${reference} to bag`)
            setTimeout(() => setSuccess(''), 2000)
        }

        setScanInput('')
        scanInputRef.current?.focus()
    }

    const addAllPending = () => {
        const newPackages = pendingDeliveries
            .filter(d => !scannedPackages.find(p => p.id === d.package_id))
            .map(d => ({
                id: d.package_id,
                reference: d.package?.package_reference || d.package_id.toString(),
                address: d.package?.address || ''
            }));
            
        if (newPackages.length === 0) {
            setError('All pending packages are already in the bag.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setScannedPackages([...scannedPackages, ...newPackages]);
        setSuccess(`Added ${newPackages.length} packages to bag`);
        setTimeout(() => setSuccess(''), 2000);
    }

    const clearBag = () => {
        setScannedPackages([]);
    }

    const removePackage = (id) => {
        setScannedPackages(scannedPackages.filter(p => p.id !== id))
    }

    const toggleDriver = (id) => {
        if (selectedDrivers.includes(id)) {
            setSelectedDrivers(selectedDrivers.filter(dId => dId !== id))
        } else {
            setSelectedDrivers([...selectedDrivers, id])
        }
    }

    const handleGenerateRoutes = async () => {
        if (!selectedBranch) {
            setError('Please select an origin branch')
            return
        }
        if (scannedPackages.length === 0) {
            setError('Please scan at least one package')
            return
        }
        if (selectedDrivers.length === 0) {
            setError('Please select at least one driver')
            return
        }

        setGenerating(true)
        setError('')
        setSuccess('')

        try {
            const payload = {
                branch_id: parseInt(selectedBranch),
                package_ids: scannedPackages.map(p => p.id),
                driver_ids: selectedDrivers
            }

            const res = await deliveryService.generateBatch(payload)
            
            setSuccess(res.mensaje || 'Routes generated successfully!')
            
            // Reset form on success
            setScannedPackages([])
            setSelectedDrivers([])
            // Refresh pending deliveries in case we want to do another batch
            const pendingData = await deliveryService.getPendingDeliveries()
            setPendingDeliveries(Array.isArray(pendingData) ? pendingData : [])
            
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Error generating batch routes')
        } finally {
            setGenerating(false)
        }
    }

    const getAddressString = (address) => {
        if (!address) return '';
        if (typeof address === 'string') return address;
        if (typeof address === 'object') return address.full_address || address.normalized_address || 'Address';
        return String(address);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold uppercase tracking-widest text-sm">Initializing Dispatcher...</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto p-6 pb-24">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Route className="w-8 h-8 md:w-10 md:h-10 text-violet-600" />
                    Batch Dispatch
                </h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    Scan packages, select available drivers, and generate AI-optimized routes with clustering and TSP sorting.
                </p>
            </div>

            {/* Error & Success Toasts */}
            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 flex items-center gap-3 shadow-sm animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <span className="font-medium">{success}</span>
                    </div>
                    <Link
                        to="/coordinator/live-routes"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
                    >
                        Ver Mapa de Rutas
                    </Link>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Branch & Scanning */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* 1. Branch Selection */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-bl-[6rem] -z-10 transition-transform group-hover:scale-110"></div>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-sm">1</span>
                            Select Origin Branch
                        </h2>
                        
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                            >
                                <option value="">-- Choose a branch --</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name} - {getAddressString(b.address)}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* 2. Virtual Bag (Scanning) */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm">2</span>
                                    Scan Packages
                                </h2>
                                <div className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-xl text-sm font-black tracking-widest uppercase">
                                    Bag: {scannedPackages.length} / {pendingDeliveries.length}
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mb-4">
                                <button type="button" onClick={addAllPending} className="flex-1 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-xl transition-colors text-sm border border-slate-200">
                                    Add All Pending
                                </button>
                                <button type="button" onClick={clearBag} className="flex-1 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold rounded-xl transition-colors text-sm border border-slate-200">
                                    Clear Bag
                                </button>
                            </div>

                            <form onSubmit={handleScan} className="relative">
                                <Scan className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
                                <input
                                    ref={scanInputRef}
                                    type="text"
                                    placeholder="Scan barcode or type reference (e.g. QR-123) and press Enter..."
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    className="w-full pl-14 pr-4 py-5 bg-white border-2 border-blue-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-bold text-slate-900 shadow-inner"
                                    autoFocus
                                />
                            </form>
                        </div>

                        {/* Scanned Packages List */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                            {scannedPackages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-16 h-16 bg-slate-200/50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Your virtual bag is empty.<br/>Start scanning packages to add them to this batch.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {scannedPackages.map(pkg => (
                                        <div key={pkg.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-mono font-black text-slate-900">{pkg.reference}</p>
                                                    <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[300px]">
                                                        {getAddressString(pkg.address)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removePackage(pkg.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                                title="Remove from bag"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Drivers & Dispatch */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* 3. Driver Selection */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm">3</span>
                                    Select Drivers
                                </h2>
                                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest">
                                    {selectedDrivers.length} Selected
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {drivers.length === 0 ? (
                                <p className="text-center text-slate-500 py-10 font-medium">No active drivers found.</p>
                            ) : (
                                drivers.map(driver => {
                                    const isSelected = selectedDrivers.includes(driver.id)
                                    return (
                                        <button
                                            key={driver.id}
                                            onClick={() => toggleDriver(driver.id)}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                                                isSelected
                                                    ? 'bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-100'
                                                    : 'bg-white border-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 transition-colors ${
                                                isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                            }`}>
                                                {driver.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className={`font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                                                    {driver.user?.name}
                                                </p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Truck className="w-3 h-3" /> Driver
                                                </p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
                                            }`}>
                                                {isSelected && <CheckCircle className="w-4 h-4" />}
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* 4. Execute Dispatch */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-slate-900/20">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-600 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                        
                        <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white text-sm">4</span>
                            Execute Dispatch
                        </h2>
                        <p className="text-slate-400 text-sm font-medium mb-8">
                            Review your selections and generate optimal routes for the assigned drivers.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                                <span className="text-slate-400 font-bold uppercase tracking-widest">Branch</span>
                                <span className="text-white font-bold">{selectedBranch ? branches.find(b => b.id.toString() === selectedBranch)?.name : 'None'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                                <span className="text-slate-400 font-bold uppercase tracking-widest">Packages</span>
                                <span className="text-white font-bold">{scannedPackages.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold uppercase tracking-widest">Drivers</span>
                                <span className="text-white font-bold">{selectedDrivers.length}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateRoutes}
                            disabled={generating || !selectedBranch || scannedPackages.length === 0 || selectedDrivers.length === 0}
                            className="w-full py-5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-violet-500/40 disabled:opacity-50 disabled:shadow-none hover:shadow-2xl hover:shadow-violet-500/50 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                        >
                            {generating ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Generating Routes...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" fill="currentColor" />
                                    Generate Batch
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
