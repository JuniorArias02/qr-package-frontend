import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { divIcon } from 'leaflet'
import deliveryService from '../services/delivery.service'
import { Map as MapIcon, Route, Truck, RefreshCw, AlertCircle, Package } from 'lucide-react'
import L from 'leaflet'

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ROUTE_COLORS = [
    { main: '#8b5cf6', twBg: 'bg-violet-500', twRing: 'ring-violet-200' },
    { main: '#3b82f6', twBg: 'bg-blue-500', twRing: 'ring-blue-200' },
    { main: '#10b981', twBg: 'bg-emerald-500', twRing: 'ring-emerald-200' },
    { main: '#f59e0b', twBg: 'bg-amber-500', twRing: 'ring-amber-200' },
    { main: '#ec4899', twBg: 'bg-pink-500', twRing: 'ring-pink-200' },
    { main: '#ef4444', twBg: 'bg-red-500', twRing: 'ring-red-200' },
    { main: '#06b6d4', twBg: 'bg-cyan-500', twRing: 'ring-cyan-200' },
    { main: '#84cc16', twBg: 'bg-lime-500', twRing: 'ring-lime-200' },
];

const MapBoundsController = ({ bounds }) => {
    const map = useMap()
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
        }
    }, [bounds, map])
    return null
}

const createCustomIcon = (point, colorObj) => {
    const order = point.delivery_order || '-'
    const html = `
        <div class="w-10 h-10 ${colorObj.twBg} text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg ring-4 ${colorObj.twRing} transition-transform hover:scale-110">
            ${order}
        </div>
    `
    return divIcon({
        html,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    })
}

const DriverRoutePath = ({ routeData, colorObj }) => {
    const [routeGeometry, setRouteGeometry] = useState(null)
    const sortedRoute = [...routeData.route].sort((a, b) => a.delivery_order - b.delivery_order)

    useEffect(() => {
        const fetchRoute = async () => {
            const waypoints = sortedRoute
                .map(p => `${p.latitude},${p.longitude}`)
                .join('|')

            if (sortedRoute.length < 2 || !waypoints.includes('|')) return;

            try {
                const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY || 'd9513e5979fa4aadbf02ec4716f5b0a1'
                const response = await fetch(
                    `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${apiKey}`
                )
                if (response.ok) {
                    const data = await response.json()
                    setRouteGeometry(data)
                }
            } catch (err) {
                console.error('Error fetching route from Geoapify:', err)
            }
        }
        fetchRoute()
    }, [routeData])

    return (
        <React.Fragment>
            {routeGeometry && (
                <GeoJSON 
                    key={JSON.stringify(routeGeometry)} 
                    data={routeGeometry} 
                    style={{
                        color: colorObj.main,
                        weight: 6,
                        opacity: 0.7
                    }} 
                />
            )}
            {sortedRoute.map(point => (
                <Marker 
                    key={point.delivery_id} 
                    position={[point.latitude, point.longitude]}
                    icon={createCustomIcon(point, colorObj)}
                >
                    <Popup className="custom-popup" minWidth={200}>
                        <div className="font-sans">
                            <div className="flex items-center gap-2 mb-1">
                                <Package className="w-5 h-5 text-slate-700" />
                                <h3 className="font-black text-slate-900 text-lg m-0 leading-none">
                                    {point.package_reference}
                                </h3>
                            </div>
                            <div className="space-y-1 mt-3 border-t border-slate-100 pt-2">
                                <p className="text-sm text-slate-600 m-0 font-medium">Conductor: {routeData.driver?.name}</p>
                                <p className="text-sm text-slate-600 m-0 font-medium">Orden de entrega: {point.delivery_order}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </React.Fragment>
    )
}

export default function LiveRoutesMap() {
    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchRoutes()
    }, [])

    const fetchRoutes = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await deliveryService.getActiveRoutes()
            setRoutes(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Failed to load active routes', err)
            setError('Error loading live routes.')
        } finally {
            setLoading(false)
        }
    }

    let allBounds = []
    routes.forEach(r => {
        if (r.route) {
            r.route.forEach(p => {
                if (p.latitude && p.longitude) {
                    allBounds.push([p.latitude, p.longitude])
                }
            })
        }
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold uppercase tracking-widest text-sm">Cargando Rutas TSP...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 pb-24 h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <MapIcon className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
                        Live Routes Map
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Visualización en tiempo real de las rutas optimizadas por el motor TSP.
                    </p>
                </div>
                <button
                    onClick={fetchRoutes}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors font-bold text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 flex items-center gap-3 shadow-sm shrink-0">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex-1 flex flex-col md:flex-row relative z-0">
                
                {/* Lista de Conductores / Leyenda */}
                <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-4 overflow-y-auto z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2">
                        <Route className="w-5 h-5 text-indigo-500" />
                        Rutas Asignadas
                    </h2>
                    
                    {routes.length === 0 ? (
                        <p className="text-sm text-slate-500 font-medium">No hay rutas activas en este momento.</p>
                    ) : (
                        routes.map((r, idx) => {
                            const colorObj = ROUTE_COLORS[idx % ROUTE_COLORS.length]
                            return (
                                <div key={r.driver?.id || idx} className="bg-white p-4 rounded-2xl border-2 border-transparent shadow-sm flex flex-col gap-2" style={{ borderColor: colorObj.main + '30' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colorObj.main + '20', color: colorObj.main }}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-tight">{r.driver?.name || 'Desconocido'}</p>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                                {r.route?.length || 0} Paradas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Mapa */}
                <div className="flex-1 bg-slate-200 relative min-h-[400px]">
                    <MapContainer 
                        center={[4.6097, -74.0817]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%', zIndex: 10 }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY || 'd9513e5979fa4aadbf02ec4716f5b0a1'}`}
                        />
                        {allBounds.length > 0 && <MapBoundsController bounds={allBounds} />}
                        
                        {routes.map((r, idx) => {
                            if (!r.route || r.route.length === 0) return null;
                            const colorObj = ROUTE_COLORS[idx % ROUTE_COLORS.length]
                            return <DriverRoutePath key={r.driver?.id || idx} routeData={r} colorObj={colorObj} />
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
