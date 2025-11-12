import React, { useState } from 'react';
import { Bed, Activity, Wind, Syringe, PlusCircle, Send } from 'lucide-react';
import NotificationService from '../services/NotificationService';
import { NotificationPriority, NotificationCategory, DeliveryChannel, NotificationType } from '../types/notifications';
import ResourceService from '../services/ResourceService';

const DoctorAdminPanel: React.FC = () => {
  const [resourceForm, setResourceForm] = useState({
    hospital: '',
    resourceType: 'beds',
    quantity: 1,
    note: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const notificationService = NotificationService.getInstance();
  const resourceService = ResourceService.getInstance();

  const resourceOptions = [
    { id: 'beds', label: 'Hospital Beds', icon: Bed },
    { id: 'icu', label: 'ICU Beds', icon: Activity },
    { id: 'oxygen', label: 'Oxygen Cylinders', icon: Wind },
    { id: 'ventilators', label: 'Ventilators', icon: Syringe },
  ];

  const submitResource = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, persist to backend/Firestore here
    setStatusMsg(`Added ${resourceForm.quantity} ${resourceForm.resourceType} to ${resourceForm.hospital}`);
    // Update shared resource store for real-time table updates
    resourceService.addOrUpdateResource({
      hospital: resourceForm.hospital,
      resourceType: resourceForm.resourceType,
      quantity: resourceForm.quantity,
      note: resourceForm.note,
    });
    // Inform via notification (resource update) - visible to all users
    await notificationService.createNotification({
      type: NotificationType.RESOURCE_AVAILABILITY,
      title: '📦 Resource Update',
      message: `${resourceForm.hospital}: Added ${resourceForm.quantity} ${resourceForm.resourceType}${resourceForm.note ? ` - ${resourceForm.note}` : ''}`,
      isRead: false,
      priority: NotificationPriority.MEDIUM,
      category: NotificationCategory.RESOURCES,
      deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH],
      metadata: { ...resourceForm }
    });
    setResourceForm({ hospital: '', resourceType: 'beds', quantity: 1, note: '' });
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Admin: Add/Update Resources</h3>
        </div>
        <form onSubmit={submitResource} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Hospital</label>
            <input
              type="text"
              value={resourceForm.hospital}
              onChange={(e) => setResourceForm({ ...resourceForm, hospital: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="e.g., City General Hospital"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Resource Type</label>
              <div className="grid grid-cols-2 gap-2">
                {resourceOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setResourceForm({ ...resourceForm, resourceType: opt.id })}
                      className={`p-3 rounded-lg border transition-colors ${
                        resourceForm.resourceType === opt.id
                          ? 'border-emerald-500 bg-emerald-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-white text-sm">
                        <Icon size={18} />
                        <span>{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={resourceForm.quantity}
                onChange={(e) => setResourceForm({ ...resourceForm, quantity: parseInt(e.target.value || '1', 10) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Note (optional)</label>
            <input
              type="text"
              value={resourceForm.note}
              onChange={(e) => setResourceForm({ ...resourceForm, note: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="e.g., New shipment arrived"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <PlusCircle size={18} />
              <span>Add Resource</span>
            </button>
          </div>
          {statusMsg && <p className="text-sm text-emerald-300">{statusMsg}</p>}
        </form>
      </div>

      <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Quick Alerts</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => notificationService.createResourceAlert('ICU Beds', 'Shortage: < 3 available')}
            className="px-3 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600"
          >
            <Send size={16} className="inline mr-2" /> ICU Shortage
          </button>
          <button
            onClick={() => notificationService.createResourceAlert('Oxygen', 'Levels low in Ward B')}
            className="px-3 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600"
          >
            <Send size={16} className="inline mr-2" /> Oxygen Low
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Sends alerts to all users (patients and staff).</p>
      </div>
    </div>
  );
};

export default DoctorAdminPanel;


