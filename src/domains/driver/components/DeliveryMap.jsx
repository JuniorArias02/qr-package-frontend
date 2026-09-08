import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, GeoJSON, useMap, Popup } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { useRouteGeometry } from '../hooks/useRouteGeometry'
import { MapPin, User, Package, AlertCircle, CheckCircle } from 'lucide-react'
import deliveryService from '../services/delivery.service'

// Map Controller for auto-centering
const MapBoundsController = ({ bounds }) => {
    const map = useMap()
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
        }
    }, [bounds, map])
    return null
}

const createCustomIcon = (delivery) => {
    const { status } = delivery
    const isDelivered = status === 'delivered' || status === 'Entregado'
    const isFailed = !!delivery.observation && !isDelivered
    const order = delivery.delivery_order || '-'

    let bgColor = 'bg-amber-500'
    let ringColor = 'ring-amber-200'
    if (isDelivered) {
        bgColor = 'bg-emerald-500'
        ringColor = 'ring-emerald-200'
    } else if (isFailed) {
        bgColor = 'bg-rose-500'
        ringColor = 'ring-rose-200'
    }

    const html = `
        <div class="w-10 h-10 ${bgColor} text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg ring-4 ${ringColor} transition-transform hover:scale-110">
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

// Subcomponente aislado para manejar el fetching al hacer click
const DeliveryMarker = ({ delivery }) => {
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasFetched, setHasFetched] = useState(false)

    const lat = delivery.package?.geocoded_address?.latitude;
    const lng = delivery.package?.geocoded_address?.longitude;

    if (!lat || !lng) return null;

    const handleFetchDetails = async () => {
        if (hasFetched || loading) return;
        setLoading(true)
        try {
            const data = await deliveryService.getPopupDetails(delivery.id)
            setDetails(data)
            setHasFetched(true)
        } catch (err) {
            console.error("Failed to fetch popup details", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Marker 
            position={[parseFloat(lat), parseFloat(lng)]}
            icon={createCustomIcon(delivery)}
            eventHandlers={{ click: handleFetchDetails }}
        >
            <Popup className="custom-popup" minWidth={220}>
                {loading ? (
                    <div className="p-4 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <div className="w-6 h-6 border-2 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
                        <span className="text-xs font-bold uppercase tracking-widest">Cargando...</span>
                    </div>
                ) : details ? (
                    <div className="font-sans">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-5 h-5 text-violet-600" />
                            <h3 className="font-black text-slate-900 text-lg m-0 leading-none">
                                {details.package_reference}
                            </h3>
                        </div>
                        
                        <div className="space-y-2 mt-3">
                            <p className="flex items-start gap-2 text-sm text-slate-600 m-0">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <span className="leading-tight">{details.address}</span>
                            </p>
                            
                            <p className="flex items-center gap-2 text-sm text-slate-600 m-0">
                                <User className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="font-medium">{details.driver_name}</span>
                            </p>

                            <div className="flex items-center gap-2 text-sm m-0 pt-2 border-t border-slate-100">
                                {details.status === 'delivered' || details.status === 'Entregado' ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="font-bold text-emerald-600">Entregado</span>
                                    </>
                                ) : details.observation ? (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span className="font-bold text-rose-600">Fallido</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-amber-500 ml-1"></div>
                                        <span className="font-bold text-amber-600 ml-1">Pendiente</span>
                                    </>
                                )}
                            </div>

                            {details.observation && (
                                <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-lg m-0 border border-rose-100">
                                    Motivo: {details.observation}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 text-center text-sm text-slate-500 font-medium">
                        Haz clic nuevamente para cargar detalles.
                    </div>
                )}
            </Popup>
        </Marker>
    )
}

export default function DeliveryMap({ deliveries }) {
    // Only pass pending deliveries to route geometry
    const pendingDeliveries = deliveries.filter(d => d.status === 'assigned')
    
    // Bounds based on pending deliveries
    const bounds = pendingDeliveries
        .filter(d => d.package?.geocoded_address?.latitude && d.package?.geocoded_address?.longitude)
        .map(d => [parseFloat(d.package.geocoded_address.latitude), parseFloat(d.package.geocoded_address.longitude)])
    
    // Fallback bounds (all deliveries)
    const allBounds = deliveries
        .filter(d => d.package?.geocoded_address?.latitude && d.package?.geocoded_address?.longitude)
        .map(d => [parseFloat(d.package.geocoded_address.latitude), parseFloat(d.package.geocoded_address.longitude)])

    const finalBounds = bounds.length > 0 ? bounds : allBounds

    // Hook para la ruta geométrica de Geoapify (solo de las pendientes o todas?)
    // Lo más útil es trazar todas para que se vea el recorrido completo, o solo pendientes. 
    // Usaremos todas las entregas ordenadas para que la ruta siempre muestre el trayecto completo de hoy.
    const { routeGeometry, routeLoading, routeError } = useRouteGeometry(deliveries)
    
    // UseRef to force re-render of GeoJSON when geometry changes
    const geoJsonRef = useRef()

    return (
        <div className="bg-white p-4 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden h-[600px] relative z-0">
            {routeLoading && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-2 rounded-full text-xs font-bold text-violet-600 shadow-lg z-[1000] flex items-center gap-2 border border-violet-100">
                    <div className="w-4 h-4 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin"></div>
                    Trazando ruta óptima...
                </div>
            )}
            
            <MapContainer 
                center={[4.6097, -74.0817]} // default fallback
                zoom={13} 
                style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY || 'd9513e5979fa4aadbf02ec4716f5b0a1'}`}
                />
                {finalBounds.length > 0 && <MapBoundsController bounds={finalBounds} />}
                
                {/* Render route real con GeoJSON */}
                {routeGeometry && (
                    <GeoJSON 
                        key={JSON.stringify(routeGeometry)} // Fuerza re-renderizado seguro
                        data={routeGeometry} 
                        style={{
                            color: "#8b5cf6",
                            weight: 6,
                            opacity: 0.7
                        }} 
                    />
                )}

                {/* Render markers utilizando el nuevo subcomponente */}
                {deliveries.map(delivery => (
                    <DeliveryMarker key={delivery.id} delivery={delivery} />
                ))}
            </MapContainer>
        </div>
    )
}
