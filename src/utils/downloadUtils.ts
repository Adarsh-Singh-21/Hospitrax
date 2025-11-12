import { Appointment, MedicalReport } from '../types/patient';

export const downloadAppointmentReport = (appointment: Appointment, patientName?: string) => {
  const content = generateAppointmentReportHTML(appointment, patientName);
  downloadAsFile(content, `appointment-report-${appointment.id}.html`, 'text/html');
};

export const downloadMedicalReport = (report: MedicalReport, patientName?: string) => {
  const content = generateMedicalReportHTML(report, patientName);
  downloadAsFile(content, `medical-report-${report.id}.html`, 'text/html');
};

const generateAppointmentReportHTML = (appointment: Appointment, patientName?: string): string => {
  const date = appointment.actualDate || appointment.scheduledDate;
  const status = appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
  const type = appointment.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Report - ${appointment.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      color: #2c3e50;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h2 {
      color: #2c3e50;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    .info-value {
      color: #333;
    }
    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.85em;
      font-weight: bold;
      margin-right: 10px;
    }
    .badge-completed { background-color: #28a745; color: white; }
    .badge-scheduled { background-color: #6c757d; color: white; }
    .badge-cancelled { background-color: #dc3545; color: white; }
    .badge-type { background-color: #007bff; color: white; }
    .symptoms {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .symptom-tag {
      background-color: #e9ecef;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 0.9em;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Appointment Report</h1>
    <p style="color: #666; margin: 5px 0;">Generated on ${new Date().toLocaleString()}</p>
  </div>

  ${patientName ? `
  <div class="section">
    <h2>Patient Information</h2>
    <div class="info-item">
      <div class="info-label">Patient Name</div>
      <div class="info-value">${patientName}</div>
    </div>
  </div>
  ` : ''}

  <div class="section">
    <h2>Appointment Details</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Appointment ID</div>
        <div class="info-value">${appointment.id}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Date</div>
        <div class="info-value">${date.toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Doctor</div>
        <div class="info-value">${appointment.doctorName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Department</div>
        <div class="info-value">${appointment.department}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Duration</div>
        <div class="info-value">${appointment.duration} minutes</div>
      </div>
      <div class="info-item">
        <div class="info-label">Type</div>
        <div class="info-value">
          <span class="badge badge-type">${type}</span>
        </div>
      </div>
    </div>
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Status</div>
      <div class="info-value">
        <span class="badge badge-${appointment.status}">${status}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Visit Information</h2>
    <div class="info-item">
      <div class="info-label">Reason for Visit</div>
      <div class="info-value">${appointment.reason}</div>
    </div>
    ${appointment.symptoms.length > 0 ? `
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Symptoms</div>
      <div class="symptoms">
        ${appointment.symptoms.map(s => `<span class="symptom-tag">${s}</span>`).join('')}
      </div>
    </div>
    ` : ''}
  </div>

  ${appointment.diagnosis ? `
  <div class="section">
    <h2>Diagnosis</h2>
    <div class="info-item">
      <div class="info-value">${appointment.diagnosis}</div>
    </div>
  </div>
  ` : ''}

  ${appointment.treatment ? `
  <div class="section">
    <h2>Treatment</h2>
    <div class="info-item">
      <div class="info-value">${appointment.treatment}</div>
    </div>
  </div>
  ` : ''}

  ${appointment.notes ? `
  <div class="section">
    <h2>Notes</h2>
    <div class="info-item">
      <div class="info-value">${appointment.notes}</div>
    </div>
  </div>
  ` : ''}

  ${appointment.followUpRequired ? `
  <div class="section">
    <h2>Follow-up</h2>
    <div class="info-item">
      <div class="info-value">
        Follow-up required${appointment.followUpDate ? ` - Next appointment: ${appointment.followUpDate.toLocaleDateString()}` : ''}
      </div>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>This is an official medical document. Please keep it confidential.</p>
    <p>Report generated by Hospitrax Medical System</p>
  </div>

  <script>
    // Auto-trigger print dialog when opened in browser
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `.trim();
};

const generateMedicalReportHTML = (report: MedicalReport, patientName?: string): string => {
  const status = report.status.charAt(0).toUpperCase() + report.status.slice(1);
  const type = report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Report - ${report.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      color: #2c3e50;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h2 {
      color: #2c3e50;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    .info-value {
      color: #333;
    }
    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.85em;
      font-weight: bold;
      margin-right: 10px;
    }
    .badge-completed { background-color: #28a745; color: white; }
    .badge-pending { background-color: #ffc107; color: #333; }
    .badge-reviewed { background-color: #6c757d; color: white; }
    .badge-type { background-color: #007bff; color: white; }
    .badge-confidential { background-color: #dc3545; color: white; }
    .content-box {
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #007bff;
      margin: 15px 0;
      border-radius: 5px;
    }
    .attachment-item {
      background-color: #e9ecef;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Medical Report</h1>
    <p style="color: #666; margin: 5px 0;">Generated on ${new Date().toLocaleString()}</p>
  </div>

  ${patientName ? `
  <div class="section">
    <h2>Patient Information</h2>
    <div class="info-item">
      <div class="info-label">Patient Name</div>
      <div class="info-value">${patientName}</div>
    </div>
  </div>
  ` : ''}

  <div class="section">
    <h2>Report Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Report ID</div>
        <div class="info-value">${report.id}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Report Date</div>
        <div class="info-value">${report.reportDate.toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Title</div>
        <div class="info-value">${report.title}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Type</div>
        <div class="info-value">
          <span class="badge badge-type">${type}</span>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">Doctor</div>
        <div class="info-value">${report.doctorName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Department</div>
        <div class="info-value">${report.department}</div>
      </div>
    </div>
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Status</div>
      <div class="info-value">
        <span class="badge badge-${report.status}">${status}</span>
        ${report.isConfidential ? '<span class="badge badge-confidential">CONFIDENTIAL</span>' : ''}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Description</h2>
    <div class="content-box">
      <div class="info-value">${report.description}</div>
    </div>
  </div>

  ${report.findings ? `
  <div class="section">
    <h2>Findings</h2>
    <div class="content-box">
      <div class="info-value">${report.findings}</div>
    </div>
  </div>
  ` : ''}

  ${report.recommendations ? `
  <div class="section">
    <h2>Recommendations</h2>
    <div class="content-box">
      <div class="info-value">${report.recommendations}</div>
    </div>
  </div>
  ` : ''}

  ${report.attachments.length > 0 ? `
  <div class="section">
    <h2>Attachments</h2>
    ${report.attachments.map(att => `
      <div class="attachment-item">
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">${att.fileName}</div>
          <div style="font-size: 0.9em; color: #666;">
            ${att.fileType.toUpperCase()} • ${(att.fileSize / 1024).toFixed(2)} KB
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>This is an official medical document. Please keep it confidential.</p>
    <p>Report generated by Hospitrax Medical System</p>
  </div>

  <script>
    // Auto-trigger print dialog when opened in browser
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `.trim();
};

const downloadAsFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

