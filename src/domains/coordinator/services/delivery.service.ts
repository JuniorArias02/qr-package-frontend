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
     * Registers a new package and assigns it automatically or manually if driver_id is provided
     */
    async registerPackage(data: { package_reference: string; address: string; driver_id?: number | null }): Promise<ScanResponse> {
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

    /**
     * Fetches all unassigned pending deliveries
     */
    async getPendingDeliveries(): Promise<Delivery[]> {
        const response = await api.get('/v1/delivery/pending')
        return response.data.objeto || []
    }
    /**
     * Manually assigns multiple packages to a driver
     */
    async manualAssign(data: { driver_id: number; package_ids: number[] }): Promise<any> {
        const response = await api.post('/v1/delivery/manual-assign', data)
        return response.data
    }

    /**
     * Requeues a failed package to pending_assignment
     */
    async requeuePackage(id: number): Promise<any> {
        const response = await api.post(`/v1/delivery/${id}/requeue`)
        return response.data
    }

    async getFailedDeliveries(): Promise<Delivery[]> {
        try {
            // First try a dedicated endpoint if it exists
            const response = await api.get('/v1/delivery/failed');
            const data = response.data.objeto?.data || response.data.objeto || response.data || [];
            return Array.isArray(data) ? data : [];
        } catch (e) {
            // Fallback to getting all deliveries via reports
            const response = await api.get('/v1/coordinator/reports/deliveries');
            const data = response.data.objeto?.data || response.data.objeto || response.data || [];
            const all = Array.isArray(data) ? data : [];
            return all.filter((d: Delivery) => d.status === 'failed' || (d as any).observation);
        }
    }

    /**
     * Gets all active routes distributed by TSP
     */
    async getActiveRoutes(): Promise<any> {
        const response = await api.get('/v1/delivery/active-routes')
        return response.data.objeto || response.data || []
    }

    /**
     * Gets undelivered packages locations (geocoded and non-geocoded)
     */
    async getUndeliveredLocations(): Promise<any> {
        const response = await api.get('/v1/delivery/undelivered-locations')
        // Return 'data' array directly as per DTO structure
        return response.data.data || response.data.objeto || []
    }
}

export default new DeliveryService()
