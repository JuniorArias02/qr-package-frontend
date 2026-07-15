import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/authService'
import { Eye, EyeOff, Package, Mail, Lock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

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
            const msg = err.response?.data?.message || 'Error sending code'
            setError(msg)
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
            const msg = err.response?.data?.message || 'Invalid code'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (password !== passwordConfirm) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        setError('')
        try {
            await AuthService.resetPassword(email, code, password, passwordConfirm)
            setMessage('Password updated! Redirecting...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            const msg = err.response?.data?.message || 'Error updating password'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { number: 1, title: 'Identity', icon: Mail, description: 'Verify your email' },
        { number: 2, title: 'Security', icon: Lock, description: 'Enter secret code' },
        { number: 3, title: 'New Access', icon: CheckCircle, description: 'Finalize password' }
    ]

    return (
        <div className="min-h-screen flex bg-white font-premium overflow-hidden">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-[40%] bg-slate-900 relative items-center justify-center border-r border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-violet-900 opacity-95"></div>
                
                <div className="relative z-10 px-16 space-y-12 w-full">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group mb-8 font-black uppercase text-[10px] tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return
                        </button>
                        <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                            Reset <br /> <span className="text-white/40">Credential</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {steps.map((s) => {
                            const Icon = s.icon
                            const isActive = step === s.number
                            const isCompleted = step > s.number

                            return (
                                <div key={s.number} className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                        isCompleted ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' :
                                        isActive ? 'bg-white text-slate-900 shadow-xl' :
                                        'bg-white/10 text-white/30 border border-white/10'
                                    }`}>
                                        {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className={`space-y-0.5 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-1' : 'opacity-40'}`}>
                                        <h3 className="font-black text-xs uppercase tracking-widest text-white">{s.title}</h3>
                                        <p className="text-[10px] font-bold text-white/50 tracking-tight">{s.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-12">
                    {/* Header */}
                    <div className="space-y-3 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="p-3 bg-violet-600 rounded-2xl">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Account Recovery</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Step {step} · Verification Protocol</p>
                    </div>

                    {message && (
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-tight flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-tight flex items-center gap-3 animate-shake">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-8">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors">Registered Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-8 py-4 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-lg text-slate-900"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group py-6 bg-slate-900 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Transmitting' : 'Send Recovery Code'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 text-center block uppercase tracking-widest">Input Security Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full py-6 bg-slate-50 rounded-3xl text-slate-900 text-center text-4xl tracking-[0.5em] font-mono font-black focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all"
                                    placeholder="000000"
                                    required
                                />
                                <p className="text-[10px] text-center font-bold text-slate-400 uppercase">Code sent to: {email}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group py-6 bg-slate-900 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Verifying' : 'Decrypt & Authenticate'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-[10px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest"
                            >
                                Change Identity
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors">Master Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-8 py-4 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-lg text-slate-900"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors">Confirm Master</label>
                                    <div className="relative">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            className="w-full pl-8 py-4 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-lg text-slate-900"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group py-6 bg-slate-900 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Updating' : 'Finalize Recovery'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
        </div>
    )
}

