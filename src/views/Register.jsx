import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthService from '../services/auth.service'
import { Package, User, Mail, Lock, ArrowRight, UserPlus, AlertCircle } from 'lucide-react'

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'usuario', // Default role
        codigo_personal: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (formData.password !== formData.password_confirmation) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        try {
            await AuthService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation,
                formData.rol,
                formData.codigo_personal
            )
            // Redirect to dashboard or login
            // For now, let's auto-login or redirect to login. The backend returns a token, so we could auto-login ideally.
            // But AuthService.register implementation returns data, let's see if it saves token.
            // Wait, existing AuthService.register just returns response.data
            // The backend returns access_token.
            // Ideally we should auto-login.

            // Let's modify handle to auto-login if token present? 
            // The backend returns: { message, access_token, user }
            // Let's manually save token here since AuthService.register doesn't do it automatically like login might not have been designed to?
            // Actually AuthService.login does. AuthService.register just returns data.
            // We can save it here.

            // However, typically after registration we might want user to login or auto-login.
            // Let's auto-login for better UX.

            // Wait, I can't see the response content in this scope easily without making assumptions.
            // But backend `AuthController.php` returns `access_token` and `user` inside the json response.
            // So we can use that.

            const response = await AuthService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation,
                formData.rol,
                formData.codigo_personal
            )

            if (response.access_token) {
                localStorage.setItem('token', response.access_token)
                localStorage.setItem('user', JSON.stringify(response.user))
                navigate('/dashboard')
            } else {
                navigate('/')
            }

        } catch (err) {
            console.error(err)
            const message = err.response?.data?.message || 'Error al registrar usuario'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-900/40 z-10"></div>

                {/* Abstract Shapes */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>

                <div className="relative z-20 text-center p-12 max-w-lg">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6">Únete a QR Package</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Gestiona tus entregas de manera eficiente, segura y moderna. Crea tu cuenta en segundos.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-center mb-8">
                        <div className="lg:hidden w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Crear Cuenta</h1>
                        <p className="text-slate-500 mt-2">Ingresa tus datos para registrarte</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Nombre Completo</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                                    placeholder="nombre@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 ml-1">Contraseña</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 ml-1">Confirmar</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password_confirmation}
                                        onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Optional Role or Code */}
                        {/* 
                        <div className="space-y-1">
                             <label className="text-sm font-medium text-slate-700 ml-1">Código Personal (Opcional)</label>
                             <input ... />
                        </div>
                        */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/" className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition-all">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
