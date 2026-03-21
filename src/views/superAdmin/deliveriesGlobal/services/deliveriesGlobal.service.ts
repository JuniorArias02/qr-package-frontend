import api from '../../../../api/axios'

class DeliveriesGlobalService {
    async getAll(filters = {}) {
        const res = await api.get('/v1/super-admin/deliveries', { params: filters })
        return res.data.objeto
    }
}

export default new DeliveriesGlobalService()
