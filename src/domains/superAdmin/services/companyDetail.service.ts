import api from '../../../core/api/axios'
import { CompanyDetailResponse } from '../types/companyDetail.types'

class CompanyDetailService {
    /**
     * Obtiene el detalle general de la empresa con sus KPIs y usuarios por rol.
     */
    async getCompanyDetails(id: string | number): Promise<CompanyDetailResponse> {
        try {
            const response = await api.get(`/v1/super-admin/companies/${id}/details`)
            return response.data.objeto
        } catch (error) {
            console.error('Error fetching company details:', error)
            throw error
        }
    }

    /**
     * Alterna el estado activo/inactivo de un usuario específico.
     * Usamos el endpoint global de Super Admin.
     */
    async toggleUserStatus(userId: string | number): Promise<void> {
        try {
            await api.post(`/v1/super-admin/users/${userId}/toggle`)
        } catch (error) {
            console.error('Error toggling user status:', error)
            throw error
        }
    }
}

export default new CompanyDetailService()
