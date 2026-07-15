import { Package, User, MapPin, Hash, QrCode } from 'lucide-react'

export default function ScanResultCard({ data, mode }) {
    const isSuccess = data.delivery !== undefined
    const pkg = data.package || data.delivery?.package
    const delivery = data.delivery
    const driver = data.delivery?.driver

    return (
        <div className="animate-scaleIn">
            {isSuccess && (
                <div className="bg-green-50 border border-green-100 rounded-3xl p-6 mb-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Successfully Assigned!</h3>
                    <p className="text-green-700 text-sm">The package is ready for delivery</p>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Package className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="font-bold text-slate-800">Package Details</span>
                    </div>
                    {isSuccess && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            Assigned
                        </span>
                    )}
                </div>

                <div className="p-6 space-y-4">
                    <DetailRow
                        icon={<Hash className="w-4 h-4" />}
                        label="Reference"
                        value={pkg.package_reference}
                        mono
                    />
                    <DetailRow
                        icon={<MapPin className="w-4 h-4" />}
                        label="Delivery Address"
                        value={pkg.address}
                    />

                    {isSuccess && (
                        <>
                            <div className="h-px bg-slate-100 my-2"></div>
                            <DetailRow
                                icon={<User className="w-4 h-4" />}
                                label="Assigned Driver"
                                value={driver?.user?.name || "Unknown Driver"}
                            />
                            
                            {data.label_image && (
                                <div className="mt-6 flex flex-col items-center border border-slate-200 rounded-2xl p-4 bg-slate-50">
                                    <h4 className="text-sm font-bold text-slate-700 mb-3">Package Label</h4>
                                    <img 
                                        src={data.label_image} 
                                        alt="Package Label" 
                                        className="max-w-full w-auto h-auto rounded-xl shadow-sm border border-slate-200"
                                    />
                                    <div className="w-full mt-4 flex justify-between px-2">
                                        <div className="text-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Day ID</span>
                                            <span className="font-mono font-bold text-slate-800">{data.day_identifier}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Order</span>
                                            <span className="font-mono font-bold text-violet-600">#{data.order_number}</span>
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
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
                <p className={`text-slate-900 font-medium break-words ${mono ? 'font-mono text-sm' : 'text-base'}`}>
                    {value}
                </p>
            </div>
        </div>
    )
}
