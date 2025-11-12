import React, { useState } from 'react';
import { X, Bell, Mail, Smartphone, MessageSquare, Clock, Check } from 'lucide-react';
import { NotificationSettings as NotificationSettingsType, DeliveryChannel, NotificationCategory, NotificationPriority } from '../types/notifications';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    userId: 'user-123',
    channels: {
      [DeliveryChannel.IN_APP]: true,
      [DeliveryChannel.PUSH]: true,
      [DeliveryChannel.EMAIL]: true,
      [DeliveryChannel.SMS]: false,
    },
    categories: {
      [NotificationCategory.EMERGENCY]: true,
      [NotificationCategory.RESOURCES]: true,
      [NotificationCategory.APPOINTMENTS]: true,
      [NotificationCategory.STAFF]: true,
      [NotificationCategory.AI_INSIGHTS]: true,
      [NotificationCategory.PATIENT_COMMUNICATION]: true,
      [NotificationCategory.ADMINISTRATIVE]: false,
      [NotificationCategory.SYSTEM]: true,
    },
    priorities: {
      [NotificationPriority.CRITICAL]: true,
      [NotificationPriority.URGENT]: true,
      [NotificationPriority.HIGH]: true,
      [NotificationPriority.MEDIUM]: true,
      [NotificationPriority.LOW]: false,
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00',
      timezone: 'UTC-5',
    },
    emailDigest: {
      enabled: true,
      frequency: 'daily',
    },
  });

  const updateChannel = (channel: DeliveryChannel, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: enabled,
      },
    }));
  };

  const updateCategory = (category: NotificationCategory, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: enabled,
      },
    }));
  };

  const updatePriority = (priority: NotificationPriority, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [priority]: enabled,
      },
    }));
  };

  const updateQuietHours = (field: 'enabled' | 'start' | 'end' | 'timezone', value: any) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  const updateEmailDigest = (field: 'enabled' | 'frequency', value: any) => {
    setSettings(prev => ({
      ...prev,
      emailDigest: {
        ...prev.emailDigest,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // In real app, save to backend
    console.log('Saving notification settings:', settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Notification Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Delivery Channels */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Delivery Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell size={20} className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium">In-App Notifications</p>
                    <p className="text-gray-400 text-sm">Show notifications within the application</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels[DeliveryChannel.IN_APP]}
                    onChange={(e) => updateChannel(DeliveryChannel.IN_APP, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone size={20} className="text-green-400" />
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-gray-400 text-sm">Send notifications to your mobile device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels[DeliveryChannel.PUSH]}
                    onChange={(e) => updateChannel(DeliveryChannel.PUSH, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-gray-400 text-sm">Send detailed notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels[DeliveryChannel.EMAIL]}
                    onChange={(e) => updateChannel(DeliveryChannel.EMAIL, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare size={20} className="text-red-400" />
                  <div>
                    <p className="text-white font-medium">SMS Alerts</p>
                    <p className="text-gray-400 text-sm">Send urgent alerts via SMS (for critical notifications only)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels[DeliveryChannel.SMS]}
                    onChange={(e) => updateChannel(DeliveryChannel.SMS, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Notification Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(NotificationCategory).map((category) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-white capitalize">{category.replace('_', ' ')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.categories[category]}
                      onChange={(e) => updateCategory(category, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Priorities */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Priority Levels</h3>
            <div className="space-y-3">
              {Object.values(NotificationPriority).map((priority) => (
                <div key={priority} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-white capitalize">{priority}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.priorities[priority]}
                      onChange={(e) => updatePriority(priority, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quiet Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Enable Quiet Hours</p>
                    <p className="text-gray-400 text-sm">Pause non-critical notifications during specified hours</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.quietHours.enabled}
                    onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              {settings.quietHours.enabled && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => updateQuietHours('start', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                    <input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => updateQuietHours('end', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={settings.quietHours.timezone}
                      onChange={(e) => updateQuietHours('timezone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="UTC-5">EST (UTC-5)</option>
                      <option value="UTC-6">CST (UTC-6)</option>
                      <option value="UTC-7">MST (UTC-7)</option>
                      <option value="UTC-8">PST (UTC-8)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Digest */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Email Digest</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Enable Email Digest</p>
                    <p className="text-gray-400 text-sm">Receive a summary of notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailDigest.enabled}
                    onChange={(e) => updateEmailDigest('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              {settings.emailDigest.enabled && (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Digest Frequency</label>
                  <select
                    value={settings.emailDigest.frequency}
                    onChange={(e) => updateEmailDigest('frequency', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Check size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
