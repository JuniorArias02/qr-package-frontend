import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, MapPin, Package, Map as MapIcon, RefreshCw, CheckCircle } from 'lucide-react';
import deliveryService from '../services/delivery.service';

// Custom icons for map markers
const createCustomIcon = (color) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

const defaultIcon = createCustomIcon('#3b82f6'); // blue-500
const failedIcon = createCustomIcon('#ef4444'); // red-500

export default function UndeliveredLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await deliveryService.getUndeliveredLocations();
            setLocations(data || []);
        } catch (err) {
            console.error('Error fetching undelivered locations:', err);
            setError('Error al cargar la ubicación de los paquetes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const geocoded = locations.filter(loc => loc.is_geocoded && loc.latitude != null && loc.longitude != null);
    const nonGeocoded = locations.filter(loc => !loc.is_geocoded || loc.latitude == null || loc.longitude == null);

    // Default center (Cúcuta coordinates approx, or average of geocoded)
    const defaultCenter = [7.8939, -72.5078];
    const mapCenter = geocoded.length > 0 ? [geocoded[0].latitude, geocoded[0].longitude] : defaultCenter;

    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    return (
        <div className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                            <MapIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Monitoreo Global</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mapa de Paquetes Vivos</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Ubicación en tiempo real de paquetes pendientes o con incidencias.
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-[1.25rem] font-black shadow-lg shadow-slate-200/20 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0 group disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                    Sincronizar Mapa
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 flex items-center gap-3 shrink-0">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[600px]">
                {/* LEFT: MAP */}
                <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative min-h-[500px] lg:min-h-0">
                    {loading && (
                        <div className="absolute inset-0 z-[1000] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                            <span className="font-bold text-indigo-900 tracking-widest text-xs uppercase">Cargando Mapa...</span>
                        </div>
                    )}
                    <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0">
                        <TileLayer
                            attribution='Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenStreetMap'
                            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
                            maxZoom={20}
                        />
                        {geocoded.map(loc => (
                            <Marker
                                key={loc.id}
                                position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                                icon={loc.status === 'failed' || loc.status === 'returned' ? failedIcon : defaultIcon}
                            >
                                <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
                                    <div className="p-1 min-w-[200px]">
                                        <p className="font-mono font-black text-slate-900 text-lg mb-1">{loc.package_reference}</p>
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Package className="w-4 h-4 text-slate-400" />
                                                {loc.recipient_name}
                                            </p>
                                            <p className="text-sm font-medium text-slate-500 flex items-start gap-2">
                                                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                <span className="line-clamp-2">{loc.address}</span>
                                            </p>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <span className={`inline-flex px-2 py-1 rounded-md text-xs font-black uppercase tracking-widest ${loc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    loc.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-rose-100 text-rose-700'
                                                }`}>
                                                Estado: {loc.status}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* RIGHT: NON-GEOCODED LIST */}
                <div className="w-full lg:w-[450px] bg-white border border-slate-200 rounded-[2.5rem] flex flex-col overflow-hidden shrink-0 shadow-xl shadow-slate-200/40 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[6rem] -z-0 pointer-events-none transition-transform group-hover:scale-110"></div>
                    <div className="p-8 border-b border-slate-100 z-10 relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shadow-inner">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="font-black text-slate-900 text-xl tracking-tight">
                                Requieren Corrección
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mt-3 leading-relaxed">
                            Estos paquetes no pudieron ser geolocalizados. Corrige la dirección o asígnalos a mano.
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 z-10">
                        {nonGeocoded.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 text-rose-400">
                                <CheckCircle className="w-12 h-12 mb-2 text-rose-300" />
                                <p className="font-bold">¡Todo perfecto!</p>
                                <p className="text-sm">Ningún paquete requiere corrección de dirección manual.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {nonGeocoded.map(loc => (
                                    <div key={loc.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-rose-300 hover:shadow-md hover:shadow-rose-100 transition-all duration-300 group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-mono font-black text-slate-900 group-hover:text-rose-600 transition-colors break-all pr-2">{loc.package_reference}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg shrink-0">
                                                Sin Coordenadas
                                            </span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm mb-2">{loc.recipient_name}</p>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p className="text-slate-500 text-sm font-medium italic">
                                                "{loc.address}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
