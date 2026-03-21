import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import companyService from '../services/company.service'
import {
    Building2,
    ArrowLeft,
    Save,
    Loader2,
    Hash,
    Phone,
    MapPin,
    AlertCircle,
    CheckCircle2,
    ToggleLeft,
    ToggleRight,
    Globe,
    Info
} from 'lucide-react'

export default function CompanyForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEdit)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        tax_id: '',
        address: '',
        phone: '',
        active: true
    })

    useEffect(() => {
        if (isEdit) fetchCompany()
    }, [id])

    const fetchCompany = async () => {
        try {
            const data = await companyService.getById(id)
            setFormData({
                name: data.name || '',
                tax_id: data.tax_id || '',
                address: data.address || '',
                phone: data.phone || '',
                active: data.active ?? true
            })
        } catch (err) {
            console.error(err)
            setError('Error al cargar los datos de la empresa')
        } finally {
            setFetching(false)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            if (isEdit) {
                await companyService.update(id, formData)
                setSuccess('Empresa actualizada correctamente')
            } else {
                await companyService.create(formData)
                setSuccess('Empresa creada exitosamente')
                setTimeout(() => navigate('/super-admin/companies'), 1500)
            }
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Ocurrió un error inesperado')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Cargando datos de la empresa...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto pb-12">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/super-admin/companies')}
                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isEdit ? 'Editar Empresa' : 'Nueva Empresa'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isEdit
                                ? 'Actualiza los datos e información de la empresa'
                                : 'Registra una nueva empresa en el sistema multi-tenant'}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="p-8 space-y-6">

                                {/* Company Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Nombre de la Empresa <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                            placeholder="Ej. Logística Norte S.A.S"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Tax ID */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        NIT / RUC
                                        <span className="ml-2 text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.tax_id}
                                            onChange={e => handleChange('tax_id', e.target.value)}
                                            placeholder="Ej. 900123456-7"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-mono font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-sans"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Teléfono
                                        <span className="ml-2 text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => handleChange('phone', e.target.value)}
                                            placeholder="Ej. +57 300 000 0000"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Dirección
                                        <span className="ml-2 text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={formData.address}
                                            onChange={e => handleChange('address', e.target.value)}
                                            placeholder="Calle, ciudad, país..."
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 resize-none placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="pt-4 border-t border-slate-100 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('active', !formData.active)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.active
                                            ? 'bg-emerald-50/50 border-emerald-100'
                                            : 'bg-slate-50 border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${formData.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-900">Estado de la empresa</p>
                                                <p className="text-xs text-slate-500">
                                                    {formData.active
                                                        ? 'Los usuarios de esta empresa pueden acceder al sistema'
                                                        : 'El acceso está bloqueado para todos los usuarios de esta empresa'}
                                                </p>
                                            </div>
                                        </div>
                                        {formData.active
                                            ? <ToggleRight className="w-10 h-10 text-emerald-500 shrink-0" />
                                            : <ToggleLeft className="w-10 h-10 text-slate-400 shrink-0" />
                                        }
                                    </button>
                                </div>

                                {/* Feedback */}
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">{success}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/super-admin/companies')}
                                    className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {isEdit ? 'Guardar Cambios' : 'Crear Empresa'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info Panel */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-[2rem] p-8 text-white shadow-xl">
                            <Building2 className="w-12 h-12 mb-4 text-indigo-300" />
                            <h3 className="text-xl font-bold mb-2">Multi-Tenant</h3>
                            <p className="text-indigo-100/80 text-sm leading-relaxed mb-6">
                                Cada empresa opera de forma completamente aislada. Sus usuarios, paquetes y entregas son independientes.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Datos completamente aislados',
                                    'Usuarios propios por empresa',
                                    'Activación / desactivación global',
                                    'Reportes independientes',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm font-medium">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-amber-50 rounded-[2rem] border border-amber-100 p-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-amber-800 text-sm mb-1">Nota sobre desactivar</p>
                                    <p className="text-amber-700 text-sm leading-relaxed">
                                        Desactivar una empresa bloquea el acceso de todos sus usuarios de forma inmediata en el próximo login.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
