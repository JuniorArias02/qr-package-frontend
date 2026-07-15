import api from '../../../core/api/axios'

interface CompanyData {
    name: string
    tax_id?: string
    address?: string
    phone?: string
    active?: boolean
}

class CompanyService {
    async getAll(): Promise<any[]> {
        const res = await api.get('/v1/super-admin/companies')
        return res.data.objeto
    }

    async getById(id: number | string): Promise<any> {
        const res = await api.get(`/v1/super-admin/companies/${id}`)
        return res.data.objeto
    }

    async create(data: CompanyData): Promise<any> {
        const res = await api.post('/v1/super-admin/companies', data)
        return res.data.objeto
    }

    async update(id: number | string, data: Partial<CompanyData>): Promise<any> {
        const res = await api.post(`/v1/super-admin/companies/${id}`, data)
        return res.data.objeto
    }

    async toggleActive(id: number | string): Promise<any> {
        const res = await api.post(`/v1/super-admin/companies/${id}/toggle`)
        return res.data.objeto
    }
}

export default new CompanyService()
