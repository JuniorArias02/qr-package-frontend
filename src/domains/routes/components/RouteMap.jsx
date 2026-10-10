import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function RouteMap({ routes = [], onPolygonDrawn, selectedRouteId, selectedBranch }) {
    const mapRef = useRef(null);
    const featureGroupRef = useRef(null);
    const drawControlRef = useRef(null);
    const selectedPolygonRef = useRef(null);
    
    const [featureGroupReady, setFeatureGroupReady] = React.useState(false);

    const onPolygonDrawnRef = useRef(onPolygonDrawn);

    useEffect(() => {
        onPolygonDrawnRef.current = onPolygonDrawn;
    }, [onPolygonDrawn]);

    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (!selectedRouteId) {
                        map.setView([latitude, longitude], 13);
                    }
                },
                (error) => {
                    console.warn("Could not get user location:", error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current || !featureGroupRef.current || !featureGroupReady) return;
        const map = mapRef.current;
        const featureGroup = featureGroupRef.current;

        if (drawControlRef.current) {
            map.removeControl(drawControlRef.current);
        }

        const drawControl = new L.Control.Draw({
            draw: {
                polygon: {
                    allowIntersection: true,
                    showArea: true,
                    shapeOptions: {
                        color: '#7c3aed',
                        weight: 3
                    }
                },
                polyline: false,
                circle: false,
                rectangle: false,
                marker: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: featureGroup,
                remove: true
            }
        });

        map.addControl(drawControl);
        drawControlRef.current = drawControl;

        const onDrawCreated = (e) => {
            const layer = e.layer;
            
            // Clear existing drawn layers before adding new one
            featureGroup.clearLayers();
            
            featureGroup.addLayer(layer);
            const latlngs = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
            // Close the polygon by adding the first point to the end if not already
            if (latlngs.length > 0) {
                const first = latlngs[0];
                const last = latlngs[latlngs.length - 1];
                if (first[0] !== last[0] || first[1] !== last[1]) {
                    latlngs.push(first);
                }
            }
            if (onPolygonDrawnRef.current) {
                onPolygonDrawnRef.current(latlngs);
            }
        };
        
        const onDrawDeleted = () => {
             if (onPolygonDrawnRef.current) {
                 onPolygonDrawnRef.current([]);
             }
        };

        map.on(L.Draw.Event.CREATED, onDrawCreated);
        map.on(L.Draw.Event.DELETED, onDrawDeleted);

        return () => {
            map.off(L.Draw.Event.CREATED, onDrawCreated);
            map.off(L.Draw.Event.DELETED, onDrawDeleted);
            if (drawControlRef.current) {
                map.removeControl(drawControlRef.current);
            }
        };
    }, [featureGroupReady]);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        
        // Fit bounds to selected route
        if (selectedRouteId && routes.length > 0) {
            const route = routes.find(r => r.id === selectedRouteId);
            if (route && route.polygon_coordinates && route.polygon_coordinates.length > 0) {
                 const bounds = L.polygon(route.polygon_coordinates).getBounds();
                 map.fitBounds(bounds);
            }
        }
    }, [selectedRouteId, routes]);

    useEffect(() => {
        if (!mapRef.current || !selectedBranch) return;
        
        if (selectedBranch.latitude && selectedBranch.longitude) {
            mapRef.current.flyTo(
                [parseFloat(selectedBranch.latitude), parseFloat(selectedBranch.longitude)], 
                14, 
                {
                    animate: true,
                    duration: 1.5
                }
            );
        }
    }, [selectedBranch]);

    return (
        <div className="w-full h-[700px] rounded-[2rem] overflow-hidden border-2 border-slate-200 relative z-0">
            <MapContainer
                center={[4.6097, -74.0817]} // Default Bogota
                zoom={11}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                ref={mapRef}
            >
                <TileLayer
                    url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
                    attribution='Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenStreetMap'
                    maxZoom={20}
                />
                
                <FeatureGroup ref={(ref) => {
                    if (ref && !featureGroupReady) {
                        featureGroupRef.current = ref;
                        setFeatureGroupReady(true);
                    }
                }}></FeatureGroup>

                {routes.map(route => {
                    const isSelected = selectedRouteId === route.id;
                    if (!route.polygon_coordinates || route.polygon_coordinates.length === 0) return null;
                    
                    return (
                        <Polygon 
                            key={`route-${route.id}`}
                            positions={route.polygon_coordinates}
                            pathOptions={{ 
                                color: isSelected ? '#ef4444' : '#6366f1',
                                fillColor: isSelected ? '#ef4444' : '#6366f1',
                                fillOpacity: isSelected ? 0.4 : 0.2,
                                weight: isSelected ? 4 : 2
                            }}
                        >
                            <Popup>
                                <div className="text-center">
                                    <h4 className="font-bold text-slate-900">{route.name}</h4>
                                    <p className="text-xs text-slate-500">{route.description}</p>
                                </div>
                            </Popup>
                        </Polygon>
                    )
                })}
            </MapContainer>
        </div>
    );
}
