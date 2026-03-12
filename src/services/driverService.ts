import api from '../api/axios'

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
}

export default new DriverService()
