import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Download,
  Search
} from 'lucide-react';
import { Appointment } from '../types/patient';

interface AppointmentHistoryProps {
  appointments: Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  onDownloadReport: (appointmentId: string) => void;
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ 
  appointments, 
  onViewDetails, 
  onDownloadReport 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredAppointments = appointments.filter(appointment => {
    if (searchTerm && !appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !appointment.department.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedStatus !== 'all' && appointment.status !== selectedStatus) {
      return false;
    }
    if (selectedType !== 'all' && appointment.appointmentType !== selectedType) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      case 'no-show':
        return <AlertCircle size={16} className="text-orange-400" />;
      case 'scheduled':
        return <Clock size={16} className="text-blue-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'follow-up':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'emergency':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'surgery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'checkup':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar size={24} className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Appointment History</h2>
        </div>
        <div className="text-sm text-gray-400">
          {filteredAppointments.length} appointments found
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor, department, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="emergency">Emergency</option>
            <option value="surgery">Surgery</option>
            <option value="checkup">Checkup</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Calendar size={48} className="mb-4" />
            <p className="text-lg">No appointments found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-dark-card rounded-lg p-6 hover:bg-dark-hover transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAppointmentTypeColor(appointment.appointmentType)}`}>
                      {appointment.appointmentType.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Doctor</p>
                        <p className="text-white font-medium">{appointment.doctorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Stethoscope size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Department</p>
                        <p className="text-white font-medium">{appointment.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="text-white font-medium">
                          {appointment.actualDate 
                            ? appointment.actualDate.toLocaleDateString()
                            : appointment.scheduledDate.toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="text-white font-medium">{appointment.duration} minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Reason for Visit</p>
                    <p className="text-white">{appointment.reason}</p>
                  </div>

                  {appointment.diagnosis && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Diagnosis</p>
                      <p className="text-white">{appointment.diagnosis}</p>
                    </div>
                  )}

                  {appointment.treatment && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Treatment</p>
                      <p className="text-white">{appointment.treatment}</p>
                    </div>
                  )}

                  {appointment.symptoms.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {appointment.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-900 text-blue-200 rounded-full text-xs"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.followUpRequired && (
                    <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-200 text-sm font-medium">
                        Follow-up required
                        {appointment.followUpDate && (
                          <span className="ml-2">
                            - Next appointment: {appointment.followUpDate.toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => onViewDetails(appointment)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText size={16} />
                    <span>View Details</span>
                  </button>
                  {appointment.status === 'completed' && (
                    <button
                      onClick={() => onDownloadReport(appointment.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={16} />
                      <span>Download Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;
