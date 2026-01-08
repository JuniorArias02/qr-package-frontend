import { useState, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/api'

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
            // no se como explicarte, quiero verte y sentirte
            // ojala pudieras adentrarte en mi mente y vieras tantas cosas que no te he dicho
            // tengo un amor tan grande para ti, que no se como entregartelo, solo quiero que sepas
            // que eres la persona mas especial para mi, que me motivas aun mas continuar
            // eres la mujer mas increible que habre visto, aun que 
            // lo sabes, solo quiero decirte que te quiero demaciado, que incluso 
            // esa palabra se queda corto, a comparado de lo que eres, te quiero muchisisimoo x1000000
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

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
            {/* Header with Back Button */}
            <div className="w-full max-w-md flex items-center justify-between mb-6">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">Escanear Paquete</h1>
                <div className="w-10"></div>
            </div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                {/* SCANNER VIEW */}
                {scanning && !loading && (
                    <div className="p-4">
                        <div className="aspect-square rounded-2xl overflow-hidden relative border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            <Scanner
                                onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                                components={{
                                    audio: false,
                                    torch: false,
                                }}
                                styles={{
                                    container: { width: '100%', height: '100%' }
                                }}
                            />
                            <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse m-8 rounded-xl pointer-events-none"></div>
                        </div>
                        <p className="text-center text-slate-400 mt-6 animate-pulse">
                            Apunta la cámara al código QR
                        </p>
                    </div>
                )}

                {/* LOADING VIEW */}
                {loading && (
                    <div className="flex flex-col items-center justify-center p-20">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-cyan-400">Procesando...</p>
                    </div>
                )}

                {/* RESULT VIEW - REGISTER FORM */}
                {!scanning && !loading && !exists && (
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6 bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/30">
                            <div className="p-2 bg-yellow-500 rounded-lg text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-yellow-100">Paquete Nuevo</h3>
                                <p className="text-xs text-yellow-200/70">Código: {formData.referencia_qr}</p>
                            </div>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Destinatario</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre_receptor}
                                    onChange={e => setFormData({ ...formData, nombre_receptor: e.target.value })}
                                    placeholder="Nombre completo"
                                    className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Dirección</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.direccion}
                                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                    placeholder="Dirección de entrega"
                                    className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Teléfono</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.telefono_receptor}
                                    onChange={e => setFormData({ ...formData, telefono_receptor: e.target.value })}
                                    placeholder="Número de contacto"
                                    className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}

                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold shadow-lg shadow-cyan-500/20 mt-4">
                                Registrar Paquete
                            </button>
                            <button type="button" onClick={resetScan} className="w-full py-3 text-slate-400 font-medium hover:text-white transition-colors">
                                Cancelar
                            </button>
                        </form>
                    </div>
                )}

                {/* RESULT VIEW - EXISTING PACKAGE */}
                {!scanning && !loading && exists && packageData && (
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Paquete Encontrado</h2>
                            <p className="text-green-400">{packageData.estado}</p>
                        </div>

                        <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Código</p>
                                <p className="font-mono text-lg">{packageData.referencia_qr}</p>
                            </div>
                            <div className="h-px bg-white/10"></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Destinatario</p>
                                <p className="font-medium text-lg">{packageData.nombre_receptor}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Dirección</p>
                                <p className="text-slate-300">{packageData.direccion}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Teléfono</p>
                                <p className="text-slate-300">{packageData.telefono_receptor}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={resetScan} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
                                Escanear Otro
                            </button>
                            {/* Future action buttons like "Deliver" could go here */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
