import api from '../../../../api/axios'

class SuperAdminDashboardService {
    // Dashboard Stats
    async getStats() {
        const res = await api.get('/v1/super-admin/dashboard')
        return res.data.objeto
    }
}

export default new SuperAdminDashboardService()
