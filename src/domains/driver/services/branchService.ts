import api from '../../../core/api/axios'

class BranchService {
    async getBranches(): Promise<any> {
        const response = await api.get('/v1/branches')
        return response.data
    }

    async updateDriverBranch(branch_id: number): Promise<any> {
        const response = await api.put('/v1/driver/profile/branch', { branch_id })
        return response.data
    }
}

export default new BranchService()
