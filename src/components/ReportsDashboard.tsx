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

const ReportsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports' | 'prescriptions' | 'vitals'>('appointments');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [prescriptions] = useState<Prescription[]>([]);
  const [vitalSigns] = useState<VitalSigns[]>([]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPatient: Patient = {
      id: 'patient-123',
      name: 'John Doe',
      dateOfBirth: new Date('1985-06-15'),
      gender: 'male',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      address: '123 Main St, City, State 12345',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      },
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin', 'Shellfish'],
      bloodType: 'O+',
      insuranceInfo: {
        provider: 'HealthPlus Insurance',
        policyNumber: 'HP123456789',
        groupNumber: 'GRP001'
      },
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date()
    };

    const mockAppointments: Appointment[] = [
      {
        id: 'apt-1',
        patientId: 'patient-123',
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        appointmentType: 'consultation',
        status: 'completed',
        scheduledDate: new Date('2024-01-15'),
        actualDate: new Date('2024-01-15'),
        duration: 45,
        reason: 'Chest pain and shortness of breath',
        symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
        diagnosis: 'Hypertension with mild chest discomfort',
        treatment: 'Prescribed medication and lifestyle changes',
        notes: 'Patient responded well to treatment',
        followUpRequired: true,
        followUpDate: new Date('2024-02-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'apt-2',
        patientId: 'patient-123',
        doctorId: 'doc-2',
        doctorName: 'Dr. Michael Chen',
        department: 'Endocrinology',
        appointmentType: 'follow-up',
        status: 'completed',
        scheduledDate: new Date('2024-01-20'),
        actualDate: new Date('2024-01-20'),
        duration: 30,
        reason: 'Diabetes management follow-up',
        symptoms: ['Increased thirst', 'Frequent urination'],
        diagnosis: 'Diabetes Type 2 - well controlled',
        treatment: 'Continue current medication regimen',
        notes: 'Blood sugar levels are stable',
        followUpRequired: true,
        followUpDate: new Date('2024-04-20'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'apt-3',
        patientId: 'patient-123',
        doctorId: 'doc-3',
        doctorName: 'Dr. Emily Rodriguez',
        department: 'General Medicine',
        appointmentType: 'checkup',
        status: 'scheduled',
        scheduledDate: new Date('2024-02-10'),
        duration: 60,
        reason: 'Annual physical examination',
        symptoms: [],
        followUpRequired: false,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      }
    ];

    const mockReports: MedicalReport[] = [
      {
        id: 'report-1',
        patientId: 'patient-123',
        appointmentId: 'apt-1',
        reportType: 'lab',
        title: 'Complete Blood Count (CBC)',
        description: 'Routine blood test to check overall health',
        doctorName: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        reportDate: new Date('2024-01-15'),
        status: 'completed',
        findings: 'All values within normal range. Slight elevation in white blood cell count.',
        recommendations: 'Continue current treatment. Monitor for any signs of infection.',
        attachments: [
          {
            id: 'att-1',
            fileName: 'CBC_Results_2024.pdf',
            fileType: 'pdf',
            fileSize: 245760,
            downloadUrl: '/reports/cbc-results.pdf',
            uploadedAt: new Date('2024-01-15')
          }
        ],
        isConfidential: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'report-2',
        patientId: 'patient-123',
        appointmentId: 'apt-1',
        reportType: 'imaging',
        title: 'Chest X-Ray',
        description: 'X-ray examination of the chest to check heart and lungs',
        doctorName: 'Dr. Sarah Johnson',
        department: 'Radiology',
        reportDate: new Date('2024-01-15'),
        status: 'completed',
        findings: 'Normal heart size and shape. Clear lung fields. No acute abnormalities.',
        recommendations: 'No immediate follow-up required. Continue current treatment.',
        attachments: [
          {
            id: 'att-2',
            fileName: 'Chest_XRay_2024.jpg',
            fileType: 'jpg',
            fileSize: 1024000,
            downloadUrl: '/reports/chest-xray.jpg',
            uploadedAt: new Date('2024-01-15')
          }
        ],
        isConfidential: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    setPatient(mockPatient);
    setAppointments(mockAppointments);
    setReports(mockReports);
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
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {getTabIcon(tab.id)}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
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
