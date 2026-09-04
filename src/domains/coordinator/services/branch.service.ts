import api from '../../../core/api/axios'

class BranchService {
    async getBranches(): Promise<any> {
        const response = await api.get('/v1/branches')
        return response.data
    }

    async getBranch(id: number): Promise<any> {
        const response = await api.get(`/v1/branches/${id}`)
        return response.data
    }

    async createBranch(data: { name: string; address: string; latitude?: number; longitude?: number }): Promise<any> {
        const response = await api.post('/v1/branches', data)
        return response.data
    }

    async updateBranch(id: number, data: { name: string; address: string; latitude?: number; longitude?: number }): Promise<any> {
        // As specified by the user, edit is POST /api/v1/branches/{id}
        const response = await api.post(`/v1/branches/${id}`, data)
        return response.data
    }

    async deleteBranch(id: number): Promise<any> {
        const response = await api.delete(`/v1/branches/${id}`)
        return response.data
    }

    async geocodeAddress(address: string): Promise<any> {
        const response = await api.post('/v1/geocode', { address })
        return response.data
    }
}

export default new BranchService()
