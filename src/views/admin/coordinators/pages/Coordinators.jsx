import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import coordinatorService from '../services/coordinator.service'
import {
    UserPlus,
    Search,
    Activity,
    Edit2,
    Shield,
    ExternalLink,
    Loader2,
    MoreVertical,
    Mail
} from 'lucide-react'

export default function Coordinators() {
    const navigate = useNavigate()
    const [coordinators, setCoordinators] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCoordinators()
    }, [])

    const fetchCoordinators = async () => {
        setLoading(true)
        try {
            const data = await coordinatorService.getAll()
            setCoordinators(data || [])
        } catch (err) {
            console.error(err)
            setError('Error loading coordinators')
        } finally {
            setLoading(false)
        }
    }

    const filteredCoordinators = coordinators.filter(c =>
        c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                                <Shield className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-violet-600">Administration Module</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Coordinators</h1>
                        <p className="text-slate-500 font-medium">Manage administrative staff and system access</p>
                    </div>

                    <button
                        onClick={() => navigate('/admin/coordinators/new')}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Add New Member
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="relative mb-10 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl focus:border-violet-500 focus:ring-8 focus:ring-violet-500/5 outline-none shadow-xl shadow-slate-200/40 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    />
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-bold animate-pulse">Retrieving coordinator list...</p>
                    </div>
                ) : filteredCoordinators.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No coordinators found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">
                            We couldn't find any coordinators matching your search. Try different keywords or add a new one.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCoordinators.map(coord => (
                            <div
                                key={coord.id}
                                className="group bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg ${coord.user.active
                                            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-indigo-500/30'
                                            : 'bg-slate-400 shadow-slate-400/30'
                                            }`}>
                                            {coord.user.name.charAt(0)}
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                                            {coord.user.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {coord.user.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${coord.user.active
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-red-50 text-red-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${coord.user.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                            {coord.user.active ? 'Active' : 'Inactive'}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/coordinators/${coord.id}/edit`)}
                                                className="p-3 bg-slate-50 text-slate-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all active:scale-95 shadow-sm"
                                                title="Edit Settings"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-3 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all active:scale-95 shadow-sm"
                                                title="Analytics"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-600 text-white rounded-2xl shadow-2xl font-bold animate-bounce z-50">
                    {error}
                </div>
            )}
        </DashboardLayout>
    )
}
