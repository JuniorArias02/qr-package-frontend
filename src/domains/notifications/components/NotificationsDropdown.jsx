import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const data = await notificationService.getNotifications();
            console.log('Notifications API response:', data); // Added for debugging
            
            // Safely extract notifications array (handles Laravel pagination wrappers like data.data)
            let parsedNotifications = [];
            if (data?.notifications && Array.isArray(data.notifications)) {
                parsedNotifications = data.notifications;
            } else if (data?.notifications?.data && Array.isArray(data.notifications.data)) {
                parsedNotifications = data.notifications.data;
            } else if (Array.isArray(data)) {
                parsedNotifications = data;
            }
            
            setNotifications(parsedNotifications);
            setUnreadCount(data?.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMarkAsRead = async (id, e) => {
        if (e) {
            e.stopPropagation();
        }
        
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, readAt: new Date().toISOString() } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(`Failed to mark notification ${id} as read:`, error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, readAt: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.readAt) {
            handleMarkAsRead(notification.id);
        }
        
        setIsOpen(false);
        
        // Basic routing logic based on notification type and reference_id
        if (notification.data?.reference_id) {
            // Depending on the role, the redirect might differ. Assuming general paths.
            // A more complex routing could be implemented if necessary.
            navigate(`/details/${notification.data.reference_id}`);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.round((now - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${isOpen ? 'text-violet-600 bg-violet-50' : ''}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 border border-white"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 transform origin-top-right transition-all duration-300">
                    <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-[11px] font-bold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-[28rem] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8 text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-5 h-5 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">No notifications yet</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">We'll let you know when something happens.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {(Array.isArray(notifications) ? notifications : []).slice(0, 10).map((notification) => {
                                    const isUnread = !notification.readAt;
                                    return (
                                        <div 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`relative group px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3 ${isUnread ? 'bg-violet-50/30' : ''}`}
                                        >
                                            {isUnread && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                                            )}
                                            
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <p className={`text-sm truncate ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                        {notification.data?.title || 'Notification'}
                                                    </p>
                                                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </span>
                                                </div>
                                                <p className={`text-xs line-clamp-2 ${isUnread ? 'font-medium text-slate-600' : 'font-medium text-slate-500'}`}>
                                                    {notification.data?.message}
                                                </p>
                                            </div>
                                            
                                            {isUnread && (
                                                <button 
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-violet-100 rounded-md transition-all self-center text-violet-600"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    {notifications.length > 10 && (
                        <div className="p-2 border-t border-slate-100/80 bg-slate-50/50">
                            <button 
                                onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                                className="w-full py-2 text-xs font-bold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
