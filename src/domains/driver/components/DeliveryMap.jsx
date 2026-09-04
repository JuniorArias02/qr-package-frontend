import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { useRouteGeometry } from '../hooks/useRouteGeometry'

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

                {/* Render markers */}
                {deliveries.map(delivery => {
                    const lat = delivery.package?.geocoded_address?.latitude;
                    const lng = delivery.package?.geocoded_address?.longitude;
                    if (!lat || !lng) return null;

                    return (
                        <Marker 
                            key={delivery.id} 
                            position={[parseFloat(lat), parseFloat(lng)]}
                            icon={createCustomIcon(delivery)}
                        />
                    )
                })}
            </MapContainer>
        </div>
    )
}
