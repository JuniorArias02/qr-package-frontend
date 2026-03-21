import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import companyService from '../services/company.service'
import {
    Building2,
    Plus,
    Search,
    Edit2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Phone,
    MapPin,
    Hash,
    Globe,
    Eye
} from 'lucide-react'

export default function CompanyFormList() {
    const navigate = useNavigate()
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [togglingId, setTogglingId] = useState(null)

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        setLoading(true)
        try {
            const data = await companyService.getAll()
            setCompanies(data || [])
        } catch (err) {
            console.error(err)
            setError('Error al cargar las empresas')
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async (id) => {
        setTogglingId(id)
        try {
            await companyService.toggleActive(id)
            setCompanies(prev =>
                prev.map(c => c.id === id ? { ...c, active: !c.active } : c)
            )
        } catch (err) {
            console.error(err)
            setError('Error al cambiar el estado de la empresa')
        } finally {
            setTogglingId(null)
        }
    }

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.tax_id && c.tax_id.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const activeCount = companies.filter(c => c.active).length

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Globe className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                                Super Admin · Multi-Tenant
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Empresas</h1>
                        <p className="text-slate-500 font-medium">
                            Gestiona las empresas registradas en el sistema
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/super-admin/companies/new')}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Nueva Empresa
                    </button>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { label: 'Total', value: companies.length, color: 'from-violet-500 to-indigo-600', bg: 'bg-violet-50', text: 'text-violet-700' },
                        { label: 'Activas', value: activeCount, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                        { label: 'Inactivas', value: companies.length - activeCount, color: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-700' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-white shadow-sm`}>
                            <p className={`text-3xl font-black ${stat.text}`}>{stat.value}</p>
                            <p className={`text-sm font-bold ${stat.text} opacity-70`}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-10 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o NIT / RUC..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl focus:border-violet-500 focus:ring-8 focus:ring-violet-500/5 outline-none shadow-xl shadow-slate-200/40 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-bold animate-pulse">Cargando empresas...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Building2 className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No se encontraron empresas</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">
                            {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Crea la primera empresa del sistema.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(company => (
                            <div
                                key={company.id}
                                className="group bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                {/* Card color bar */}
                                <div className={`h-1.5 w-full ${company.active
                                    ? 'bg-gradient-to-r from-violet-500 to-indigo-600'
                                    : 'bg-slate-200'
                                }`} />

                                <div className="p-8">
                                    {/* Avatar + status */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg ${company.active
                                            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-indigo-500/30'
                                            : 'bg-slate-400 shadow-slate-400/30'
                                        }`}>
                                            {company.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${company.active
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-red-50 text-red-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${company.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                            {company.active ? 'Activa' : 'Inactiva'}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-violet-600 transition-colors truncate">
                                        {company.name}
                                    </h3>

                                    {/* Details */}
                                    <div className="space-y-2 mb-6">
                                        {company.tax_id && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="font-mono font-medium">{company.tax_id}</span>
                                            </div>
                                        )}
                                        {company.phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="font-medium">{company.phone}</span>
                                            </div>
                                        )}
                                        {company.address && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="font-medium truncate">{company.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                                        <button
                                            onClick={() => navigate(`/super-admin/companies/${company.id}/detail`)}
                                            className="p-3 bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all active:scale-95"
                                            title="Ver Detalles Generales"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/super-admin/companies/${company.id}/edit`)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-white rounded-xl transition-all active:scale-95 font-bold text-sm"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleToggle(company.id)}
                                            disabled={togglingId === company.id}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-95 font-bold text-sm ${company.active
                                                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                            } disabled:opacity-50`}
                                        >
                                            {togglingId === company.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : company.active ? (
                                                <><ToggleRight className="w-4 h-4" /> Desactivar</>
                                            ) : (
                                                <><ToggleLeft className="w-4 h-4" /> Activar</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-600 text-white rounded-2xl shadow-2xl font-bold z-50">
                    {error}
                </div>
            )}
        </DashboardLayout>
    )
}