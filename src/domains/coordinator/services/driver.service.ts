import api from '../../../core/api/axios'
import { Driver, DriverFormData } from '../types/driver.types'

class DriverService {
    async getAll(): Promise<Driver[]> {
        const response = await api.get('/v1/coordinator/drivers')
        return response.data.objeto
    }

    async getById(id: string | number): Promise<Driver> {
        const response = await api.get(`/v1/coordinator/drivers/${id}`)
        return response.data.objeto
    }

    async create(data: DriverFormData): Promise<Driver> {
        const response = await api.post('/v1/coordinator/drivers', data)
        return response.data.objeto
    }

    async update(id: string | number, data: DriverFormData): Promise<Driver> {
        const response = await api.post(`/v1/coordinator/drivers/${id}`, data)
        return response.data.objeto
    }

    async delete(id: string | number): Promise<void> {
        await api.delete(`/v1/coordinator/drivers/${id}`)
    }
}

export default new DriverService()
