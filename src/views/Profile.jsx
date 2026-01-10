import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import AuthService from '../services/auth.service'
import {
    User,
    Mail,
    Lock,
    Save,
    Shield,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('personal') // 'personal' or 'security'

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: ''
    })
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    })

    // UI States
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const data = await AuthService.getProfile()
            setUser(data)
            setProfileForm({
                name: data.name,
                email: data.email
            })
        } catch (error) {
            console.error('Error fetching user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const data = await AuthService.updateProfile(profileForm.name, profileForm.email)
            setUser(data.user)
            // LocalStorage update is handled in AuthService, but setUser updates UI immediately
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
        } catch (error) {
            console.error(error)
            const message = error.response?.data?.message || 'Error al actualizar perfil'
            setMessage({ type: 'error', text: message })
        } finally {
            setIsSaving(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage({ type: '', text: '' })

        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
            setIsSaving(false)
            return
        }

        try {
            await AuthService.changePassword(
                passwordForm.current_password,
                passwordForm.new_password,
                passwordForm.new_password_confirmation
            )

            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
            setPasswordForm({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            })
        } catch (error) {
            console.error(error)
            const message = error.response?.data?.message || 'Error al cambiar contraseña'
            setMessage({ type: 'error', text: message })
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Cargando perfil...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Mi Perfil</h1>
                    <p className="text-slate-600">Administra tu información personal y seguridad</p>
                </div>

                <div className="grid md:grid-cols-[250px_1fr] gap-8">
                    {/* Sidebar Tabs */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'personal'
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            Información Personal
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security'
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            <Shield className="w-5 h-5" />
                            Seguridad
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">

                        {/* Status Message */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                )}
                                <p className="font-medium">{message.text}</p>
                            </div>
                        )}

                        {activeTab === 'personal' && (
                            <div className="animate-fadeIn">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                                        <p className="text-slate-500">{user?.rol || 'Usuario'}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Nombre Completo</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                                placeholder="Tu nombre completo"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Correo Electrónico</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                                placeholder="tucorreo@ejemplo.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-fadeIn">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-violet-600" />
                                    Cambiar Contraseña
                                </h2>

                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordForm.current_password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={passwordForm.new_password}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                                placeholder="Mínimo 6 caracteres"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Confirmar Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={passwordForm.new_password_confirmation}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all"
                                                placeholder="Repite la nueva contraseña"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Actualizando...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-5 h-5" />
                                                    Actualizar Seguridad
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
