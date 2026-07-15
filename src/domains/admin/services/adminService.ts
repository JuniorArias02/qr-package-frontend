import api from '../../../core/api/axios'
import { User } from '../../../core/types/auth.types'

class AdminService {
    async getCoordinators(): Promise<any> {
        const response = await api.get('/v1/admin/coordinators')
        return response.data
    }

    async createCoordinator(data: any): Promise<any> {
        const response = await api.post('/v1/admin/coordinators', data)
        return response.data
    }

    async getStats(): Promise<any> {
        const response = await api.get('/v1/admin/stats')
        return response.data
    }
}

export default new AdminService()
