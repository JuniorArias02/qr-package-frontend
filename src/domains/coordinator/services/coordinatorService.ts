import api from '../../../core/api/axios'

class CoordinatorService {
    async getDrivers(): Promise<any> {
        const response = await api.get('/v1/coordinator/drivers')
        return response.data
    }

    async createDriver(data: any): Promise<any> {
        const response = await api.post('/v1/coordinator/drivers', data)
        return response.data
    }

    async deleteDriver(id: number): Promise<any> {
        const response = await api.delete(`/v1/coordinator/drivers/${id}`)
        return response.data
    }

    async getStats(): Promise<any> {
        const response = await api.get('/v1/coordinator/stats')
        return response.data
    }

    async scanPackage(data: any): Promise<any> {
        const response = await api.post('/v1/delivery/scan', data)
        return response.data
    }

    async assignPackage(data: any): Promise<any> {
        const response = await api.post('/v1/delivery/assign', data)
        return response.data
    }
}

export default new CoordinatorService()
