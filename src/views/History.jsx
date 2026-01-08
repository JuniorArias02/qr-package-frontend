import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ROUTES } from '../routes/api'

export default function History() {
    const navigate = useNavigate()
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(ROUTES.PACKAGES, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setPackages(data)
            } else {
                setError('Error al cargar el historial')
            }
        } catch (err) {
            console.error(err)
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-md flex items-center justify-between mb-6">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">Historial de Paquetes</h1>
                <div className="w-10"></div>
            </div>

            <div className="w-full max-w-md">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-xl">
                        {error}
                    </div>
                ) : packages.length === 0 ? (
                    <div className="text-center text-slate-500 p-12 bg-white/5 rounded-2xl border border-white/5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.75h3.75M12 18.75V21m-3.75-3.75h3.75m-3.75 0V15m0 1.5h-1.5m10.5-3.75h3.75m-3.75 0V15m0-1.5h-3.75m3.75 0V7.5m0-3.75h-3.75m-3.75 0H3.75m12 0V3" />
                        </svg>
                        <p>No hay paquetes registrados</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {packages.map(pkg => (
                            <button
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98]"
                            >
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${pkg.estado === 'Entregado' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        <span className="font-mono text-sm text-cyan-400 font-bold">{pkg.referencia_qr}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 line-clamp-1">{pkg.nombre_receptor}</p>
                                    <p className="text-xs text-slate-500">{new Date(pkg.created_at).toLocaleDateString()}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* DETAIL MODAL */}
            {selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all scale-100">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-center text-white relative">
                            <button
                                onClick={() => setSelectedPackage(null)}
                                className="absolute top-4 right-4 p-1 bg-black/20 rounded-full hover:bg-black/30 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-bold mb-1">Detalle del Paquete</h2>
                            <p className="opacity-80 text-sm">{selectedPackage.referencia_qr}</p>
                        </div>

                        <div className="p-6 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                                <QRCodeSVG
                                    value={selectedPackage.referencia_qr}
                                    size={150}
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                    level="H"
                                />
                            </div>

                            <div className="w-full space-y-4">
                                <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Estado</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedPackage.estado === 'Entregado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {selectedPackage.estado}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">Destinatario</p>
                                    <p className="text-white">{selectedPackage.nombre_receptor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">Dirección</p>
                                    <p className="text-slate-300 text-sm">{selectedPackage.direccion}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">Teléfono</p>
                                    <p className="text-slate-300 text-sm">{selectedPackage.telefono_receptor}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
