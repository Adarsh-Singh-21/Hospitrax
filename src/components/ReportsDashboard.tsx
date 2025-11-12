import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  Activity,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import AppointmentHistory from './AppointmentHistory';
import MedicalReports from './MedicalReports';
import { 
  Patient, 
  Appointment, 
  MedicalReport, 
  Prescription, 
  VitalSigns 
} from '../types/patient';
import PatientDataService from '../services/PatientDataService';

const ReportsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports' | 'prescriptions' | 'vitals'>('appointments');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [prescriptions] = useState<Prescription[]>([]);
  const [vitalSigns] = useState<VitalSigns[]>([]);

  // Load shared mock data from service
  useEffect(() => {
    const svc = PatientDataService.getInstance();
    setPatient(svc.getPatient());
    setAppointments(svc.getAppointments());
    setReports(svc.getReports());
  }, []);

  const handleViewAppointmentDetails = (appointment: Appointment) => {
    console.log('Viewing appointment details:', appointment);
    // In real app, this would open a modal or navigate to details page
  };

  const handleDownloadAppointmentReport = (appointmentId: string) => {
    console.log('Downloading appointment report:', appointmentId);
    // In real app, this would trigger download
  };

  const handleViewReport = (report: MedicalReport) => {
    console.log('Viewing report:', report);
    // In real app, this would open a modal or navigate to report viewer
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId);
    // In real app, this would trigger download
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'appointments':
        return <Calendar size={20} />;
      case 'reports':
        return <FileText size={20} />;
      case 'prescriptions':
        return <Activity size={20} />;
      case 'vitals':
        return <TrendingUp size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'appointments':
        return appointments.length;
      case 'reports':
        return reports.length;
      case 'prescriptions':
        return prescriptions.length;
      case 'vitals':
        return vitalSigns.length;
      default:
        return 0;
    }
  };

  return (
    <div className="h-full bg-dark-bg text-white">
      {/* Header */}
      <div className="bg-dark-card border-b border-gray-700 p-6">
        <div className="flex items-center space-x-2 text-gray-400 mb-4">
          <span>User</span>
          <ChevronRight size={16} />
          <span className="text-white">Reports</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Medical Reports & History</h1>
            {patient && (
              <p className="text-gray-400 mt-1">
                Patient: {patient.name} • DOB: {patient.dateOfBirth.toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Records</p>
              <p className="text-xl font-bold text-white">
                {appointments.length + reports.length + prescriptions.length + vitalSigns.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-card border-b border-gray-700">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'appointments', label: 'Appointments', count: getTabCount('appointments') },
            { id: 'reports', label: 'Medical Reports', count: getTabCount('reports') },
            { id: 'prescriptions', label: 'Prescriptions', count: getTabCount('prescriptions') },
            { id: 'vitals', label: 'Vital Signs', count: getTabCount('vitals') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {getTabIcon(tab.id)}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'appointments' && (
          <AppointmentHistory
            appointments={appointments}
            onViewDetails={handleViewAppointmentDetails}
            onDownloadReport={handleDownloadAppointmentReport}
          />
        )}

        {activeTab === 'reports' && (
          <MedicalReports
            reports={reports}
            onViewReport={handleViewReport}
            onDownloadReport={handleDownloadReport}
          />
        )}

        {activeTab === 'prescriptions' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Activity size={48} className="mb-4" />
            <p className="text-lg">Prescriptions</p>
            <p className="text-sm">No prescriptions available</p>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <TrendingUp size={48} className="mb-4" />
            <p className="text-lg">Vital Signs</p>
            <p className="text-sm">No vital signs records available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;
