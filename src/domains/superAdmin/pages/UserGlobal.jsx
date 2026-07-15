import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import userGlobalService from '../services/userGlobal.service'
import companyService from '../services/company.service'
import {
    Users,
    Search,
    ShieldCheck,
    UserCircle,
    Building2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Mail,
    UserPlus
} from 'lucide-react'
import UserGlobalLoader from '../components/UserGlobalLoader'

export default function UserGlobal() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({ company_id: '', role: '' })
    const [togglingId, setTogglingId] = useState(null)

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [usersData, companiesData] = await Promise.all([
                userGlobalService.getAll(),
                companyService.getAll()
            ])
            setUsers(usersData || [])
            setCompanies(companiesData || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async (id) => {
        setTogglingId(id)
        try {
            await userGlobalService.toggleActive(id)
            setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
        } catch (err) {
            console.error(err)
        } finally {
            setTogglingId(null)
        }
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCompany = filters.company_id === '' || u.company_id === parseInt(filters.company_id)
        const matchesRole = filters.role === '' || u.role === filters.role
        return matchesSearch && matchesCompany && matchesRole
    })

    return (
        <>
            <div className="max-w-7xl mx-auto pb-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-violet-600">
                                Gestión Global de Cuentas
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Usuarios</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Administra a todo el personal del ecosistema</p>
                    </div>

                    <button 
                        onClick={() => navigate('/super-admin/users/new')}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Añadir Usuario Global
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <div className="md:col-span-2 relative group flex items-center">
                        <Search className="absolute left-5 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-violet-500 outline-none shadow-sm transition-all font-medium text-slate-800"
                        />
                    </div>
                    
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            value={filters.company_id}
                            onChange={e => setFilters({...filters, company_id: e.target.value})}
                            className="w-full pl-10 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-violet-500 outline-none shadow-sm transition-all font-bold text-slate-700 appearance-none"
                        >
                            <option value="">Todas las Empresas</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            value={filters.role}
                            onChange={e => setFilters({...filters, role: e.target.value})}
                            className="w-full pl-10 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-violet-500 outline-none shadow-sm transition-all font-bold text-slate-700 appearance-none"
                        >
                            <option value="">Todos los Roles</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="company_admin">Admin Empresa</option>
                            <option value="coordinator">Coordinador</option>
                            <option value="driver">Conductor</option>
                        </select>
                    </div>
                </div>

                {/* Table View */}
                {loading ? (
                    <UserGlobalLoader />
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-5">Usuario / ID</th>
                                        <th className="px-8 py-5">Empresa</th>
                                        <th className="px-8 py-5">Rol / Acceso</th>
                                        <th className="px-8 py-5">Estado</th>
                                        <th className="px-8 py-5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center font-black">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors uppercase text-sm tracking-tight">{user.name}</p>
                                                        <div className="flex items-center text-slate-400 gap-1 text-[11px] font-bold">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {user.company ? (
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-violet-500" />
                                                        <span className="text-sm font-bold text-slate-700">{user.company.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Global Master</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="inline-flex items-center px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {user.role}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.active ? 'text-emerald-500' : 'text-red-400'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                                    {user.active ? 'Activo' : 'Baneado'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => handleToggle(user.id)}
                                                    className={`p-3 rounded-xl transition-all active:scale-95 ${
                                                        user.active ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                    }`}
                                                >
                                                    {togglingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (user.active ? <ToggleRight /> : <ToggleLeft />)}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}