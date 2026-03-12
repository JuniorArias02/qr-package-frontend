import { useState, useEffect } from 'react'
import DashboardLayout from '../../../../components/DashboardLayout'
import { useDeliveries } from '../../../../hooks/useDeliveries'
import {
    Package,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Truck,
    Navigation
} from 'lucide-react'

export default function DriverDashboard() {
    const { stats, loading, fetchMyDeliveries } = useDeliveries()

    useEffect(() => {
        fetchMyDeliveries()
    }, [fetchMyDeliveries])

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Driver Portal</h1>
                <p className="text-slate-600">Overview of your daily targets and achievements</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-2">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <Truck className="w-6 h-6" />
                        </div>
                        <h3 className="text-slate-500 font-bold uppercase text-xs tracking-wider">Packages for Today</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{stats.total}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.entregados}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Success</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-2">
                        <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.pendientes}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Pending</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
                    <p className="text-indigo-100 mb-6 max-w-md">Verify your route and start delivering your assigned packages for today.</p>
                    <button className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:scale-[1.05] transition-all active:scale-95 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Go to My Deliveries
                    </button>
                </div>
                {/* Decorative background icon */}
                <Navigation className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
            </div>
        </DashboardLayout>
    )
}
