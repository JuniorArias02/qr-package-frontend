export interface NotificationData {
    title: string;
    message: string;
    reference_id?: number | string;
    type?: string;
}

export interface AppNotification {
    id: string;
    type: string;
    data: NotificationData;
    readAt: string | null;
    createdAt: string;
}

export interface NotificationsResponseData {
    unreadCount: number;
    notifications: AppNotification[];
}

export interface NotificationsResponse {
    status: string;
    message: string;
    data: NotificationsResponseData;
}
