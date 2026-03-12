import { User } from '../../../admin/coordinators/types/coordinator.types'

export interface Driver {
    id: number;
    user_id: number;
    coordinator_id: number;
    active: boolean;
    user: User;
    created_at: string;
    updated_at: string;
}

export interface DriverFormData {
    name: string;
    email: string;
    password?: string;
    active: boolean;
}
