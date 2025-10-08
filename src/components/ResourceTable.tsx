import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ResourceTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      id: 1,
      hospital: 'City General Hospital',
      resource: 'ICU Beds',
      status: 'Available',
      progress: 75,
      total: '8/12',
      createdDate: '02-09-2025',
      dueDate: '2h left',
      priority: 'high'
    },
    {
      id: 2,
      hospital: 'Metro Medical Center',
      resource: 'Oxygen Tanks',
      status: 'In Progress',
      progress: 45,
      total: '45/100',
      createdDate: '02-09-2025',
      dueDate: '4h left',
      priority: 'medium'
    },
    {
      id: 3,
      hospital: 'Regional Hospital',
      resource: 'Ventilators',
      status: 'Urgent',
      progress: 90,
      total: '2/5',
      createdDate: '02-09-2025',
      dueDate: '1h left',
      priority: 'urgent'
    },
    {
      id: 4,
      hospital: 'Community Health',
      resource: 'Staff Nurses',
      status: 'Available',
      progress: 60,
      total: '12/20',
      createdDate: '02-09-2025',
      dueDate: '6h left',
      priority: 'low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'In Progress':
        return <Clock size={16} className="text-yellow-400" />;
      case 'Urgent':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <XCircle size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <h3 className="text-white text-lg font-semibold">Resource Requests</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-hover text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-hover rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Hospital</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Resource</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Progress</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Total</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Created Date</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b border-gray-800 hover:bg-dark-hover transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(resource.priority)}`}></div>
                    <span className="text-white font-medium">{resource.hospital}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-white">{resource.resource}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(resource.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      resource.status === 'Available' ? 'bg-green-900 text-green-300' :
                      resource.status === 'In Progress' ? 'bg-yellow-900 text-yellow-300' :
                      resource.status === 'Urgent' ? 'bg-red-900 text-red-300' :
                      'bg-gray-900 text-gray-300'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${resource.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{resource.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-white">{resource.total}</td>
                <td className="py-4 px-4 text-gray-400">{resource.createdDate}</td>
                <td className="py-4 px-4 text-gray-400">{resource.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
