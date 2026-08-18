export interface Package {
    id: number;
    package_reference: string;
    address: string | { full_address: string, latitude: number, longitude: number };
    zone: string;
    status: 'pending' | 'assigned' | 'delivered';
    created_at?: string;
}

export interface Driver {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        profile_image?: string;
    };
    coordinator_id: number;
    active: boolean;
}

export interface Delivery {
    id: number;
    package_id: number;
    driver_id: number | null;
    route_id?: number | null;
    coordinator_id: number;
    daily_batch_id: number;
    delivery_order: number;
    qr_url: string;
    status: 'pending_assignment' | 'assigned' | 'delivered';
    observation?: string;
    assigned_at: string | null;
    delivered_at?: string;
    package?: Package;
    driver?: Driver;
    route?: {
        id: number;
        name: string;
        active: boolean;
    };
}

export interface ScanResponse {
    status: 'success' | 'error';
    mensaje: string;
    objeto: {
        package?: Package;
        delivery?: Delivery;
        assignment_mode: 'automatic' | 'manual' | 'assign_to';
        available_drivers?: Driver[];
        label_image?: string;
        day_identifier?: string;
        order_number?: number;
    };
}
