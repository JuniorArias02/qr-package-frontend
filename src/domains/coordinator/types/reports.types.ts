export interface ReportMetrics {
    total_deliveries: number;
    delivered_count: number;
    pending_count: number;
    delivery_rate: number;
    avg_delivery_time: number;
    deliveries_with_observations: number;
}

export interface DeliveryReportItem {
    id: number;
    package_id: number;
    driver_id: number;
    coordinator_id: number;
    daily_batch_id: number;
    delivery_order: number;
    qr_url: string;
    status: 'assigned' | 'delivered';
    observation: string | null;
    assigned_at: string;
    delivered_at: string | null;
    created_at: string;
    updated_at: string;
    driver?: {
        id: number;
        user: {
            id: number;
            name: string;
        }
    };
    daily_batch?: {
        id: number;
        daily_code: string;
        date: string;
    };
    package?: {
        id: number;
        package_reference: string;
        description: string;
    };
}

export interface DriverPerformance {
    driver_name: string;
    total: number;
    delivered: number;
    pending: number;
    avg_time: number;
}

export interface ChartDataItem {
    date: string;
    total: number;
    delivered: number;
}

export interface ReportFilters {
    start_date?: string;
    end_date?: string;
    status?: string;
    driver_id?: number;
    daily_batch_id?: number;
    per_page?: number;
    page?: number;
}
