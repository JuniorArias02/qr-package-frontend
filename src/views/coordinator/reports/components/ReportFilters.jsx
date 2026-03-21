import React, { useState, useEffect } from 'react';
import driverService from '../../drivers/services/driver.service';

const ReportFilters = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        status: '',
        driver_id: '',
    });
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        const loadDrivers = async () => {
            try {
                const data = await driverService.getAll();
                setDrivers(data);
            } catch (error) {
                console.error('Error loading drivers for filters', error);
            }
        };
        loadDrivers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleClear = () => {
        const cleared = {
            start_date: '',
            end_date: '',
            status: '',
            driver_id: '',
        };
        setFilters(cleared);
        onFilter(cleared);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Inicio</label>
                    <input
                        type="date"
                        name="start_date"
                        value={filters.start_date}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-700 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
                    />
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Fin</label>
                    <input
                        type="date"
                        name="end_date"
                        value={filters.end_date}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-700 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
                    />
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conductor</label>
                    <select
                        name="driver_id"
                        value={filters.driver_id}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-700 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none appearance-none"
                    >
                        <option value="">Todos los conductores</option>
                        {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                                {driver.user?.name || `ID: ${driver.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Estado</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-700 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none appearance-none"
                    >
                        <option value="">Cualquier estado</option>
                        <option value="assigned">Asignado</option>
                        <option value="delivered">Entregado</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-8 py-3.5 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-95"
                >
                    Limpiar Filtros
                </button>
                <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Aplicar Filtros
                </button>
            </div>
        </form>
    );
};

export default ReportFilters;
