import { User, Check, AlertCircle } from 'lucide-react'

export default function DriverSelector({ drivers, onSelect, selectedId, loading }) {
    if (!drivers || drivers.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No active drivers available</p>
            </div>
        )
    }

    return ( 
        <div className="space-y-3">
            <h3 className="font-bold text-slate-800 ml-1 mb-2">Select a Driver</h3>
            <div className="grid gap-3">
                {drivers.map((driver) => {
                    const isSelected = selectedId === driver.id
                    return (
                        <button
                            key={driver.id}
                            type="button"
                            disabled={loading}
                            onClick={() => onSelect(driver.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${isSelected
                                    ? 'bg-violet-50 border-violet-600 ring-4 ring-violet-500/10'
                                    : 'bg-white border-slate-100 hover:border-slate-200'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="relative">
                                {driver.user.profile_image ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${driver.user.profile_image}`}
                                        alt={driver.user.name}
                                        className="w-12 h-12 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-violet-600" />
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`font-bold truncate ${isSelected ? 'text-violet-900' : 'text-slate-900'}`}>
                                    {driver.user.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{driver.user.email}</p>
                            </div>
                        </button>
                    )
                })}
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </div>
    )
}
