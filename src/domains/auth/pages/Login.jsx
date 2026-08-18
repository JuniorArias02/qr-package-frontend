import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../core/auth/AuthContext'
import { Eye, EyeOff, Package, Scan, TrendingUp, Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            const message = err.response?.data?.mensaje || 'Error logging in'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-premium overflow-hidden">
            {/* Left Panel - Immersive Visual Section */}
            <div className="hidden lg:flex lg:w-[60%] bg-slate-900 relative items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 opacity-90"></div>
                
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[120px] animate-blob"></div>
                    <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] bg-indigo-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-purple-500/20 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 px-24 space-y-16">
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl rotate-3">
                            <Package className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
                            QR <br /> <span className="text-white/50">Package</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-md font-medium leading-relaxed">
                            Streamline your delivery operations with intelligent QR tracking and real-time package routing.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/10">
                        <div className="space-y-2">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">Live Tracking</h4>
                            <p className="text-white/60 text-sm">Monitor packages and optimize driver routes in real-time.</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">Operations</h4>
                            <p className="text-white/60 text-sm">Seamless coordination between warehouse and delivery drivers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Minimalist Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-sm space-y-12">
                    {/* Header */}
                    <div className="space-y-3">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Sign In</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Access your dashboard</p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-tight flex items-center gap-3 animate-shake">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Email Input - Modern Borderless */}
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-violet-600 transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-8 py-4 bg-transparent border-b-2 border-slate-100 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-violet-600 transition-all font-bold text-lg"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input - Modern Borderless */}
                            <div className="group space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-violet-600 transition-colors">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-[10px] font-black text-slate-300 hover:text-violet-600 uppercase tracking-widest transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-8 py-4 bg-transparent border-b-2 border-slate-100 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-violet-600 transition-all font-bold text-lg pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button - Premium Feel */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative flex items-center justify-between py-6 px-8 bg-slate-900 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-600 transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center gap-3">
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {loading ? 'Signing In...' : 'Sign In'}
                            </div>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </button>

                        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            New to QR Package?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-slate-900 hover:text-violet-600 transition-colors"
                            >
                                Create Account
                            </button>
                        </p>
                    </form>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    33% { transform: translate(10%, -10%) scale(1.2); opacity: 0.2; }
                    66% { transform: translate(-5%, 5%) scale(0.9); opacity: 0.35; }
                }
                .animate-blob {
                    animation: blob 15s infinite ease-in-out;
                }
                .animation-delay-2000 {
                    animation-delay: 4s;
                }
                .animation-delay-4000 {
                    animation-delay: 8s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }

                /* Autofill reset for WebKit */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 1000px white inset !important;
                    -webkit-text-fill-color: #0f172a !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
        </div>
    )
}

