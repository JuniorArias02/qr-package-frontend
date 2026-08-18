import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plus, Save, Activity, CheckCircle2, ChevronRight, Map as MapIcon } from 'lucide-react';
import routeService from '../services/route.service';

// Handler for map clicks
function MapEventHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        }
    });
    return null;
}

export default function RouteManager() {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newRouteName, setNewRouteName] = useState('');
    const [newRouteDescription, setNewRouteDescription] = useState('');
    const [newPointRadius, setNewPointRadius] = useState(2.5); // Default radius in km

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        try {
            setLoading(true);
            const data = await routeService.getAll();
            setRoutes(data || []);
        } catch (error) {
            console.error("Failed to load routes", error);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoute = async () => {
        if (!newRouteName) return;
        try {
            const newRoute = await routeService.create({
                name: newRouteName,
                description: newRouteDescription,
                active: true,
                points: []
            });
            setRoutes([...routes, newRoute]);
            setSelectedRoute(newRoute);
            setIsCreating(false);
            setNewRouteName('');
            setNewRouteDescription('');
        } catch (error) {
            console.error("Failed to create route", error);
        }
    };

    const handleMapClick = async (latlng) => {
        if (!selectedRoute) return;
        try {
            const pointData = {
                latitude: latlng.lat,
                longitude: latlng.lng,
                radius_km: newPointRadius
            };
            await routeService.addPoint(selectedRoute.id, pointData);
            // Reload routes to get the updated points
            loadRoutes();
            
            // Optimistically update the selected route in the UI so the circle shows instantly
            setSelectedRoute(prev => ({
                ...prev,
                points: [...(prev.points || []), pointData]
            }));

        } catch (error) {
            console.error("Failed to add point", error);
        }
    };

    // Default center (Bogota, Colombia based on the context of the JSON example in docs)
    const defaultCenter = [4.60971, -74.08175];
    let mapCenter = defaultCenter;
    if (selectedRoute && selectedRoute.points && selectedRoute.points.length > 0) {
        const firstPoint = selectedRoute.points[0];
        mapCenter = [firstPoint.latitude, firstPoint.longitude];
    }

    return (
        <div className="flex h-full min-h-[calc(100vh-8rem)] gap-6 p-6 bg-slate-50/50">
            {/* Sidebar for Routes */}
            <div className="w-1/3 flex flex-col gap-4 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <MapIcon className="w-6 h-6 text-violet-600" />
                            Spatial Routes
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage delivery geofences</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-violet-50 text-violet-600 p-3 rounded-2xl hover:bg-violet-100 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {isCreating && (
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col gap-3">
                        <input 
                            type="text" 
                            placeholder="Route Name (e.g. North Zone)" 
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all duration-300"
                            value={newRouteName}
                            onChange={(e) => setNewRouteName(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Description" 
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all duration-300"
                            value={newRouteDescription}
                            onChange={(e) => setNewRouteDescription(e.target.value)}
                        />
                        <button 
                            onClick={handleCreateRoute}
                            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white font-bold py-3 rounded-2xl hover:shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Save Route
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            <Activity className="w-6 h-6 animate-spin" />
                        </div>
                    ) : routes.length === 0 ? (
                        <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-500">
                            No routes configured yet. Create one to get started.
                        </div>
                    ) : (
                        routes.map(route => (
                            <div 
                                key={route.id}
                                onClick={() => setSelectedRoute(route)}
                                className={`p-4 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                    selectedRoute?.id === route.id 
                                        ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-200/50' 
                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className={`font-bold ${selectedRoute?.id === route.id ? 'text-violet-700' : 'text-slate-800'}`}>
                                            {route.name}
                                        </h3>
                                        {route.description && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{route.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className={`text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1 ${route.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                <CheckCircle2 className="w-3 h-3" />
                                                {route.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {route.points?.length || 0} Geofences
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 mt-1 ${selectedRoute?.id === route.id ? 'text-violet-500' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-white rounded-[2.5rem] p-4 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col relative overflow-hidden">
                <div className="absolute top-8 right-8 z-[400] bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-xs">
                    <h4 className="font-bold text-slate-800 mb-3">Map Controls</h4>
                    <label className="text-sm text-slate-500 font-medium mb-1 flex justify-between">
                        <span>New Geofence Radius</span>
                        <span className="text-violet-600 font-bold">{newPointRadius} km</span>
                    </label>
                    <input 
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={newPointRadius}
                        onChange={(e) => setNewPointRadius(Number(e.target.value))}
                        className="w-full accent-violet-600 mt-2"
                    />
                    
                    {selectedRoute ? (
                        <p className="text-xs text-blue-700 bg-blue-50 p-3 rounded-2xl mt-4 flex items-start gap-2 border border-blue-100">
                            <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                            Click anywhere on the map to add a geofence for <strong>{selectedRoute.name}</strong>.
                        </p>
                    ) : (
                        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl mt-4 border border-amber-100">
                            Select a route first to add geofences.
                        </p>
                    )}
                </div>

                <div className="w-full h-full rounded-[2rem] overflow-hidden border border-slate-100 relative z-0">
                    <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapEventHandler onMapClick={handleMapClick} />
                        
                        {/* Render all points for the selected route */}
                        {selectedRoute?.points?.map((point, index) => (
                            <Circle
                                key={point.id || index}
                                center={[point.latitude, point.longitude]}
                                radius={point.radius_km * 1000} // Leaflet takes radius in meters
                                pathOptions={{ 
                                    color: '#7c3aed', 
                                    fillColor: '#8b5cf6', 
                                    fillOpacity: 0.25,
                                    weight: 2
                                }}
                            />
                        ))}

                        {/* Render points of other routes subtly */}
                        {routes.filter(r => r.id !== selectedRoute?.id).map(route => 
                            route.points?.map((point, index) => (
                                <Circle
                                    key={`other-${route.id}-${point.id || index}`}
                                    center={[point.latitude, point.longitude]}
                                    radius={point.radius_km * 1000}
                                    pathOptions={{ 
                                        color: '#cbd5e1', 
                                        fillColor: '#f1f5f9', 
                                        fillOpacity: 0.2,
                                        weight: 1,
                                        dashArray: '5, 5'
                                    }}
                                />
                            ))
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
