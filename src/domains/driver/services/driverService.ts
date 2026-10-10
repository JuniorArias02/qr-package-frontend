import api from '../../../core/api/axios'

class DriverService {
    async getAssignedPackages(): Promise<any> {
        // This likely uses a general packages endpoint or a driver specific one
        const response = await api.get('/v1/delivery/assigned')
        return response.data
    }

    async markAsDelivered(id: number, data: any): Promise<any> {
        const response = await api.post(`/v1/delivery/${id}/delivered`, data)
        return response.data
    }

    async getHistory(): Promise<any> {
        const response = await api.get('/v1/delivery/history')
        return response.data
    }

    async getDashboardAnalytics(): Promise<any> {
        const response = await api.get('/v1/driver/analytics/dashboard')
        return response.data
    }

    async finishRoute(): Promise<any> {
        const response = await api.post('/v1/driver/finish-route')
        return response.data
    }

    async reorderDeliveries(deliveryIds: number[]): Promise<any> {
        const response = await api.post('/v1/driver/deliveries/reorder', { delivery_ids: deliveryIds })
        return response.data
    }

    async optimizeDeliveries(): Promise<any> {
        const response = await api.post('/v1/driver/deliveries/optimize')
        return response.data
    }
}

export default new DriverService()
