import api from '../../../core/api/axios'
import { ScanResponse, Delivery } from '../types/delivery.types'

class DeliveryService {
    /**
     * Identifies a package by its reference and handles automatic assignment if enabled.
     * Optionally takes a driverId for manual/frontend assignment selection.
     */
    async scanPackage(packageReference: string, driverId?: number): Promise<ScanResponse> {
        const payload: any = { package_reference: packageReference }
        if (driverId) {
            payload.driver_id = driverId
        }
        
        const response = await api.post('/v1/delivery/scan', payload)
        return response.data
    }

    /**
     * Registers a new package and assigns it
     */
    async registerPackage(data: any): Promise<ScanResponse> {
        const response = await api.post('/v1/delivery/register-package', data)
        return response.data
    }

    /**
     * Manually assigns a package to a driver
     */
    async assignPackage(packageId: number, driverId: number): Promise<Delivery> {
        const response = await api.post('/v1/delivery/assign', {
            package_id: packageId,
            driver_id: driverId
        })
        return response.data.objeto
    }
}

export default new DeliveryService()
