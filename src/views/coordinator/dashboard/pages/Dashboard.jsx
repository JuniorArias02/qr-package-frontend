import { useState, useEffect } from 'react'
import DashboardLayout from '../../../../components/DashboardLayout'
import coordinatorService from '../../../../services/coordinatorService'
import {
    Truck,
    Package,
    TrendingUp,
    PieChart,
    Calendar
} from 'lucide-react'

export default function CoordinatorDashboard() {
    const [stats, setStats] = useState({
        total_drivers: 0,
        assigned_today: 0,
        driver_performance: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const data = await coordinatorService.getStats()
            setStats(data.objeto || { total_drivers: 0, assigned_today: 0, driver_performance: [] })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Coordinator Dashboard</h1>
                <p className="text-slate-600">Track driver performance and delivery progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-bold uppercase text-xs mb-1">Total Drivers</p>
                    <p className="text-3xl font-black text-slate-900">{stats.total_drivers}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-bold uppercase text-xs mb-1">Assigned Today</p>
                    <p className="text-3xl font-black text-violet-600">{stats.assigned_today}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-bold uppercase text-xs mb-1">Monthly Goal</p>
                    <p className="text-3xl font-black text-emerald-600">85%</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-violet-600" />
                        Driver Performance
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {stats?.driver_performance?.length > 0 ? stats.driver_performance.map((driver, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-900">{driver.name}</span>
                                    <span className="text-sm font-semibold text-slate-500">{driver.count} packages</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-3 rounded-full"
                                        style={{ width: `${Math.min(100, (driver.count / 30) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-500 py-4">No driver data available yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
