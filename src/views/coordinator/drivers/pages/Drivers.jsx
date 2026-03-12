import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../../components/DashboardLayout'
import driverService from '../services/driver.service'
import {
    UserPlus,
    Search,
    Activity,
    Edit2,
    Trash2,
    Truck,
    Mail,
    Loader2,
    ExternalLink,
    MoreVertical
} from 'lucide-react'

export default function Drivers() {
    const navigate = useNavigate()
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchDrivers()
    }, [])

    const fetchDrivers = async () => {
        setLoading(true)
        try {
            const data = await driverService.getAll()
            setDrivers(data || [])
        } catch (err) {
            console.error(err)
            setError('Error loading drivers list')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this driver and their account?')) return

        try {
            await driverService.delete(id)
            setSuccess('Driver removed successfully')
            fetchDrivers()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error(err)
            setError('Could not delete driver')
            setTimeout(() => setError(''), 3000)
        }
    }

    const filteredDrivers = drivers.filter(d =>
        d.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                                <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-violet-600">Logistics Team</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Drivers</h1>
                        <p className="text-slate-500 font-medium">Manage your delivery fleet and status</p>
                    </div>

                    <button
                        onClick={() => navigate('/coordinator/drivers/new')}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Add New Driver
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-10 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search drivers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl focus:border-violet-500 focus:ring-8 focus:ring-violet-500/5 outline-none shadow-xl shadow-slate-200/40 transition-all font-medium text-slate-800"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-bold animate-pulse">Syncing fleet data...</p>
                    </div>
                ) : filteredDrivers.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Truck className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Fleet is empty</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">
                            No drivers found. Start by recruiting your first delivery professional.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDrivers.map(driver => (
                            <div
                                key={driver.id}
                                className="group bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg ${driver.user.active
                                            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-indigo-500/30'
                                            : 'bg-slate-400 shadow-slate-400/30'
                                            }`}>
                                            {driver.user.name.charAt(0)}
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleDelete(driver.id)}
                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Remove Driver"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                                            {driver.user.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2 text-ellipsis overflow-hidden">
                                            <Mail className="w-4 h-4 shrink-0" />
                                            {driver.user.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${driver.user.active
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-red-50 text-red-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${driver.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                            {driver.active ? 'Ready' : 'Off-duty'}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/coordinator/drivers/${driver.id}/edit`)}
                                                className="p-3 bg-slate-50 text-slate-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Edit Profile"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-3 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Performance"
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

            {/* Flash Messages */}
            {(error || success) && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl font-black text-white z-50 animate-bounce flex items-center gap-3 ${error ? 'bg-red-600' : 'bg-emerald-600'
                    }`}>
                    {error ? <X className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    {error || success}
                </div>
            )}
        </DashboardLayout>
    )
}
