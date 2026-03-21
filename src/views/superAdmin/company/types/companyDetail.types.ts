export interface CompanyDetailUser {
    id: number;
    company_id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'company_admin' | 'coordinator' | 'driver';
    active: boolean;
    profile_image: string | null;
    created_at: string;
    updated_at: string;
    driver?: {
        id: number;
        user_id: number;
        coordinator_id: number | null;
        company_id: number;
        active: boolean;
        delivered_packages_count: number;
    };
}

export interface CompanyDetailGroup {
    company_admin: CompanyDetailUser[];
    coordinator: CompanyDetailUser[];
    driver: CompanyDetailUser[];
}

export interface CompanyDetailStats {
    id: number;
    name: string;
    tax_id: string | null;
    address: string | null;
    phone: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
    users_count: number;
    coordinators_count: number;
    drivers_count: number;
    deliveries_count: number;
}

export interface CompanyDetailResponse {
    company: CompanyDetailStats;
    users: CompanyDetailGroup;
}
