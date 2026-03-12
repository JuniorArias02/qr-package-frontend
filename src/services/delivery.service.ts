import api from './api/axios'
import { DeliveryStats } from '../types/delivery.types'
import { Package } from '../types/package.types'

interface MyDeliveriesResponse {
    stats: DeliveryStats
    deliveries: any[]
}

const deliveryService = {
    updateStatus: async (data: any): Promise<any> => {
        const response = await api.post(`/v1/delivery/${data.package_id || data.delivery_id}/status`, {
            status: data.estado,
            observation: data.observacion
        })
        return response.data
    },

    getMyDeliveries: async (): Promise<MyDeliveriesResponse> => {
        const response = await api.get<MyDeliveriesResponse>('/v1/delivery/my-deliveries')
        return response.data
    },

    getDeliveryInfo: async (packageReference: string, deliveryId: number): Promise<any> => {
        const response = await api.get(`/v1/delivery/info/${packageReference}/${deliveryId}`)
        return response.data
    }
}

export default deliveryService
