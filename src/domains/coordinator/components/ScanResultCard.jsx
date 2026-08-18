import { Package, User, MapPin, Hash, QrCode, AlertCircle } from 'lucide-react'

const getAddressString = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') return address.full_address || address.normalized_address || 'Address';
    return String(address);
}

export default function ScanResultCard({ data, mode }) {
    const isPending = data.delivery?.status === 'pending_assignment'
    const isSuccess = data.delivery !== undefined && !isPending
    
    const pkg = data.package || data.delivery?.package
    const delivery = data.delivery
    const driver = data.delivery?.driver

    return (
        <div className="animate-scaleIn">
            {isSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 mb-6 text-center shadow-sm">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-black text-emerald-900 tracking-tight">Successfully Assigned!</h3>
                    <p className="text-emerald-700 text-sm font-medium mt-1">The package is ready for delivery</p>
                </div>
            )}

            {isPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-6 text-center shadow-sm">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-black text-amber-900 tracking-tight">Pending Assignment</h3>
                    <p className="text-amber-700 text-sm font-medium mt-1">Registered but waiting for a driver</p>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md shadow-slate-200/50">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Package className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">Package Details</span>
                    </div>
                    {isSuccess && (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider">
                            Assigned
                        </span>
                    )}
                    {isPending && (
                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold uppercase tracking-wider">
                            Unassigned
                        </span>
                    )}
                </div>

                <div className="p-6 space-y-4">
                    <DetailRow
                        icon={<Hash className="w-5 h-5" />}
                        label="Reference"
                        value={pkg?.package_reference}
                        mono
                    />
                    <DetailRow
                        icon={<MapPin className="w-5 h-5" />}
                        label="Delivery Address"
                        value={getAddressString(pkg?.address)}
                    />

                    {(isSuccess || isPending) && (
                        <>
                            <div className="h-px bg-slate-100 my-4"></div>
                            <DetailRow
                                icon={<User className="w-5 h-5" />}
                                label="Assigned Driver"
                                value={isPending ? "Unassigned (Pending)" : (driver?.user?.name || "Unknown Driver")}
                            />
                            
                            {data.label_image && (
                                <div className="mt-6 flex flex-col items-center border border-slate-100 rounded-[2rem] p-6 bg-slate-50/50 shadow-inner">
                                    <h4 className="text-sm font-bold text-slate-700 mb-4 tracking-wide uppercase">Package Label</h4>
                                    <div className={`p-4 rounded-3xl border-2 shadow-sm ${isPending ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-white'}`}>
                                        {isPending && (
                                            <div className="flex items-center justify-center gap-2 mb-3 text-amber-700 bg-amber-100 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                <QrCode className="w-4 h-4" />
                                                Temporary QR
                                            </div>
                                        )}
                                        <img 
                                            src={data.label_image} 
                                            alt="Package Label" 
                                            className="max-w-full w-auto h-auto rounded-xl"
                                        />
                                    </div>
                                    <div className="w-full max-w-[280px] mt-6 flex justify-between items-center px-4">
                                        <div className="text-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Day ID</span>
                                            <span className="font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">{data.day_identifier}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Order</span>
                                            <span className={`font-mono font-black text-lg ${isPending ? 'text-amber-500' : 'text-violet-600'}`}>
                                                #{data.order_number}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function DetailRow({ icon, label, value, mono }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 shadow-sm">
                {icon}
            </div>
            <div className="min-w-0 flex-1 pt-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{label}</p>
                <p className={`text-slate-800 font-medium break-words ${mono ? 'font-mono text-[15px]' : 'text-[15px]'}`}>
                    {value}
                </p>
            </div>
        </div>
    )
}
