import api from '../api/axios'

const PackageService = {
    getAll: async () => {
        const response = await api.get('/packages')
        return response.data
    },

    create: async (data) => {
        const response = await api.post('/packages', data)
        return response.data
    },

    // Check if package exists by QR
    checkQR: async (referencia_qr) => {
        const response = await api.post('/packages/check-qr', { referencia_qr })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/packages/${id}`)
        return response.data
    }
}

export default PackageService
