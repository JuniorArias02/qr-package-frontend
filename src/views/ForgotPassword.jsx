import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/auth.service'
import { Eye, EyeOff, Package, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSendCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = await AuthService.requestPasswordReset(email)
            setMessage(data.message)
            setStep(2)
        } catch (err) {
            const message = err.response?.data?.message || 'Error al enviar el código'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = await AuthService.verifyCode(email, code)
            setMessage(data.message)
            setStep(3)
        } catch (err) {
            const message = err.response?.data?.message || 'Código inválido'
            setError(message)
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
            await AuthService.resetPassword(email, code, password, passwordConfirm)
            setMessage('¡Contraseña actualizada! Redirigiendo...')
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            const message = err.response?.data?.message || 'Error al cambiar la contraseña'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { number: 1, title: 'Correo', icon: Mail, description: 'Ingresa tu email' },
        { number: 2, title: 'Código', icon: Lock, description: 'Verifica tu identidad' },
        { number: 3, title: 'Nueva Contraseña', icon: CheckCircle, description: 'Crea tu nueva contraseña' }
    ]

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Visual Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <Package className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-bold">QR Package</h1>
                        </div>
                        <p className="text-xl text-white/90 leading-relaxed max-w-md mb-8">
                            Recupera el acceso a tu cuenta en simples pasos
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-6 w-full max-w-md">
                        {steps.map((s) => {
                            const Icon = s.icon
                            const isActive = step === s.number
                            const isCompleted = step > s.number

                            return (
                                <div key={s.number} className="flex items-center gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500/30 border-2 border-green-400' :
                                        isActive ? 'bg-white/30 border-2 border-white' :
                                            'bg-white/10 border-2 border-white/20'
                                        }`}>
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6 text-green-300" />
                                        ) : (
                                            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/50'}`} />
                                        )}
                                    </div>
                                    <div className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                        <h3 className="font-semibold text-lg">{s.title}</h3>
                                        <p className="text-white/80 text-sm">{s.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
                        <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-700 bg-clip-text text-transparent">
                            QR Package
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Volver al inicio</span>
                        </button>
                        <h2 className="text-4xl font-bold text-slate-900 mb-2">Recuperar Cuenta</h2>
                        <p className="text-slate-500 text-lg">Paso {step} de 3</p>
                    </div>

                    {/* Mobile Progress Bar */}
                    <div className="lg:hidden mb-8">
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 flex-1 rounded-full transition-all ${step >= s ? 'bg-violet-600' : 'bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                            <p className="text-green-700 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* STEP 1: REQUEST CODE */}
                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6">
                                <p className="text-violet-900 text-sm">
                                    Ingresa tu correo electrónico y te enviaremos un código de verificación para recuperar tu cuenta.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Enviando...
                                    </span>
                                ) : (
                                    'Enviar Código'
                                )}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: VERIFY CODE */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6">
                                <p className="text-violet-900 text-sm">
                                    Hemos enviado un código de 6 dígitos a <span className="font-bold">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Código de verificación
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-center text-3xl tracking-[0.5em] font-mono"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verificando...
                                    </span>
                                ) : (
                                    'Verificar Código'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                            >
                                Cambiar correo electrónico
                            </button>
                        </form>
                    )}

                    {/* STEP 3: NEW PASSWORD */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6">
                                <p className="text-violet-900 text-sm">
                                    Crea una nueva contraseña segura para tu cuenta.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all pr-12"
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all pr-12"
                                        placeholder="Repite tu contraseña"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Actualizando...
                                    </span>
                                ) : (
                                    'Cambiar Contraseña'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
