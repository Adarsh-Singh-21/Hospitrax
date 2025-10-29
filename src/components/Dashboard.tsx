import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewCards from './OverviewCards';
import PerformanceChart from './PerformanceChart';
import ResourceChart from './ResourceChart';
import ResourceTable from './ResourceTable';
import ResourceRequestModal from './ResourceRequestModal';
import EmergencyAlert from './EmergencyAlert';
import NotificationCenter from './NotificationCenter';
import DoctorAdminPanel from './DoctorAdminPanel';
import NotificationBanner from './NotificationBanner';
import ReportsDashboard from './ReportsDashboard';
import PatientAnalytics from './PatientAnalytics';
import HumanBodyAnalytics from './HumanBodyAnalytics';
import AppointmentBooking from './AppointmentBooking';
import { Plus, AlertTriangle } from 'lucide-react';
import { Notification, NotificationPriority } from '../types/notifications';
import NotificationService from '../services/NotificationService';

interface DashboardProps {
  role?: 'patient' | 'doctor';
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [, setNotifications] = useState<Notification[]>([]);
  const [activeBanners, setActiveBanners] = useState<Notification[]>([]);
  const notificationService = NotificationService.getInstance();

  const handleResourceRequest = (request: any) => {
    console.log('Resource request submitted:', request);
    // Here you would typically send the request to your backend
  };

  const handleEmergencyAlert = (alert: any) => {
    console.log('Emergency alert sent:', alert);
    // Create emergency notification
    notificationService.createEmergencyAlert(
      alert.message || 'Emergency situation reported',
      alert.location
    );
  };

  // Initialize notification service
  useEffect(() => {
    notificationService.loadSettings();
    
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      
      // Show banners for high priority notifications
      const highPriorityNotifications = newNotifications.filter(
        n => !n.isRead && (n.priority === NotificationPriority.CRITICAL || n.priority === NotificationPriority.URGENT)
      );
      setActiveBanners(highPriorityNotifications);
    });

    return unsubscribe;
  }, [notificationService]);

  const handleBannerDismiss = (notificationId: string) => {
    setActiveBanners(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleBannerAction = (notification: Notification) => {
    if (notification.actionUrl) {
      // Navigate to the action URL
      console.log('Navigating to:', notification.actionUrl);
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />
      
      <div className="w-px bg-gray-700"></div>
      
      <div className="flex-1 flex flex-col">
        <Header currentSection={activeTab} />
        
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'notifications' ? (
            <NotificationCenter canSend={role === 'doctor'} />
          ) : activeTab === 'reports' ? (
            <ReportsDashboard />
          ) : activeTab === 'analytics' ? (
            role === 'patient' ? (
              <div className="space-y-6">
                <HumanBodyAnalytics />
                <PatientAnalytics />
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700 text-gray-300">
                  Analytics will be available here.
                </div>
              </div>
            )
          ) : activeTab === 'appointments' ? (
            <div className="p-6 space-y-6">
              {role === 'patient' ? (
                <AppointmentBooking />
              ) : (
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700 text-gray-300">
                  Admins can view appointments in Reports for now.
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mb-6">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Request Resource</span>
                </button>
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle size={20} />
                  <span>Emergency Alert</span>
                </button>
              </div>

              <div className="space-y-6">
                {role === 'doctor' && (
                  <DoctorAdminPanel />
                )}
                {/* Overview Cards */}
                <OverviewCards />
                
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceChart />
                  <ResourceChart />
                </div>
                
                {/* Resource Table */}
                <ResourceTable />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Notification Banners */}
      {activeBanners.map((notification) => (
        <NotificationBanner
          key={notification.id}
          notification={notification}
          onDismiss={handleBannerDismiss}
          onAction={handleBannerAction}
        />
      ))}

      {/* Modals */}
      <ResourceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleResourceRequest}
      />
      <EmergencyAlert
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSubmit={handleEmergencyAlert}
      />
    </div>
  );
};

export default Dashboard;
