export enum UserRole {
    ADMIN = 'admin',
    COORDINATOR = 'coordinator',
    DRIVER = 'driver',
    REPORTER = 'reporter'
}

export enum UserPermission {
    SCAN_PACKAGES = 'scan_packages',
    CREATE_PACKAGES = 'create_packages',
    VIEW_PACKAGES = 'view_packages',
    VIEW_ALL_PACKAGES = 'view_all_packages',
    ASSIGN_PACKAGES = 'assign_packages',
    DEFINE_PACKAGE_TYPE = 'define_package_type',
    ASSIGN_ROUTES = 'assign_routes',
    UPDATE_DELIVERY_STATUS = 'update_delivery_status',
    VIEW_DELIVERIES = 'view_deliveries',
    VIEW_REPORTS = 'view_reports',
    VIEW_ALL_REPORTS = 'view_all_reports',
    MANAGE_USERS = 'manage_users',
    VIEW_COORDINATORS = 'view_coordinators'
}

export interface User {
    id: number
    name: string
    email: string
    role: UserRole
    codigo_personal?: string
    permissions: UserPermission[]
    created_at: string
    updated_at: string
}

export interface AuthResponse {
    message: string
    access_token: string
    token_type: string
    user: User
}
