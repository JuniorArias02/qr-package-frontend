import api from '../../../../api/axios';
import { 
    ReportMetrics, 
    DeliveryReportItem, 
    DriverPerformance, 
    ChartDataItem, 
    ReportFilters 
} from '../types/reports.types';

class ReportService {
    async getMetrics(filters: ReportFilters = {}): Promise<ReportMetrics> {
        const response = await api.get('/v1/coordinator/reports/metrics', { params: filters });
        return response.data.objeto;
    }

    async getDeliveries(filters: ReportFilters = {}): Promise<{ data: DeliveryReportItem[], current_page: number, last_page: number, total: number }> {
        const response = await api.get('/v1/coordinator/reports/deliveries', { params: filters });
        return response.data.objeto;
    }

    async getDriverPerformance(filters: ReportFilters = {}): Promise<DriverPerformance[]> {
        const response = await api.get('/v1/coordinator/reports/drivers', { params: filters });
        return response.data.objeto;
    }

    async getChartData(days: number = 7): Promise<ChartDataItem[]> {
        const response = await api.get('/v1/coordinator/reports/chart', { params: { days } });
        return response.data.objeto;
    }
}

export default new ReportService();
