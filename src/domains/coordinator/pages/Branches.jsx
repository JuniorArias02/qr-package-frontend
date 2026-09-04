import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import branchService from '../services/branch.service'
import { Plus, Search, Building2, MapPin, Edit, Trash2, AlertCircle } from 'lucide-react'

export default function Branches() {
    const getAddressString = (address) => {
        if (!address) return '';
        if (typeof address === 'string') return address;
        if (typeof address === 'object') return address.full_address || address.normalized_address || 'Address';
        return String(address);
    }

    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isDeleting, setIsDeleting] = useState(null)

    useEffect(() => {
        fetchBranches()
    }, [])

    const fetchBranches = async () => {
        setLoading(true)
        try {
            const data = await branchService.getBranches()
            const branchesList = data.objeto || data.data || data || []
            setBranches(Array.isArray(branchesList) ? branchesList : [])
        } catch (err) {
            console.error("Failed to load branches", err)
            setError('Failed to load branches')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this branch?')) return

        setIsDeleting(id)
        setError('')
        
        try {
            await branchService.deleteBranch(id)
            setSuccess('Branch deleted successfully')
            setBranches(branches.filter(b => b.id !== id))
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Error deleting branch')
            setTimeout(() => setError(''), 3000)
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredBranches = branches.filter(branch => {
        const addressStr = getAddressString(branch.address);
        return (
            branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            addressStr.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    return (
        <div className="max-w-7xl mx-auto p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-violet-600" />
                        Branches
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage company delivery branches</p>
                </div>
                <Link
                    to="/coordinator/branches/new"
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Add Branch
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-3 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">{success}</span>
                </div>
            )}

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search branches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-sm uppercase tracking-widest">Loading branches...</p>
                    </div>
                ) : filteredBranches.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No branches found</h3>
                        <p className="text-slate-500 font-medium">Get started by creating a new delivery branch.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Name</th>
                                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</th>
                                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBranches.map(branch => (
                                    <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                                                    {branch.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{branch.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                                <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                                                {getAddressString(branch.address)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/coordinator/branches/${branch.id}/edit`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(branch.id)}
                                                    disabled={isDeleting === branch.id}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isDeleting === branch.id ? (
                                                        <div className="w-5 h-5 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
