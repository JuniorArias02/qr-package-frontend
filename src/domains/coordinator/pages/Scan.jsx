import { useState } from 'react'
import deliveryService from '../services/delivery.service'
import PackageScanner from '../components/PackageScanner'
import DriverSelector from '../components/DriverSelector'
import ScanResultCard from '../components/ScanResultCard'
import {
    Scan as ScanIcon,
    CheckCircle,
    AlertCircle,
    Loader2,
    Truck,
    Package as PackageIcon,
    User,
    MapPin,
    Phone,
    ArrowRight
} from 'lucide-react'

export default function Scan() {
    const [step, setStep] = useState('idle') // idle, registration, manual_selection, result
    const [loading, setLoading] = useState(false)
    const [scanData, setScanData] = useState(null)
    const [selectedDriverId, setSelectedDriverId] = useState(null)
    const [error, setError] = useState('')

    // Form data for new package
    const [formData, setFormData] = useState({
        package_reference: '',
        address: ''
    })

    const handleScan = async (reference) => {
        setLoading(true)
        setError('')
        try {
            const response = await deliveryService.scanPackage(reference)

            if (response.objeto.package) {
                if (response.objeto.assignment_mode === 'automatic' && response.objeto.delivery) {
                    setScanData(response.objeto)
                    setStep('result')
                } else {
                    setScanData(response.objeto)
                    setStep('manual_selection')
                }
            } else {
                // Package not found -> Show registration form
                setFormData(prev => ({ ...prev, package_reference: reference }))
                setScanData(response.objeto) // contains assignment_mode
                setStep('registration')
            }
        } catch (err) {
            console.error(err)
            const message = err.response?.data?.mensaje || 'Error scanning package'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = {
                ...formData,
                driver_id: selectedDriverId
            }
            const response = await deliveryService.registerPackage(data)
            setScanData(response.objeto)
            setStep('result')
        } catch (err) {
            console.error(err)
            const message = err.response?.data?.mensaje || 'Error registering package'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleManualAssign = async () => {
        if (!selectedDriverId || !scanData?.package?.id) return

        setLoading(true)
        setError('')
        try {
            const response = await deliveryService.scanPackage(
                scanData.package.package_reference,
                selectedDriverId
            )
            setScanData(response.objeto)
            setStep('result')
        } catch (err) {
            console.error(err)
            const message = err.response?.data?.mensaje || 'Error assigning package'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setStep('idle')
        setScanData(null)
        setSelectedDriverId(null)
        setError('')
        setFormData({
            package_reference: '',
            address: ''
        })
    }

    return (
        <>
            <div className="max-w-2xl mx-auto pb-12">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-violet-600 mb-1">
                            <Truck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Logistics</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Scanner</h1>
                        <p className="text-slate-500 text-sm">Assign packages to drivers efficiently</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-start gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-800 text-sm">Operation Failed</h4>
                                <p className="text-red-700 text-xs mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    {step === 'idle' && (
                        <PackageScanner onScan={handleScan} loading={loading} />
                    )}

                    {step === 'registration' && (
                        <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-3xl animate-fadeIn">
                            <div className="mb-6 flex items-center gap-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <PackageIcon className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-slate-900">Register New Package</h3>
                                    <p className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block truncate max-w-full">
                                        {formData.package_reference}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-5">                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Delivery Address</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Full address"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {scanData?.assignment_mode === 'assign_to' && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <DriverSelector
                                            drivers={scanData.available_drivers}
                                            onSelect={setSelectedDriverId}
                                            selectedId={selectedDriverId}
                                            loading={loading}
                                        />
                                    </div>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={reset}
                                        className="flex-1 py-3.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || (scanData?.assignment_mode === 'assign_to' && !selectedDriverId)}
                                        className="flex-[2] py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Register & Assign
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 'manual_selection' && scanData && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <ScanResultCard data={scanData} mode="assign_to" />
                            </div>

                            <DriverSelector
                                drivers={scanData.available_drivers}
                                onSelect={setSelectedDriverId}
                                selectedId={selectedDriverId}
                                loading={loading}
                            />

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={reset}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleManualAssign}
                                    disabled={loading || !selectedDriverId}
                                    className="flex-[2] py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Confirm Assignment
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'result' && scanData && (
                        <div className="space-y-6 animate-fadeIn">
                            <ScanResultCard data={scanData} />

                            <button
                                onClick={reset}
                                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <ScanIcon className="w-5 h-5" />
                                Scan Next Package
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
        </>
    )
}
