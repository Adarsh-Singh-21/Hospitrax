import React from 'react';
import { X, Calendar, User, Stethoscope, FileText, Download } from 'lucide-react';
import { Appointment, MedicalReport } from '../types/patient';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'appointment' | 'report';
  data: Appointment | MedicalReport | null;
  onDownload?: (id: string) => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  data,
  onDownload 
}) => {
  if (!isOpen || !data) return null;

  const renderAppointmentDetails = (appointment: Appointment) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <User size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Doctor</p>
            <p className="text-white font-medium">{appointment.doctorName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Stethoscope size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Department</p>
            <p className="text-white font-medium">{appointment.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar size={20} className="text-gray-400" />
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
          <FileText size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="text-white font-medium capitalize">{appointment.appointmentType.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Reason for Visit</p>
        <p className="text-white">{appointment.reason}</p>
      </div>

      {appointment.symptoms.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Symptoms</p>
          <div className="flex flex-wrap gap-2">
            {appointment.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {appointment.diagnosis && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Diagnosis</p>
          <p className="text-white">{appointment.diagnosis}</p>
        </div>
      )}

      {appointment.treatment && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Treatment</p>
          <p className="text-white">{appointment.treatment}</p>
        </div>
      )}

      {appointment.notes && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Notes</p>
          <p className="text-white">{appointment.notes}</p>
        </div>
      )}

      {appointment.followUpRequired && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
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
  );

  const renderReportDetails = (report: MedicalReport) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <User size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Doctor</p>
            <p className="text-white font-medium">{report.doctorName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Stethoscope size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Department</p>
            <p className="text-white font-medium">{report.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Report Date</p>
            <p className="text-white font-medium">{report.reportDate.toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FileText size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="text-white font-medium capitalize">{report.reportType}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Description</p>
        <p className="text-white">{report.description}</p>
      </div>

      {report.findings && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Findings</p>
          <p className="text-white">{report.findings}</p>
        </div>
      )}

      {report.recommendations && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Recommendations</p>
          <p className="text-white">{report.recommendations}</p>
        </div>
      )}

      {report.attachments.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Attachments</p>
          <div className="space-y-2">
            {report.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{attachment.fileName}</p>
                    <p className="text-gray-400 text-xs">
                      {attachment.fileType.toUpperCase()} • {(attachment.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(attachment.downloadUrl, '_blank')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Download attachment"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold">
            {type === 'appointment' ? 'Appointment Details' : 'Medical Report Details'}
          </h3>
          <div className="flex items-center space-x-3">
            {onDownload && (
              <button
                onClick={() => {
                  if (data) {
                    onDownload(data.id);
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          {type === 'appointment' 
            ? renderAppointmentDetails(data as Appointment)
            : renderReportDetails(data as MedicalReport)
          }
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

