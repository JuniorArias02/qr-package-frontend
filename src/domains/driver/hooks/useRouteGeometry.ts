import { useState, useEffect } from 'react'
import { Package } from '../../../core/types/package.types'

export const useRouteGeometry = (deliveries: Package[]) => {
    const [routeGeometry, setRouteGeometry] = useState<any>(null)
    const [routeLoading, setRouteLoading] = useState(false)
    const [routeError, setRouteError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRoute = async () => {
            const waypoints = deliveries
                .filter(d => d.package?.geocoded_address?.latitude && d.package?.geocoded_address?.longitude)
                .map(d => `${d.package.geocoded_address.latitude},${d.package.geocoded_address.longitude}`)
                .join('|')

            // We need at least 2 points to draw a route
            if (deliveries.length < 2 || !waypoints.includes('|')) {
                setRouteGeometry(null)
                return
            }

            setRouteLoading(true)
            setRouteError(null)

            try {
                const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY
                if (!apiKey) throw new Error('API Key para mapas no configurada')

                const response = await fetch(
                    `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${apiKey}`
                )

                if (!response.ok) {
                    throw new Error('Error al consultar ruta en Geoapify')
                }

                const data = await response.json()
                // La API retorna una FeatureCollection. Podemos usarla completa o extraer la geometría.
                setRouteGeometry(data) 
            } catch (err: any) {
                console.error('Error fetching route:', err)
                setRouteError(err.message)
                setRouteGeometry(null)
            } finally {
                setRouteLoading(false)
            }
        }

        fetchRoute()
    }, [deliveries]) // Depend directly on the array (ensure it changes reference properly or compare length/ids if needed)

    return { routeGeometry, routeLoading, routeError }
}
