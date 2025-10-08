import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Stethoscope,
  Search,
  CheckCircle,
  Clock,
  Image,
  Microscope,
  Heart
} from 'lucide-react';
import { MedicalReport, ReportFilter } from '../types/patient';

interface MedicalReportsProps {
  reports: MedicalReport[];
  onViewReport: (report: MedicalReport) => void;
  onDownloadReport: (reportId: string) => void;
}

const MedicalReports: React.FC<MedicalReportsProps> = ({ 
  reports, 
  onViewReport, 
  onDownloadReport 
}) => {
  const [, setFilter] = useState<ReportFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredReports = reports.filter(report => {
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.department.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedType !== 'all' && report.reportType !== selectedType) {
      return false;
    }
    if (selectedStatus !== 'all' && report.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Microscope size={20} className="text-blue-400" />;
      case 'imaging':
        return <Image size={20} className="text-green-400" />;
      case 'pathology':
        return <Microscope size={20} className="text-purple-400" />;
      case 'radiology':
        return <Image size={20} className="text-orange-400" />;
      case 'cardiology':
        return <Heart size={20} className="text-red-400" />;
      default:
        return <FileText size={20} className="text-gray-400" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'imaging':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pathology':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'radiology':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cardiology':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'reviewed':
        return <Eye size={16} className="text-blue-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText size={24} className="text-green-400" />
          <h2 className="text-xl font-bold text-white">Medical Reports</h2>
        </div>
        <div className="text-sm text-gray-400">
          {filteredReports.length} reports found
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, doctor, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="lab">Lab Results</option>
            <option value="imaging">Imaging</option>
            <option value="pathology">Pathology</option>
            <option value="radiology">Radiology</option>
            <option value="cardiology">Cardiology</option>
            <option value="other">Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FileText size={48} className="mb-4" />
            <p className="text-lg">No reports found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-dark-card rounded-lg p-6 hover:bg-dark-hover transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getReportTypeIcon(report.reportType)}
                    <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getReportTypeColor(report.reportType)}`}>
                      {report.reportType.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    {report.isConfidential && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        CONFIDENTIAL
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Doctor</p>
                        <p className="text-white font-medium">{report.doctorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Stethoscope size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Department</p>
                        <p className="text-white font-medium">{report.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Report Date</p>
                        <p className="text-white font-medium">{report.reportDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Attachments</p>
                        <p className="text-white font-medium">{report.attachments.length} files</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <p className="text-white">{report.description}</p>
                  </div>

                  {report.findings && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Findings</p>
                      <p className="text-white">{report.findings}</p>
                    </div>
                  )}

                  {report.recommendations && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Recommendations</p>
                      <p className="text-white">{report.recommendations}</p>
                    </div>
                  )}

                  {report.attachments.length > 0 && (
                    <div className="mb-4">
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
                                  {attachment.fileType.toUpperCase()} • {formatFileSize(attachment.fileSize)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(attachment.downloadUrl, '_blank')}
                              className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => onViewReport(report)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={16} />
                    <span>View Report</span>
                  </button>
                  <button
                    onClick={() => onDownloadReport(report.id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalReports;
