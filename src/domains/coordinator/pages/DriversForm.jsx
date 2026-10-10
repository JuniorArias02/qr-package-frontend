import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import driverService from '../services/driver.service'
import {
    User,
    Mail,
    Lock,
    ArrowLeft,
    Save,
    UserCheck,
    AlertCircle,
    CheckCircle2,
    Truck,
    Loader2,
    ToggleLeft,
    ToggleRight,
    Eye,
    EyeOff,
    Building2
} from 'lucide-react'
import { useAuth } from '../../../core/auth/AuthContext'
import branchService from '../../driver/services/branchService'

export default function DriversForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEdit)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { user: authUser } = useAuth()

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        active: true,
        branch_id: isEdit ? '' : (authUser?.branch_id || '')
    })
    const [branches, setBranches] = useState([])

    useEffect(() => {
        if (authUser?.branch_id && !formData.branch_id && !isEdit) {
            setFormData(prev => ({ ...prev, branch_id: authUser.branch_id }))
        }
    }, [authUser, isEdit])

    useEffect(() => {
        if (isEdit) {
            fetchDriver()
        }
        fetchBranches()
    }, [id])

    const fetchBranches = async () => {
        try {
            const data = await branchService.getBranches()
            setBranches(data.objeto || data.data || [])
        } catch (err) {
            console.error('Error fetching branches:', err)
        }
    }

    const fetchDriver = async () => {
        try {
            const data = await driverService.getById(id)
            setFormData({
                name: data.user.name,
                email: data.user.email,
                password: '',
                active: data.user.active,
                branch_id: data.user.branch_id || ''
            })
        } catch (err) {
            console.error(err)
            setError('Error loading driver data')
        } finally {
            setFetching(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            if (isEdit) {
                const dataToSync = { ...formData }
                if (!dataToSync.password) delete dataToSync.password
                await driverService.update(id, dataToSync)
                setSuccess('Driver updated successfully')
            } else {
                await driverService.create(formData)
                setSuccess('Driver created successfully')
                setTimeout(() => navigate('/coordinator/drivers'), 1500)
            }
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading driver details...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="max-w-3xl mx-auto pb-12">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/coordinator/drivers')}
                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isEdit ? 'Edit Driver' : 'New Driver'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isEdit ? 'Update driver profile and status' : 'Register a new delivery professional'}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Michael Smith"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="michael@qrpackage.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-bold text-slate-700">Access Password</label>
                                        {isEdit && <span className="text-[10px] uppercase font-black text-violet-500 bg-violet-50 px-2 py-0.5 rounded">Optional</span>}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required={!isEdit}
                                            className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={isEdit ? "Leave blank to keep current" : "Min. 6 characters"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Assigned Branch (Sede)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <select
                                            required
                                            value={formData.branch_id}
                                            onChange={e => setFormData({ ...formData, branch_id: e.target.value })}
                                            className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select a branch</option>
                                            {branches.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, active: !formData.active })}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.active
                                            ? 'bg-emerald-50/50 border-emerald-100 group'
                                            : 'bg-slate-50 border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${formData.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                                <UserCheck className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-900">Driver License Status</p>
                                                <p className="text-xs text-slate-500">{formData.active ? 'Available for delivery assignments' : 'Account temporarily suspended'}</p>
                                            </div>
                                        </div>
                                        {formData.active ? (
                                            <ToggleRight className="w-10 h-10 text-emerald-500" />
                                        ) : (
                                            <ToggleLeft className="w-10 h-10 text-slate-400" />
                                        )}
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 animate-fadeIn">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-bold">{success}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/coordinator/drivers')}
                                    className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
                                >
                                    Cancel
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
                                            {isEdit ? 'Save Changes' : 'Register Driver'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-violet-700 to-fuchsia-800 rounded-[2rem] p-8 text-white shadow-xl">
                            <Truck className="w-12 h-12 mb-4 text-violet-300" />
                            <h3 className="text-xl font-bold mb-2">Driver Access</h3>
                            <p className="text-violet-100/80 text-sm leading-relaxed mb-6">
                                Drivers can scan assigned packages, mark deliveries as complete, and view their daily routing history.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Access mobile mobile scanner',
                                    'Update delivery status',
                                    'View shipment coordinates',
                                    'Daily performance targets'
                                ].map((perm, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm font-medium">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                        {perm}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">Registration Policy</h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Ensure the email provided is valid. The driver will use this email and the password you select to log in through the mobile app.
                            </p>
                            <button className="text-violet-600 text-sm font-bold hover:underline">
                                Driver Onboarding Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    )
}