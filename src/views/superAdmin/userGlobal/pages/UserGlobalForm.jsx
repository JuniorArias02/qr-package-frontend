import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import userGlobalService from '../services/userGlobal.service'
import companyService from '../../company/services/company.service'
import { 
    UserPlus, 
    ArrowLeft, 
    Save, 
    Mail, 
    Lock, 
    User, 
    Building2,
    Shield,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react'

export default function UserGlobalForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)

    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEdit)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'company_admin',
        company_id: '',
        active: true
    })

    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        try {
            const data = await companyService.getAll()
            setCompanies(data || [])
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            if (isEdit) {
                // await userGlobalService.update(id, formData)
            } else {
                await userGlobalService.create(formData)
            }
            setSuccess(true)
            setTimeout(() => navigate('/super-admin/users'), 2000)
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al procesar la solicitud')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-20">
                
                {/* Header Acciones */}
                <div className="flex items-center justify-between mb-10">
                    <button 
                        onClick={() => navigate('/super-admin/users')}
                        className="flex items-center gap-2 text-slate-500 font-bold hover:text-violet-600 transition-colors group"
                    >
                        <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:border-violet-200 shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Volver a Usuarios
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Panel Izquierdo: Info Contextual */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6 backdrop-blur-md">
                                    <UserPlus className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-black mb-4 leading-tight">
                                    {isEdit ? 'Editar Usuario' : 'Nuevo Usuario Global'}
                                </h2>
                                <p className="text-indigo-100 font-medium mb-8 leading-relaxed">
                                    Registra un nuevo Administrador de Empresa para gestionar el tenant seleccionado.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        'Acceso total a su empresa',
                                        'Gestión de conductores',
                                        'Reportes operativos',
                                        'Gestión de paquetes'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel Derecho: Formulario */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                            
                            {/* Mensajes de Feedback */}
                            {success && (
                                <div className="mb-8 flex items-center gap-4 bg-emerald-50 border-2 border-emerald-100 p-6 rounded-2xl text-emerald-700 font-bold animate-in fade-in slide-in-from-top-4">
                                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                                    <p>¡Usuario creado con éxito! Redirigiendo...</p>
                                </div>
                            )}

                            {error && (
                                <div className="mb-8 flex items-center gap-4 bg-red-50 border-2 border-red-100 p-6 rounded-2xl text-red-700 font-bold animate-in fade-in slide-in-from-top-4">
                                    <AlertCircle className="w-8 h-8 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="space-y-8">
                                
                                {/* Sección: Datos de Cuenta */}
                                <div>
                                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Información de Cuenta</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-700 ml-1">Nombre Completo</label>
                                            <div className="relative flex items-center group">
                                                <User className="absolute left-4 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                    placeholder="Ej. Juan Pérez"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-700 ml-1">Correo Electrónico</label>
                                            <div className="relative flex items-center group">
                                                <Mail className="absolute left-4 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                    placeholder="juan@empresa.com"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-800"
                                                />
                                            </div>
                                        </div>

                                        {!isEdit && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-black text-slate-700 ml-1">Contraseña Inicial</label>
                                                <div className="relative flex items-center group">
                                                    <Lock className="absolute left-4 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                                                    <input
                                                        required
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.password}
                                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                                        placeholder="••••••••"
                                                        className="w-full pl-12 pr-14 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-800"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 text-slate-400 hover:text-violet-600 transition-colors p-1"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sección: Permisos y Asignación */}
                                <div>
                                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Asignación de Empresa</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-700 ml-1">Seleccionar Empresa</label>
                                            <div className="relative flex items-center group">
                                                <Building2 className="absolute left-4 text-slate-400 w-5 h-5" />
                                                <select
                                                    required
                                                    value={formData.company_id}
                                                    onChange={e => setFormData({...formData, company_id: e.target.value})}
                                                    className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-800 appearance-none"
                                                >
                                                    <option value="">Seleccione una empresa</option>
                                                    {companies.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-700 ml-1">Rol del Usuario</label>
                                            <div className="relative flex items-center group">
                                                <Shield className="absolute left-4 text-slate-400 w-5 h-5" />
                                                <select
                                                    disabled
                                                    value={formData.role}
                                                    className="w-full pl-12 pr-10 py-4 bg-slate-100 border-2 border-transparent rounded-2xl outline-none font-black text-slate-500 appearance-none cursor-not-allowed uppercase text-[11px] tracking-widest"
                                                >
                                                    <option value="company_admin">ADMINISTRADOR DE EMPRESA</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-6 h-6" />
                                            {isEdit ? 'Guardar Cambios' : 'Crear Administrador Global'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
