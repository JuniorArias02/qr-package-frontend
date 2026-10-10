import api from '../../../core/api/axios'

class RouteService {
    async getRoutes(): Promise<any> {
        const response = await api.get('/v1/routes')
        return response.data
    }

    async createRoute(data: any): Promise<any> {
        const response = await api.post('/v1/routes', data)
        return response.data
    }

    async updateRoute(id: number, data: any): Promise<any> {
        const response = await api.put(`/v1/routes/${id}`, data)
        return response.data
    }

    async deleteRoute(id: number): Promise<any> {
        const response = await api.delete(`/v1/routes/${id}`)
        return response.data
    }

    async assignDrivers(routeId: number, driverIds: number[]): Promise<any> {
        const response = await api.post(`/v1/routes/${routeId}/assign-drivers`, { driver_ids: driverIds })
        return response.data
    }

    // Optional: fetching drivers to show in the transfer list
    async getDrivers(): Promise<any> {
        // We will assume there's an endpoint to get drivers or users with driver role
        const response = await api.get('/v1/coordinator/drivers') // Assuming this endpoint based on context
        return response.data
    }
}

export default new RouteService()
