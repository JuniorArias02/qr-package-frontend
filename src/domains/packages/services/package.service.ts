import api from '../../../core/api/axios'
import {
    Package,
    CreatePackageDTO,
    CheckQRResponse
} from '../../../core/types/package.types'

const packageService = {
    getAll: async (): Promise<Package[]> => {
        const response = await api.get<{ data: Package[] }>('/packages')
        return response.data.data
    },

    create: async (data: CreatePackageDTO): Promise<Package> => {
        const response = await api.post<{ data: Package }>('/packages', data)
        return response.data.data
    },

    checkQR: async (referencia_qr: string): Promise<CheckQRResponse> => {
        const response = await api.post<CheckQRResponse>('/packages/check-qr', {
            referencia_qr
        })
        return response.data
    },

    getById: async (id: number): Promise<Package> => {
        const response = await api.get<{ data: Package }>(`/packages/${id}`)
        return response.data.data
    }
}

export default packageService
