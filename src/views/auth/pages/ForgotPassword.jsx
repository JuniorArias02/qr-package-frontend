import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../../../services/authService'
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
        { number: 1, title: 'Email', icon: Mail, description: 'Enter your email' },
        { number: 2, title: 'Code', icon: Lock, description: 'Verify your identity' },
        { number: 3, title: 'New Password', icon: CheckCircle, description: 'Create your new password' }
    ]

    return (
        <div className="min-h-screen flex font-premium">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white text-premium">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <Package className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-black">QR Package</h1>
                        </div>
                        <p className="text-xl text-white/90 leading-relaxed max-w-md mb-8">
                            Recover access to your account in simple steps
                        </p>
                    </div>

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
                                        <h3 className="font-bold text-lg">{s.title}</h3>
                                        <p className="text-white/80 text-sm">{s.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group font-bold"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Login</span>
                        </button>
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Reset Password</h2>
                        <p className="text-slate-500 text-lg font-medium">Step {step} of 3</p>
                    </div>

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

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                            <p className="text-green-700 text-sm font-bold">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6">
                                <p className="text-violet-900 text-sm font-medium">
                                    Enter your email address and we will send you a verification code to recover your account.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-black text-lg shadow-lg shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Sending...' : 'Send Code'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6 text-center">
                                <p className="text-violet-900 text-sm font-medium">
                                    We sent a 6-digit code to <br /><span className="font-black">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-center text-3xl tracking-[0.5em] font-mono font-bold shadow-sm"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-black text-lg shadow-lg shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
                            >
                                Change email address
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6">
                                <p className="text-violet-900 text-sm font-medium">
                                    Create a new secure password for your account.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all pr-12 shadow-sm"
                                        placeholder="Min 6 characters"
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
                                <label className="text-sm font-bold text-slate-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all pr-12 shadow-sm"
                                        placeholder="Repeat your password"
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
                                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-black text-lg shadow-lg shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

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
