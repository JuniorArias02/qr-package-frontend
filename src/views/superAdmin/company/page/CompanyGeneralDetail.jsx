import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import companyDetailService from '../services/companyDetail.service'
import CompanyRolTable from '../components/CompanyRolTable'
import {
    ArrowLeft,
    Users,
    Package,
    ShieldCheck,
    Truck,
    Building2,
    Loader2
} from 'lucide-react'

export default function CompanyGeneralDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [data, setData] = useState(null)
    const [activeTab, setActiveTab] = useState('company_admin')

    useEffect(() => {
        if (id) {
            fetchDetails()
        }
    }, [id])

    const fetchDetails = async () => {
        setLoading(true)
        setError('')
        try {
            const details = await companyDetailService.getCompanyDetails(id)
            setData(details)
        } catch (err) {
            console.error(err)
            setError('Error al cargar los detalles de la empresa')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleUser = async (userId) => {
        try {
            await companyDetailService.toggleUserStatus(userId)
            
            // Optimistic update
            setData(prev => {
                if (!prev) return prev
                const newUsers = { ...prev.users }
                for (const key in newUsers) {
                    newUsers[key] = newUsers[key].map(user => 
                        user.id === userId ? { ...user, active: !user.active } : user
                    )
                }
                return { ...prev, users: newUsers }
            })
        } catch (err) {
            console.error('Error toggling user:', err)
            setError('Error al cambiar el estado del usuario')
        }
    }

    const handleEditUser = (userId) => {
        navigate(`/super-admin/users/${userId}/edit`, { state: { returnTo: `/super-admin/companies/${id}/detail` } })
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold animate-pulse">Cargando detalles de la empresa...</p>
                </div>
            </DashboardLayout>
        )
    }

    if (!data) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto p-8 text-center bg-white rounded-3xl border border-slate-200">
                    <p className="text-red-500 font-bold mb-4">Empresa no encontrada.</p>
                    <button onClick={() => navigate('/super-admin/companies')} className="px-6 py-2 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700">
                        Volver al listado
                    </button>
                </div>
            </DashboardLayout>
        )
    }

    const { company, users } = data
    
    const tabs = [
        { id: 'company_admin', label: 'Administradores', icon: ShieldCheck, count: users.company_admin.length },
        { id: 'coordinator', label: 'Coordinadores', icon: Users, count: users.coordinator.length },
        { id: 'driver', label: 'Conductores', icon: Truck, count: users.driver.length },
    ]

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/super-admin/companies')}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                                    Detalle General
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                                {company.name}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <Package className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide">PAQUETES TOTALES</span>
                        </div>
                        <p className="text-4xl font-black tracking-tight">{company.deliveries_count}</p>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4 text-slate-500">
                            <Users className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide">USUARIOS TOTALES</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{company.users_count}</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4 text-emerald-500">
                            <Users className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide">COORDINADORES</span>
                        </div>
                        <p className="text-4xl font-black text-emerald-600 tracking-tight">{company.coordinators_count}</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <Truck className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide">CONDUCTORES</span>
                        </div>
                        <p className="text-4xl font-black text-blue-600 tracking-tight">{company.drivers_count}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CompanyRolTable 
                        users={users[activeTab]} 
                        roleType={activeTab} 
                        onToggleUser={handleToggleUser}
                        onEditUser={handleEditUser}
                    />
                </div>

            </div>
            
            {error && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-600 text-white rounded-2xl shadow-2xl font-bold z-50">
                    {error}
                </div>
            )}
        </DashboardLayout>
    )
}
