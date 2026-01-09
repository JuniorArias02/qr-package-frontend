import { useState, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/api'
import DashboardLayout from '../components/DashboardLayout'
import {
    Scan as ScanIcon,
    X,
    CheckCircle,
    Package,
    MapPin,
    Phone,
    User,
    ArrowRight,
    Camera,
    CameraOff,
    RefreshCw
} from 'lucide-react'

export default function Scan() {
    const navigate = useNavigate()
    const [scanning, setScanning] = useState(true)
    const [loading, setLoading] = useState(false)
    const [packageData, setPackageData] = useState(null)
    const [exists, setExists] = useState(false)
    const [error, setError] = useState('')

    // Form data for new package
    const [formData, setFormData] = useState({
        referencia_qr: '',
        direccion: '',
        nombre_receptor: '',
        telefono_receptor: ''
    })

    const handleScan = async (text) => {
        if (!text || !scanning) return

        // Pause scanning
        setScanning(false)
        setLoading(true)
        setFormData(prev => ({ ...prev, referencia_qr: text }))

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(ROUTES.PACKAGES_CHECK_QR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ referencia_qr: text })
            })
            const data = await response.json()

            if (data.exists) {
                setExists(true)
                setPackageData(data.package)
            } else {
                setExists(false)
            }
        } catch (err) {
            console.error(err)
            setError('Error al verificar el código QR')
            setScanning(true)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(ROUTES.PACKAGES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const newPackage = await response.json()
                setPackageData(newPackage)
                setExists(true) // Now it exists
            } else {
                const data = await response.json()
                setError(data.message || 'Error al registrar el paquete')
            }
        } catch (err) {
            console.error(err)
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    const resetScan = () => {
        setScanning(true)
        setPackageData(null)
        setExists(false)
        setFormData({
            referencia_qr: '',
            direccion: '',
            nombre_receptor: '',
            telefono_receptor: ''
        })
        setError('')
    }

    const toggleCamera = () => {
        setScanning(!scanning)
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Escanear Paquete</h1>
                        <p className="text-slate-600 text-sm">Registra o verifica entregas</p>
                    </div>
                    <button
                        onClick={toggleCamera}
                        className={`p-3 rounded-xl transition-all ${scanning
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                            }`}
                    >
                        {scanning ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

                    {/* CONFIRMED PACKAGE VIEW */}
                    {!scanning && !loading && exists && packageData && (
                        <div className="p-8 text-center animate-fadeIn">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                ¡Paquete Encontrado!
                            </h2>
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-8 ${packageData.estado === 'Entregado' ? 'bg-green-100 text-green-700' :
                                    packageData.estado === 'En tránsito' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-violet-100 text-violet-700'
                                }`}>
                                {packageData.estado}
                            </span>

                            <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 mb-8 border border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Package className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Código</p>
                                        <p className="font-mono font-medium text-slate-900">{packageData.referencia_qr}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <User className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Destinatario</p>
                                        <p className="font-medium text-slate-900">{packageData.nombre_receptor}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <MapPin className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Dirección</p>
                                        <p className="text-slate-600">{packageData.direccion}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetScan}
                                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <ScanIcon className="w-5 h-5" />
                                Escanear Otro
                            </button>
                        </div>
                    )}

                    {/* NEW PACKAGE FORM */}
                    {!scanning && !loading && !exists && (
                        <div className="p-6 md:p-8 animate-fadeIn">
                            <div className="mb-6 flex items-center gap-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Package className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Registrar Nuevo Paquete</h3>
                                    <p className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                                        {formData.referencia_qr}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Destinatario</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nombre_receptor}
                                            onChange={e => setFormData({ ...formData, nombre_receptor: e.target.value })}
                                            placeholder="Nombre completo"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Dirección de Entrega</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.direccion}
                                            onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                            placeholder="Dirección completa"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Teléfono de Contacto</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.telefono_receptor}
                                            onChange={e => setFormData({ ...formData, telefono_receptor: e.target.value })}
                                            placeholder="Número de teléfono"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium border border-red-100 animate-shake">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={resetScan}
                                        className="flex-1 py-3.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        Registrar
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* SCANNER VIEW */}
                    {scanning && !loading && (
                        <div className="relative aspect-square md:aspect-[4/3] bg-slate-900 group">
                            <Scanner
                                onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                                components={{
                                    audio: false,
                                    torch: false,
                                }}
                                styles={{
                                    container: { width: '100%', height: '100%' },
                                    video: { objectFit: 'cover' }
                                }}
                            />

                            {/* Overlay UI */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Focus Frame */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-2xl -mt-1 -ml-1"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-2xl -mt-1 -mr-1"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-2xl -mb-1 -ml-1"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-2xl -mb-1 -mr-1"></div>

                                        {/* Scanning Line Animation */}
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-scan"></div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="absolute bottom-10 left-0 right-0 text-center">
                                    <p className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white/90 text-sm font-medium border border-white/10">
                                        Apunta al código QR del paquete
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LOADING STATE */}
                    {loading && (
                        <div className="aspect-square md:aspect-[4/3] flex flex-col items-center justify-center bg-slate-50">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <RefreshCw className="w-6 h-6 text-violet-600 animate-pulse" />
                                </div>
                            </div>
                            <p className="mt-4 text-slate-500 font-medium animate-pulse">Procesando código...</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
