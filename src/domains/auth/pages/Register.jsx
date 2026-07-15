import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { Package, User, Mail, Lock, ArrowRight, UserPlus, AlertCircle } from 'lucide-react'

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'usuario',
        codigo_personal: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const response = await authService.login(formData) 

            if (response.access_token) {
                localStorage.setItem('token', response.access_token)
                localStorage.setItem('user', JSON.stringify(response.user))
                navigate('/dashboard')
            } else {
                navigate('/')
            }

        } catch (err) {
            console.error(err)
            const message = err.response?.data?.mensaje || 'Error registering user'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-premium overflow-hidden">
            {/* Left Panel - Immersive Visual */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-900 opacity-90"></div>
                
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 px-16 space-y-12 text-center lg:text-left">
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 mx-auto lg:mx-0 shadow-2xl">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-6xl font-black text-white tracking-tighter leading-none">
                            Join the <br /> <span className="text-white/40">Network</span>
                        </h2>
                        <p className="text-lg text-white/60 font-medium max-w-sm leading-relaxed mx-auto lg:mx-0">
                            Create your digital identity and start managing your logistics ecosystem today.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex items-center gap-6 justify-center lg:justify-start">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white uppercase">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            +2k Professionals joined
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-10">
                    {/* Mobile Logo & Header */}
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-3 bg-violet-600 rounded-2xl shadow-xl shadow-violet-500/20">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Registration</h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Deployment Protocol v2.0</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-tight flex items-center gap-3 animate-shake">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-base text-slate-900 placeholder-slate-200"
                                        placeholder="Identification"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-base text-slate-900 placeholder-slate-200"
                                        placeholder="name@domain.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password */}
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors ml-1">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-base text-slate-900 placeholder-slate-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-violet-600 transition-colors ml-1">Verify Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password_confirmation}
                                        onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-violet-600 focus:outline-none transition-all font-bold text-base text-slate-900 placeholder-slate-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group py-6 bg-slate-900 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-4 overflow-hidden relative"
                        >
                            <span className="relative z-10">{loading ? 'Processing' : 'Initialize Identity'}</span>
                            {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                            Already part of the network?{' '}
                            <button
                                onClick={() => navigate('/')}
                                className="text-slate-900 hover:text-violet-600 transition-colors border-b-2 border-slate-900 hover:border-violet-600 ml-1"
                            >
                                Authenticate
                            </button>
                        </p>
                    </div>
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

