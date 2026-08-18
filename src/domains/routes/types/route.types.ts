export interface RoutePoint {
    id?: number;
    latitude: number;
    longitude: number;
    radius_km: number;
}

export interface Route {
    id: number;
    name: string;
    description?: string;
    active: boolean;
    points: RoutePoint[];
}

export interface CreateRouteDTO {
    name: string;
    description?: string;
    active: boolean;
    points?: RoutePoint[];
}

export interface AddPointDTO {
    latitude: number;
    longitude: number;
    radius_km: number;
}
