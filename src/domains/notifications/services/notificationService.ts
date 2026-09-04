import api from '../../../core/api/axios';
import { NotificationsResponse, NotificationsResponseData } from '../types/notification.types';

class NotificationService {
    /**
     * Fetch all notifications, with an optional filter for unread only.
     */
    async getNotifications(unreadOnly = false): Promise<NotificationsResponseData> {
        const url = unreadOnly ? '/v1/notifications?status=unread' : '/v1/notifications';
        const response = await api.get<NotificationsResponse>(url);
        return response.data.data;
    }

    /**
     * Mark a specific notification as read.
     */
    async markAsRead(id: string): Promise<void> {
        await api.patch(`/v1/notifications/${id}/read`);
    }

    /**
     * Mark all notifications as read.
     */
    async markAllAsRead(): Promise<void> {
        await api.post('/v1/notifications/read-all');
    }
}

export default new NotificationService();
