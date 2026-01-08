import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/api'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSendCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await fetch(ROUTES.FORGOT_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await response.json()
            if (response.ok) {
                setMessage(data.message)
                setStep(2)
            } else {
                setError(data.message || 'Error al enviar el código')
            }
        } catch (err) {
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await fetch(ROUTES.VERIFY_CODE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, code })
            })
            const data = await response.json()
            if (response.ok) {
                setMessage(data.message)
                setStep(3)
            } else {
                setError(data.message || 'Código inválido')
            }
        } catch (err) {
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (password !== passwordConfirm) {
            setError('Las contraseñas no coinciden')
            return
        }
        setLoading(true)
        setError('')
        try {
            const response = await fetch(ROUTES.RESET_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, code, password, password_confirmation: passwordConfirm })
            })
            const data = await response.json()
            if (response.ok) {
                setMessage('¡Contraseña actualizada! Redirigiendo...')
                setTimeout(() => navigate('/'), 2000)
            } else {
                setError(data.message || 'Error al cambiar la contraseña')
            }
        } catch (err) {
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 max-w-sm w-full">

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Recuperar Cuenta</h1>
                    <div className="flex justify-center gap-2 mb-4">
                        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-cyan-500' : 'bg-white/10'}`}></div>
                        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-cyan-500' : 'bg-white/10'}`}></div>
                        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-cyan-500' : 'bg-white/10'}`}></div>
                    </div>
                </div>

                {message && (
                    <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-sm text-center mb-4 border border-green-500/30">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm text-center mb-4 border border-red-500/30">
                        {error}
                    </div>
                )}

                {/* STEP 1: REQUEST CODE */}
                {step === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <p className="text-slate-400 text-sm text-center mb-4">Ingresa tu correo para recibir un código de verificación.</p>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                    </form>
                )}

                {/* STEP 2: VERIFY CODE */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <p className="text-slate-400 text-sm text-center mb-4">Ingresa el código de 6 dígitos enviado a <b>{email}</b>.</p>
                        <div className="flex justify-center">
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-40 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-cyan-500 font-mono"
                                placeholder="000000"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Verificando...' : 'Verificar Código'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-slate-500 hover:text-white">Cambiar correo</button>
                    </form>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <p className="text-slate-400 text-sm text-center mb-4">Crea una nueva contraseña.</p>
                        <div>
                            <div className="relative mb-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-12"
                                    placeholder="Nueva contraseña"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-12"
                                    placeholder="Confirmar contraseña"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-white transition-colors">
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}
