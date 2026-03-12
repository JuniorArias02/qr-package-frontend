import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import PackageScanner from '../../../coordinator/packages/components/PackageScanner'
import deliveryService from '../../../../services/delivery.service'
import {
    Scan as ScanIcon,
    AlertCircle,
    Loader2,
    Package as PackageIcon,
    MapPin,
    Hash,
    User,
    Calendar,
    ArrowLeft,
    CheckCircle
} from 'lucide-react'

export default function ScanDelivery() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [scannedData, setScannedData] = useState(null)
    const [error, setError] = useState('')

    const handleScan = async (scannedText) => {
        setLoading(true)
        setError('')
        try {
            // The QR code contains a URL like: http://domain.com/delivery-info/PKG-123/45
            // Let's extract the reference and ID from the scanned text
            const match = scannedText.match(/\/delivery-info\/([^/]+)\/(\d+)/)
            
            if (!match) {
                // Not a valid URL pattern, but maybe it's just the reference code?
                // For safety, warn the user.
                throw new Error("El código QR escaneado no tiene un formato de entrega válido.")
            }

            const packageReference = match[1]
            const deliveryId = parseInt(match[2], 10)

            const response = await deliveryService.getDeliveryInfo(packageReference, deliveryId)
            
            if (response.status === 'success') {
                setScannedData(response.objeto)
            } else {
                throw new Error(response.mensaje || 'Error al obtener los datos de la entrega.')
            }

        } catch (err) {
            console.error(err)
            const message = err.response?.data?.mensaje || err.message || 'Error al escanear el paquete'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setScannedData(null)
        setError('')
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto pb-12">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-violet-600 mb-1">
                            <ScanIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Lector QR</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Escanear Paquete</h1>
                        <p className="text-slate-500 text-sm">Escanea la etiqueta del paquete para ver toda su información</p>
                    </div>
                    <button 
                        onClick={() => navigate('/driver/deliveries')}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-start gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-800 text-sm">Error en Lectura</h4>
                                <p className="text-red-700 text-xs mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    {!scannedData && (
                        <PackageScanner onScan={handleScan} loading={loading} />
                    )}

                    {loading && !scannedData && (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200">
                            <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
                            <p className="font-bold text-slate-700">Obteniendo información...</p>
                        </div>
                    )}

                    {scannedData && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                                    <div className="p-3 bg-violet-100 rounded-2xl flex-shrink-0">
                                        <PackageIcon className="w-8 h-8 text-violet-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Entrega Activa</p>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">
                                            Paquete #{scannedData.package.id}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                            scannedData.delivery.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {scannedData.delivery.status === 'delivered' ? (
                                                <><CheckCircle className="w-3.5 h-3.5" /> Entregado</>
                                            ) : (
                                                <><ClockIcon className="w-3.5 h-3.5" /> Asignado</>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <DetailRow
                                        icon={<Hash className="w-4 h-4" />}
                                        label="Referencia del Paquete"
                                        value={scannedData.package.package_reference}
                                        mono
                                    />
                                    <DetailRow
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Dirección de Destino"
                                        value={scannedData.package.address}
                                    />
                                    <DetailRow
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Zona / Ruta"
                                        value={scannedData.package.zone}
                                    />
                                    <div className="h-px bg-slate-100 my-4" />
                                    
                                    <DetailRow
                                        icon={<User className="w-4 h-4" />}
                                        label="Coordinador Asignante"
                                        value={scannedData.delivery.coordinator?.user?.name || 'Desconocido'}
                                    />
                                    <DetailRow
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="Fecha de Asignación"
                                        value={new Date(scannedData.delivery.assigned_at).toLocaleString()}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={reset}
                                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <ScanIcon className="w-5 h-5" />
                                Escanear Otro Paquete
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
        </DashboardLayout>
    )
}

function DetailRow({ icon, label, value, mono }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
                <p className={`text-slate-900 font-medium break-words ${mono ? 'font-mono text-lg font-bold text-violet-700' : 'text-base'}`}>
                    {value || '-'}
                </p>
            </div>
        </div>
    )
}

function ClockIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
