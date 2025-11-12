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
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role?: 'patient' | 'doctor';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationService = NotificationService.getInstance();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const allItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'appointments', label: 'Appointments', icon: FileText },
  ];
  const mainItems = role === 'doctor'
    ? allItems.filter(i => !['analytics', 'appointments'].includes(i.id))
    : allItems;

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });
    return unsubscribe;
  }, [notificationService]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email || '';
        setUserEmail(email);
        
        // Fetch username from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Prioritize username field from Firestore - use it if it exists and is not empty
            if (userData.username && userData.username.trim() !== '') {
              setUserName(userData.username.trim());
            } else if (userData.displayName && userData.displayName.trim() !== '') {
              setUserName(userData.displayName.trim());
            } else if (user.displayName && user.displayName.trim() !== '') {
              setUserName(user.displayName.trim());
            } else {
              // Only use email prefix as last resort if no username is set
              setUserName(email.split('@')[0] || 'User');
            }
          } else {
            // If user doc doesn't exist, try to get from auth displayName
            if (user.displayName && user.displayName.trim() !== '') {
              setUserName(user.displayName.trim());
            } else {
              setUserName(email.split('@')[0] || 'User');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (user.displayName && user.displayName.trim() !== '') {
            setUserName(user.displayName.trim());
          } else {
            setUserName(email.split('@')[0] || 'User');
          }
        }
      } else {
        setUserEmail('');
        setUserName('');
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-64 bg-dark-sidebar dark:bg-dark-sidebar bg-white h-full flex flex-col border-r border-gray-700 dark:border-gray-700 border-gray-200">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <img
            src="/hospitrax-logo.svg"
            alt="HospiTrax logo"
            className="w-8 h-8 rounded bg-white object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-white dark:text-white text-gray-900 font-bold text-xl tracking-tight">
            Hospi<span className="text-emerald-400 dark:text-emerald-400 text-emerald-600">Trax</span>
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-6 mb-6">
        <h3 className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm font-medium mb-4">Main</h3>
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
                    ? 'bg-dark-hover dark:bg-dark-hover bg-gray-100 text-white dark:text-white text-gray-900'
                    : 'text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-dark-hover dark:hover:bg-dark-hover hover:bg-gray-50'
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
      <div className="mt-auto p-6 relative">
        <button
          onClick={() => setProfileMenuOpen(v => !v)}
          className="w-full flex items-center space-x-3 p-3 rounded-lg bg-dark-card dark:bg-dark-card bg-gray-50 hover:bg-dark-hover dark:hover:bg-dark-hover hover:bg-gray-100 transition"
        >
          <div className="w-10 h-10 bg-gray-600 dark:bg-gray-600 bg-gray-400 rounded-full flex items-center justify-center text-white dark:text-white text-gray-900 font-semibold">
            {userName ? userName.charAt(0).toUpperCase() : <User size={20} className="text-white dark:text-white text-gray-900" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white dark:text-white text-gray-900 text-sm font-medium truncate">{userName || 'Guest'}</p>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-xs truncate">{userEmail || 'Not signed in'}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 dark:text-gray-400 text-gray-600" />
        </button>
        {profileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
            <div className="absolute z-50 left-6 right-6 bottom-16">
              <div className="bg-dark-card dark:bg-dark-card bg-white border border-gray-700 dark:border-gray-700 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3">
                  <p className="text-white dark:text-white text-gray-900 text-sm font-medium truncate">{userName || 'Account'}</p>
                  <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-xs truncate">{userEmail || '—'}</p>
                </div>
                <div className="h-px bg-gray-700 dark:bg-gray-700 bg-gray-200" />
                <button
                  onClick={async () => {
                    localStorage.removeItem('userRole');
                    await signOut(auth);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-400 dark:text-red-400 text-red-600 hover:bg-dark-hover dark:hover:bg-dark-hover hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
