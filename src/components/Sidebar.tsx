import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bell, 
  FileText, 
  BarChart3,
  ChevronDown,
  User
} from 'lucide-react';
import { Notification } from '../types/notifications';
import NotificationService from '../services/NotificationService';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationService = NotificationService.getInstance();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });
    return unsubscribe;
  }, [notificationService]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || '';
        setUserEmail(email);
        setUserName(user.displayName || (email ? email.split('@')[0] : 'User'));
      } else {
        setUserEmail('');
        setUserName('');
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-64 bg-dark-sidebar h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-dark-bg font-bold text-xl">H</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-6 mb-6">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Main</h3>
        <nav className="space-y-2">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const unreadCount = item.id === 'notifications' 
              ? notifications.filter(n => !n.isRead).length 
              : 0;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-dark-hover text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>


      {/* User Profile */}
      <div className="mt-auto p-6">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-card">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{userName || 'Guest'}</p>
            <p className="text-gray-400 text-xs truncate">{userEmail || 'Not signed in'}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
