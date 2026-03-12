import api from '../api/axios'

const reportService = {
    getDashboardStats: async () => {
        const response = await api.get('/statistics')
        return response.data
    }
}

export default reportService
