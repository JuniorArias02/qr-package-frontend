export enum UserRole {
    ADMIN = 'admin',
    COORDINATOR = 'coordinator',
    DRIVER = 'driver'
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Coordinator {
    id: number;
    user_id: number;
    user: User;
    created_at: string;
    updated_at: string;
}

export interface CoordinatorFormData {
    name: string;
    email: string;
    password?: string;
    active: boolean;
}
