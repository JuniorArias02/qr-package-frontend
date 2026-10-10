import React, { useState, useEffect } from 'react';
import { 
    MapPin, 
    Plus, 
    Save, 
    Navigation, 
    Users, 
    AlertCircle, 
    CheckCircle2, 
    Loader2,
    Building2,
    Edit2,
    Trash2,
    X
} from 'lucide-react';
import { useAuth } from '../../../core/auth/AuthContext';
import branchService from '../../driver/services/branchService';
import RouteMap from '../components/RouteMap';
import routeService from '../services/routeService';

export default function RouteManager() {
    const { user: authUser } = useAuth();
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Create Route State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        active: true,
        branch_id: authUser?.branch_id || '',
        polygon_coordinates: []
    });
    const [branches, setBranches] = useState([]);
    const [creating, setCreating] = useState(false);
    const [editingRouteId, setEditingRouteId] = useState(null);
    
    // Assignment State
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [assigningDrivers, setAssigningDrivers] = useState([]);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        if (selectedRouteId) {
            const route = routes.find(r => r.id === selectedRouteId);
            if (route && route.drivers) {
                setAssigningDrivers(route.drivers.map(d => d.id));
            } else {
                setAssigningDrivers([]);
            }
        } else {
            setAssigningDrivers([]);
        }
    }, [selectedRouteId, routes]);

    useEffect(() => {
        if (authUser?.branch_id && !formData.branch_id && !editingRouteId) {
            setFormData(prev => ({ ...prev, branch_id: authUser.branch_id }));
        }
    }, [authUser, editingRouteId]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [routesRes, driversRes, branchesRes] = await Promise.all([
                routeService.getRoutes().catch(() => ({ objeto: [] })),
                routeService.getDrivers().catch(() => ({ objeto: [] })),
                branchService.getBranches().catch(() => ({ objeto: [] }))
            ]);
            const routesList = routesRes.objeto || routesRes.data || routesRes;
            const driversList = driversRes.objeto || driversRes.data || driversRes;
            const branchesList = branchesRes.objeto || branchesRes.data || branchesRes;
            
            setRoutes(Array.isArray(routesList) ? routesList : []);
            setDrivers(Array.isArray(driversList) ? driversList : []);
            setBranches(Array.isArray(branchesList) ? branchesList : []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Could not load routes data.');
        } finally {
            setLoading(false);
        }
    };

    const handlePolygonDrawn = React.useCallback((coords) => {
        setFormData(prev => ({ ...prev, polygon_coordinates: coords }));
    }, []);

    const handleEditRoute = (route, e) => {
        e.stopPropagation();
        setEditingRouteId(route.id);
        setFormData({
            name: route.name,
            description: route.description || '',
            active: route.active !== undefined ? route.active : true,
            branch_id: route.branch_id || '',
            polygon_coordinates: route.polygon_coordinates || []
        });
        setSelectedRouteId(route.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingRouteId(null);
        setFormData({ name: '', description: '', active: true, branch_id: authUser?.branch_id || '', polygon_coordinates: [] });
    };

    const handleDeleteRoute = async (routeId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
            try {
                await routeService.deleteRoute(routeId);
                setSuccess('Route deleted successfully.');
                if (selectedRouteId === routeId) setSelectedRouteId(null);
                if (editingRouteId === routeId) handleCancelEdit();
                fetchInitialData();
                setTimeout(() => setSuccess(''), 4000);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.mensaje || 'Error deleting route.');
                setTimeout(() => setError(''), 4000);
            }
        }
    };

    const handleCreateRoute = async (e) => {
        e.preventDefault();
        if (formData.polygon_coordinates.length === 0) {
            setError('Please draw a polygon area on the map.');
            setTimeout(() => setError(''), 4000);
            return;
        }

        setCreating(true);
        setError('');
        try {
            let response;
            if (editingRouteId) {
                response = await routeService.updateRoute(editingRouteId, formData);
            } else {
                response = await routeService.createRoute(formData);
            }
            setSuccess(response.message || `Route ${editingRouteId ? 'updated' : 'created'} successfully.`);
            handleCancelEdit();
            fetchInitialData();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.mensaje || `Error ${editingRouteId ? 'updating' : 'creating'} route.`);
            setTimeout(() => setError(''), 4000);
        } finally {
            setCreating(false);
        }
    };

    const handleAssignDrivers = async (e) => {
        e.preventDefault();
        if (!selectedRouteId) return;
        if (assigningDrivers.length === 0) {
            setError('Please select at least one driver.');
            setTimeout(() => setError(''), 4000);
            return;
        }

        setAssigning(true);
        setError('');
        try {
            const response = await routeService.assignDrivers(selectedRouteId, assigningDrivers);
            setSuccess(response.message || 'Drivers assigned successfully.');
            await fetchInitialData(); // Force re-sync to get updated route assignments globally
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.mensaje || 'Error assigning drivers.');
        } finally {
            setAssigning(false);
        }
    };

    const handleDriverSelection = (driverId) => {
        setAssigningDrivers(prev => 
            prev.includes(driverId) 
                ? prev.filter(id => id !== driverId)
                : [...prev, driverId]
        );
    };

    const selectedBranch = branches.find(b => b.id.toString() === formData.branch_id.toString());

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto pb-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Navigation className="w-10 h-10 text-violet-600" />
                    Route & Zone Management
                </h1>
                <p className="text-slate-500 font-medium mt-2">Create geographic polygons for routes and assign drivers</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Forms and Lists */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    
                    {/* Create / Edit Route Form */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                {editingRouteId ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-violet-600" />}
                                {editingRouteId ? 'Edit Route' : 'Create New Route'}
                            </h3>
                            {editingRouteId && (
                                <button onClick={handleCancelEdit} type="button" className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleCreateRoute} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Route Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-900"
                                    placeholder="e.g. Zona Norte Express"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-medium text-slate-900 min-h-[100px]"
                                    placeholder="High priority route..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Assigned Branch (Sede)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <select
                                        required
                                        value={formData.branch_id}
                                        onChange={e => setFormData({ ...formData, branch_id: e.target.value })}
                                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
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
                            <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                                <p className="text-sm font-bold text-violet-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {formData.polygon_coordinates.length > 0 ? (
                                        <span className="text-emerald-600">Polygon defined ({formData.polygon_coordinates.length} points)</span>
                                    ) : (
                                        <span>Use the map draw tool to define the area.</span>
                                    )}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className={`w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 ${
                                    editingRouteId 
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/25' 
                                        : 'bg-gradient-to-r from-violet-600 to-indigo-700 shadow-indigo-500/25'
                                }`}
                            >
                                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingRouteId ? 'Update Route' : 'Save Route'}
                            </button>
                        </form>
                    </div>

                    {/* Assign Drivers */}
                    {selectedRouteId && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                Assign Drivers
                            </h3>
                            <p className="text-sm text-slate-500 font-medium mb-6">Select drivers to assign to this route.</p>
                            
                            <form onSubmit={handleAssignDrivers}>
                                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {(() => {
                                        const selectedRoute = routes.find(r => r.id === selectedRouteId);
                                        const routeBranchId = selectedRoute?.branch_id;
                                        const availableDrivers = drivers.filter(d => !routeBranchId || d.branch_id == routeBranchId);
                                        
                                        if (availableDrivers.length === 0) {
                                            return <p className="text-sm text-slate-500 italic p-4 text-center">No drivers found for this route's branch.</p>;
                                        }

                                        return availableDrivers.map(driver => (
                                            <label key={driver.id} className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border-2 ${assigningDrivers.includes(driver.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={assigningDrivers.includes(driver.id)}
                                                    onChange={() => handleDriverSelection(driver.id)}
                                                    className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                                />
                                                <div>
                                                    <p className="font-bold">{driver.name || (driver.user && driver.user.name) || 'Unknown Driver'}</p>
                                                    <p className="text-xs opacity-70">{driver.email || (driver.user && driver.user.email) || ''}</p>
                                                </div>
                                            </label>
                                        ))
                                    })()}
                                </div>
                                <button
                                    type="submit"
                                    disabled={assigning || assigningDrivers.length === 0}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {assigning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                                    Assign Selected Drivers
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column: Map and Route List */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Map Area */}
                    <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-200">
                        <RouteMap 
                            routes={routes} 
                            onPolygonDrawn={handlePolygonDrawn}
                            selectedRouteId={selectedRouteId}
                            selectedBranch={selectedBranch}
                        />
                    </div>

                    {/* Route List */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-violet-600" />
                            Created Routes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {routes.length > 0 ? (
                                routes.map(route => (
                                    <div 
                                        key={route.id}
                                        onClick={() => setSelectedRouteId(route.id)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${selectedRouteId === route.id ? 'bg-violet-50 border-violet-500 shadow-md' : 'bg-white border-slate-100 hover:border-violet-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-black text-lg ${selectedRouteId === route.id ? 'text-violet-900' : 'text-slate-900'}`}>{route.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${route.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {route.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{route.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 group-hover:translate-x-1 transition-transform">
                                                View & Assign <Navigation className="w-3 h-3" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => handleEditRoute(route, e)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={(e) => handleDeleteRoute(route.id, e)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <MapPin className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                    <p className="font-bold">No routes created yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
