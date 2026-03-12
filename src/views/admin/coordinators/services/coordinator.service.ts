import api from '../../../../api/axios'
import { Coordinator, CoordinatorFormData } from '../types/coordinator.types'

class CoordinatorService {
    async getAll(): Promise<Coordinator[]> {
        const response = await api.get('/v1/admin/coordinators')
        return response.data.objeto
    }

    async getById(id: string | number): Promise<Coordinator> {
        const response = await api.get(`/v1/admin/coordinators/${id}`)
        return response.data.objeto
    }

    async create(data: CoordinatorFormData): Promise<Coordinator> {
        const response = await api.post('/v1/admin/coordinators', data)
        return response.data.objeto
    }

    async update(id: string | number, data: CoordinatorFormData): Promise<Coordinator> {
        const response = await api.post(`/v1/admin/coordinators/${id}`, data)
        return response.data.objeto
    }
}

export default new CoordinatorService()
