import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle, Clock } from 'lucide-react';
import { Notification, NotificationPriority, NotificationType } from '../types/notifications';

interface NotificationBannerProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  notification, 
  onDismiss, 
  onAction 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 10 seconds for non-critical notifications
    if (notification.priority !== NotificationPriority.CRITICAL) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification.id]);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss(notification.id);
    }, 300);
  };

  const handleAction = () => {
    if (onAction) {
      onAction(notification);
    }
  };

  const getPriorityStyles = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return {
          bg: 'bg-red-900',
          border: 'border-red-500',
          icon: AlertTriangle,
          iconColor: 'text-red-400',
          text: 'text-red-100'
        };
      case NotificationPriority.URGENT:
        return {
          bg: 'bg-orange-900',
          border: 'border-orange-500',
          icon: AlertCircle,
          iconColor: 'text-orange-400',
          text: 'text-orange-100'
        };
      case NotificationPriority.HIGH:
        return {
          bg: 'bg-yellow-900',
          border: 'border-yellow-500',
          icon: Clock,
          iconColor: 'text-yellow-400',
          text: 'text-yellow-100'
        };
      case NotificationPriority.MEDIUM:
        return {
          bg: 'bg-blue-900',
          border: 'border-blue-500',
          icon: Info,
          iconColor: 'text-blue-400',
          text: 'text-blue-100'
        };
      case NotificationPriority.LOW:
        return {
          bg: 'bg-gray-900',
          border: 'border-gray-500',
          icon: CheckCircle,
          iconColor: 'text-gray-400',
          text: 'text-gray-100'
        };
      default:
        return {
          bg: 'bg-gray-900',
          border: 'border-gray-500',
          icon: Info,
          iconColor: 'text-gray-400',
          text: 'text-gray-100'
        };
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.EMERGENCY_CODE_BLUE:
      case NotificationType.DISASTER_ALERT:
        return '🚨';
      case NotificationType.RESOURCE_SHORTAGE:
        return '⚠️';
      case NotificationType.APPOINTMENT_REMINDER:
        return '📅';
      case NotificationType.STAFF_SHIFT_REMINDER:
        return '👥';
      case NotificationType.AI_RESOURCE_SURGE:
        return '🤖';
      case NotificationType.PATIENT_MESSAGE:
        return '💬';
      case NotificationType.BILLING:
        return '💰';
      default:
        return '📢';
    }
  };

  if (!isVisible) return null;

  const styles = getPriorityStyles(notification.priority);
  const Icon = styles.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-300 ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`${styles.bg} ${styles.border} border-l-4 rounded-lg shadow-lg`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                <Icon size={20} className={styles.iconColor} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-sm font-semibold ${styles.text}`}>
                  {notification.title}
                </h4>
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 ml-2 p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors"
                >
                  <X size={16} className={styles.text} />
                </button>
              </div>
              
              <p className={`text-sm ${styles.text} opacity-90 mb-2`}>
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs opacity-75">
                  <span className={styles.text}>
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.priority === NotificationPriority.CRITICAL ? 'bg-red-800 text-red-200' :
                    notification.priority === NotificationPriority.URGENT ? 'bg-orange-800 text-orange-200' :
                    notification.priority === NotificationPriority.HIGH ? 'bg-yellow-800 text-yellow-200' :
                    'bg-gray-800 text-gray-200'
                  }`}>
                    {notification.priority.toUpperCase()}
                  </span>
                </div>
                
                {notification.actionUrl && (
                  <button
                    onClick={handleAction}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      notification.priority === NotificationPriority.CRITICAL 
                        ? 'bg-red-700 hover:bg-red-600 text-red-100' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                    }`}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
