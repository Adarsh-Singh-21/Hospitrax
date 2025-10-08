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
  NotificationFilter,
  DeliveryChannel
} from '../types/notifications';
// import NotificationSettings from './NotificationSettings';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [, setFilter] = useState<NotificationFilter>({});
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | 'all'>('all');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: NotificationType.EMERGENCY_CODE_BLUE,
        title: 'Code Blue Alert',
        message: 'Emergency resuscitation required in ICU Room 3. All available staff please respond immediately.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        isRead: false,
        priority: NotificationPriority.CRITICAL,
        category: NotificationCategory.EMERGENCY,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH, DeliveryChannel.SMS],
        actionUrl: '/emergency/room-3'
      },
      {
        id: '2',
        type: NotificationType.RESOURCE_SHORTAGE,
        title: 'ICU Bed Shortage',
        message: 'Only 2 ICU beds remaining. Consider transferring stable patients to general wards.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false,
        priority: NotificationPriority.HIGH,
        category: NotificationCategory.RESOURCES,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH, DeliveryChannel.EMAIL]
      },
      {
        id: '3',
        type: NotificationType.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: 'Dr. Smith has a surgery scheduled in 30 minutes - Operating Room 2.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: true,
        priority: NotificationPriority.MEDIUM,
        category: NotificationCategory.APPOINTMENTS,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH]
      },
      {
        id: '4',
        type: NotificationType.AI_RESOURCE_SURGE,
        title: 'AI Prediction: Resource Surge Expected',
        message: 'Based on historical data and current trends, expect 40% increase in emergency admissions in the next 4 hours.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        isRead: false,
        priority: NotificationPriority.HIGH,
        category: NotificationCategory.AI_INSIGHTS,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL]
      },
      {
        id: '5',
        type: NotificationType.STAFF_SHIFT_REMINDER,
        title: 'Shift Change Reminder',
        message: 'Night shift starts in 1 hour. Please ensure all handovers are completed.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        isRead: true,
        priority: NotificationPriority.MEDIUM,
        category: NotificationCategory.STAFF,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH]
      },
      {
        id: '6',
        type: NotificationType.PATIENT_MESSAGE,
        title: 'Patient Message',
        message: 'Patient John Doe in Room 205 has requested pain medication review.',
        timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
        isRead: false,
        priority: NotificationPriority.MEDIUM,
        category: NotificationCategory.PATIENT_COMMUNICATION,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH]
      },
      {
        id: '7',
        type: NotificationType.BILLING,
        title: 'Billing Alert',
        message: 'Insurance authorization required for Patient ID 12345 before procedure can proceed.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true,
        priority: NotificationPriority.MEDIUM,
        category: NotificationCategory.ADMINISTRATIVE,
        deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL]
      }
    ];
    setNotifications(mockNotifications);
  }, []);

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
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case NotificationCategory.EMERGENCY:
        return <AlertTriangle size={16} className="text-red-400" />;
      case NotificationCategory.RESOURCES:
        return <Activity size={16} className="text-blue-400" />;
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
        return 'border-l-blue-500';
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
            <Bell size={24} className="text-blue-400" />
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
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCheck size={16} />
              <span>Mark All Read</span>
            </button>
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
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as NotificationCategory | 'all')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  !notification.isRead ? 'ring-2 ring-blue-500/20' : ''
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
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
