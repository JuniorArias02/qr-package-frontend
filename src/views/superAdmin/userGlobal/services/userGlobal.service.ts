import api from '../../../../api/axios'

class UserGlobalService {
    async getAll(filters = {}) {
        const res = await api.get('/v1/super-admin/users', { params: filters })
        return res.data.objeto
    }

    async create(data: any) {
        const res = await api.post('/v1/super-admin/users', data)
        return res.data.objeto
    }

    async toggleActive(id: number | string) {
        const res = await api.post(`/v1/super-admin/users/${id}/toggle`)
        return res.data.objeto
    }
}

export default new UserGlobalService()
