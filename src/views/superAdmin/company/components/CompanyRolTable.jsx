import { useState } from 'react'
import { Edit2, ToggleLeft, ToggleRight, Loader2, Package } from 'lucide-react'

export default function CompanyRolTable({ users, roleType, onToggleUser, onEditUser }) {
    const [togglingId, setTogglingId] = useState(null)

    const handleToggle = async (userId) => {
        setTogglingId(userId)
        try {
            await onToggleUser(userId)
        } finally {
            setTogglingId(null)
        }
    }

    if (!users || users.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No hay usuarios registrados con este rol en la empresa.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
                <div
                    key={user.id}
                    className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                    {/* Top Status Bar */}
                    <div className={`h-1.5 w-full ${user.active
                        ? 'bg-gradient-to-r from-violet-500 to-indigo-600'
                        : 'bg-slate-200'
                    }`} />

                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md ${user.active
                                ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-indigo-500/20'
                                : 'bg-slate-400 shadow-slate-400/20'
                            }`}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.active
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                {user.active ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-violet-600 transition-colors">
                            {user.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium truncate mb-4">
                            {user.email}
                        </p>

                        {/* Driver specific info */}
                        {roleType === 'driver' && (
                            <div className="mt-auto mb-4 bg-indigo-50 p-4 rounded-2xl flex items-center justify-between border border-indigo-100">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-indigo-500" />
                                    <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">Entregas</span>
                                </div>
                                <span className="text-2xl font-black text-indigo-600">
                                    {user.driver?.delivered_packages_count || 0}
                                </span>
                            </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                            <button
                                onClick={() => onEditUser(user.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all active:scale-95 font-bold text-sm"
                            >
                                <Edit2 className="w-4 h-4" />
                                Editar
                            </button>
                            <button
                                onClick={() => handleToggle(user.id)}
                                disabled={togglingId === user.id}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95 font-bold text-sm ${user.active
                                    ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                } disabled:opacity-50`}
                            >
                                {togglingId === user.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : user.active ? (
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
    )
}
