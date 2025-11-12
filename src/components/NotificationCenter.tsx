import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  Check, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  User, 
  Activity,
  Brain,
  MessageSquare,
  FileText,
  ChevronRight
} from 'lucide-react';
import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationCategory, 
  DeliveryChannel
} from '../types/notifications';
import NotificationService from '../services/NotificationService';
// import NotificationSettings from './NotificationSettings';

interface NotificationCenterProps {
  canSend?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ canSend }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationService = NotificationService.getInstance();
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | 'all'>('all');

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });
    setNotifications(notificationService.getNotifications());
    return unsubscribe;
  }, [notificationService]);

  const filteredNotifications = notifications.filter(notification => {
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) {
      return false;
    }
    if (selectedPriority !== 'all' && notification.priority !== selectedPriority) {
      return false;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({
    title: '',
    message: '',
    category: NotificationCategory.ADMINISTRATIVE as NotificationCategory,
    priority: NotificationPriority.MEDIUM as NotificationPriority,
  });

  const sendNotification = async () => {
    if (!compose.title || !compose.message) return;
    await notificationService.createNotification({
      type: NotificationType.ADMINISTRATIVE,
      title: compose.title,
      message: compose.message,
      isRead: false,
      priority: compose.priority,
      category: compose.category,
      deliveryChannels: [DeliveryChannel.IN_APP],
    });
    setCompose({ title: '', message: '', category: NotificationCategory.ADMINISTRATIVE, priority: NotificationPriority.MEDIUM });
    setComposeOpen(false);
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case NotificationCategory.EMERGENCY:
        return <AlertTriangle size={16} className="text-red-400" />;
      case NotificationCategory.RESOURCES:
        return <Activity size={16} className="text-gray-400" />;
      case NotificationCategory.APPOINTMENTS:
        return <Clock size={16} className="text-green-400" />;
      case NotificationCategory.STAFF:
        return <User size={16} className="text-purple-400" />;
      case NotificationCategory.AI_INSIGHTS:
        return <Brain size={16} className="text-orange-400" />;
      case NotificationCategory.PATIENT_COMMUNICATION:
        return <MessageSquare size={16} className="text-cyan-400" />;
      case NotificationCategory.ADMINISTRATIVE:
        return <FileText size={16} className="text-gray-400" />;
      default:
        return <Bell size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return 'border-l-red-500';
      case NotificationPriority.URGENT:
        return 'border-l-orange-500';
      case NotificationPriority.HIGH:
        return 'border-l-yellow-500';
      case NotificationPriority.MEDIUM:
        return 'border-l-gray-500';
      case NotificationPriority.LOW:
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="h-full bg-dark-bg text-white">
      {/* Header */}
      <div className="bg-dark-card border-b border-gray-700 p-6">
        <div className="flex items-center space-x-2 text-gray-400 mb-4">
          <span>User</span>
          <ChevronRight size={16} />
          <span className="text-white">Notifications</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell size={24} className="text-gray-400" />
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <CheckCheck size={16} />
              <span>Mark All Read</span>
            </button>
            {canSend && (
              <button
                onClick={() => setComposeOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <span>New Notification</span>
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as NotificationCategory | 'all')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="all">All Categories</option>
              <option value={NotificationCategory.EMERGENCY}>Emergency</option>
              <option value={NotificationCategory.RESOURCES}>Resources</option>
              <option value={NotificationCategory.APPOINTMENTS}>Appointments</option>
              <option value={NotificationCategory.STAFF}>Staff</option>
              <option value={NotificationCategory.AI_INSIGHTS}>AI Insights</option>
              <option value={NotificationCategory.PATIENT_COMMUNICATION}>Patient Communication</option>
              <option value={NotificationCategory.ADMINISTRATIVE}>Administrative</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as NotificationPriority | 'all')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="all">All Priorities</option>
              <option value={NotificationPriority.CRITICAL}>Critical</option>
              <option value={NotificationPriority.URGENT}>Urgent</option>
              <option value={NotificationPriority.HIGH}>High</option>
              <option value={NotificationPriority.MEDIUM}>Medium</option>
              <option value={NotificationPriority.LOW}>Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Bell size={48} className="mb-4" />
            <p className="text-lg">No notifications found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-dark-card rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.isRead ? 'ring-2 ring-gray-500/20' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-semibold">{notification.title}</h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>{notification.timestamp.toLocaleString()}</span>
                          <span className="capitalize">{notification.priority}</span>
                          <span className="capitalize">{notification.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Notification Settings</h2>
            <p className="text-gray-400 mb-4">Settings panel coming soon...</p>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {canSend && composeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Send Notification</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={compose.title}
                onChange={(e) => setCompose({ ...compose, title: e.target.value })}
                placeholder="Title"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
              <textarea
                value={compose.message}
                onChange={(e) => setCompose({ ...compose, message: e.target.value })}
                placeholder="Message"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-28"
              />
              <div className="flex space-x-2">
                <select
                  value={compose.category}
                  onChange={(e) => setCompose({ ...compose, category: e.target.value as NotificationCategory })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value={NotificationCategory.ADMINISTRATIVE}>Administrative</option>
                  <option value={NotificationCategory.RESOURCES}>Resources</option>
                  <option value={NotificationCategory.EMERGENCY}>Emergency</option>
                  <option value={NotificationCategory.STAFF}>Staff</option>
                  <option value={NotificationCategory.SYSTEM}>System</option>
                </select>
                <select
                  value={compose.priority}
                  onChange={(e) => setCompose({ ...compose, priority: e.target.value as NotificationPriority })}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value={NotificationPriority.LOW}>Low</option>
                  <option value={NotificationPriority.MEDIUM}>Medium</option>
                  <option value={NotificationPriority.HIGH}>High</option>
                  <option value={NotificationPriority.URGENT}>Urgent</option>
                  <option value={NotificationPriority.CRITICAL}>Critical</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button onClick={() => setComposeOpen(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg">Cancel</button>
                <button onClick={sendNotification} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
