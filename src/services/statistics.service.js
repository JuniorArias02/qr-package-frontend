import api from '../api/axios'

const StatisticsService = {
    getDashboardStats: async () => {
        const response = await api.get('/statistics')
        return response.data
    }
}

export default StatisticsService
