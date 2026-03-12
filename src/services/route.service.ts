import api from './api/axios'
import { Route } from '../types/route.types'

const routeService = {
    getAll: async (): Promise<Route[]> => {
        const response = await api.get<Route[]>('/routes')
        return response.data
    },

    getById: async (id: number): Promise<Route> => {
        const response = await api.get<Route>(`/routes/${id}`)
        return response.data
    }
}

export default routeService
