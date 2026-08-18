import api from '../../../core/api/axios';
import { Route, CreateRouteDTO, AddPointDTO } from '../types/route.types';

class RouteService {
    /**
     * Get all spatial routes along with their geofence points
     */
    async getAll(): Promise<Route[]> {
        const response = await api.get('/v1/routes');
        return response.data.data;
    }

    /**
     * Create a new spatial route
     */
    async create(data: CreateRouteDTO): Promise<Route> {
        const response = await api.post('/v1/routes', data);
        return response.data.data || response.data;
    }

    /**
     * Add a geographic point to an existing route
     */
    async addPoint(routeId: number, data: AddPointDTO): Promise<any> {
        const response = await api.post(`/v1/routes/${routeId}/points`, data);
        return response.data;
    }
}

export default new RouteService();
