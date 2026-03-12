import { useState, useEffect } from 'react'
import DashboardLayout from '../../../../components/DashboardLayout'
import adminService from '../../../../services/adminService'
import {
    Users,
    Activity,
    Package,
    TrendingUp,
    BarChart3
} from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_coordinators: 0,
        total_packages: 0,
        coordinator_productivity: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const data = await adminService.getStats()
            setStats(data.objeto || { total_coordinators: 0, total_packages: 0, coordinator_productivity: [] })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
                <p className="text-slate-600">Global productivity and coordinator performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-slate-500 font-bold uppercase text-xs tracking-wider">Total Coordinators</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{stats.total_coordinators}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-slate-500 font-bold uppercase text-xs tracking-wider">Total Packages</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{stats.total_packages}</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Coordinator Productivity
                    </h2>
                </div>
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Coordinator</th>
                                    <th className="px-6 py-4">Packages Scanned</th>
                                    <th className="px-6 py-4">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats?.coordinator_productivity?.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.count}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                                                <div
                                                    className="bg-indigo-500 h-2 rounded-full"
                                                    style={{ width: `${Math.min(100, (item.count / 50) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
