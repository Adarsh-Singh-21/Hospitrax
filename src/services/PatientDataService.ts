import { Patient, Appointment, MedicalReport, Prescription, VitalSigns } from '../types/patient';

class PatientDataService {
  private static instance: PatientDataService;

  private patient: Patient | null = null;
  private appointments: Appointment[] = [];
  private reports: MedicalReport[] = [];
  private prescriptions: Prescription[] = [];
  private vitals: VitalSigns[] = [];
  private organs: Array<{ key: string; name: string; status: 'normal' | 'warning' | 'critical'; score: number; lastUpdated: Date; note?: string }> = [];

  static getInstance(): PatientDataService {
    if (!PatientDataService.instance) {
      PatientDataService.instance = new PatientDataService();
      PatientDataService.instance.seedMockData();
    }
    return PatientDataService.instance;
  }

  private seedMockData(): void {
    const mockPatient: Patient = {
      id: 'patient-123',
      name: 'John Doe',
      dateOfBirth: new Date('1985-06-15'),
      gender: 'male',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      address: '123 Main St, City, State 12345',
      emergencyContact: { name: 'Jane Doe', phone: '+1 (555) 987-6543', relationship: 'Spouse' },
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin', 'Shellfish'],
      bloodType: 'O+',
      insuranceInfo: { provider: 'HealthPlus Insurance', policyNumber: 'HP123456789', groupNumber: 'GRP001' },
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date()
    };

    const mockAppointments: Appointment[] = [
      {
        id: 'apt-1', patientId: 'patient-123', doctorId: 'doc-1', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology',
        appointmentType: 'consultation', status: 'completed', scheduledDate: new Date('2024-01-15'), actualDate: new Date('2024-01-15'),
        duration: 45, reason: 'Chest pain and shortness of breath', symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
        diagnosis: 'Hypertension with mild chest discomfort', treatment: 'Prescribed medication and lifestyle changes',
        notes: 'Patient responded well to treatment', followUpRequired: true, followUpDate: new Date('2024-02-15'),
        createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-15')
      },
      {
        id: 'apt-2', patientId: 'patient-123', doctorId: 'doc-2', doctorName: 'Dr. Michael Chen', department: 'Endocrinology',
        appointmentType: 'follow-up', status: 'completed', scheduledDate: new Date('2024-01-20'), actualDate: new Date('2024-01-20'),
        duration: 30, reason: 'Diabetes management follow-up', symptoms: ['Increased thirst', 'Frequent urination'],
        diagnosis: 'Diabetes Type 2 - well controlled', treatment: 'Continue current medication regimen',
        notes: 'Blood sugar levels are stable', followUpRequired: true, followUpDate: new Date('2024-04-20'),
        createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-20')
      },
      {
        id: 'apt-3', patientId: 'patient-123', doctorId: 'doc-3', doctorName: 'Dr. Emily Rodriguez', department: 'General Medicine',
        appointmentType: 'checkup', status: 'scheduled', scheduledDate: new Date('2024-02-10'), duration: 60, reason: 'Annual physical examination',
        symptoms: [], followUpRequired: false, createdAt: new Date('2024-01-25'), updatedAt: new Date('2024-01-25')
      }
    ];

    const mockReports: MedicalReport[] = [
      {
        id: 'report-1', patientId: 'patient-123', appointmentId: 'apt-1', reportType: 'lab', title: 'Complete Blood Count (CBC)',
        description: 'Routine blood test to check overall health', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology',
        reportDate: new Date('2024-01-15'), status: 'completed', findings: 'All values within normal range. Slight elevation in white blood cell count.',
        recommendations: 'Continue current treatment. Monitor for any signs of infection.',
        attachments: [{ id: 'att-1', fileName: 'CBC_Results_2024.pdf', fileType: 'pdf', fileSize: 245760, downloadUrl: '/reports/cbc-results.pdf', uploadedAt: new Date('2024-01-15') }],
        isConfidential: false, createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15')
      },
      {
        id: 'report-2', patientId: 'patient-123', appointmentId: 'apt-1', reportType: 'imaging', title: 'Chest X-Ray',
        description: 'X-ray examination of the chest to check heart and lungs', doctorName: 'Dr. Sarah Johnson', department: 'Radiology',
        reportDate: new Date('2024-01-15'), status: 'completed', findings: 'Normal heart size and shape. Clear lung fields. No acute abnormalities.',
        recommendations: 'No immediate follow-up required. Continue current treatment.',
        attachments: [{ id: 'att-2', fileName: 'Chest_XRay_2024.jpg', fileType: 'jpg', fileSize: 1024000, downloadUrl: '/reports/chest-xray.jpg', uploadedAt: new Date('2024-01-15') }],
        isConfidential: false, createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15')
      }
    ];

    this.patient = mockPatient;
    this.appointments = mockAppointments;
    this.reports = mockReports;

    // Mock organ status data
    this.organs = [
      { key: 'heart', name: 'Heart', status: 'warning', score: 72, lastUpdated: new Date(), note: 'Mild hypertension' },
      { key: 'lungs', name: 'Lungs', status: 'normal', score: 88, lastUpdated: new Date() },
      { key: 'liver', name: 'Liver', status: 'normal', score: 90, lastUpdated: new Date() },
      { key: 'kidneys', name: 'Kidneys', status: 'normal', score: 84, lastUpdated: new Date() },
      { key: 'pancreas', name: 'Pancreas', status: 'warning', score: 68, lastUpdated: new Date(), note: 'Monitor glucose levels' },
      { key: 'brain', name: 'Brain', status: 'normal', score: 94, lastUpdated: new Date() },
      { key: 'stomach', name: 'Stomach', status: 'normal', score: 86, lastUpdated: new Date() }
    ];
  }

  getPatient(): Patient | null { return this.patient; }
  getAppointments(): Appointment[] { return this.appointments; }
  getReports(): MedicalReport[] { return this.reports; }
  getPrescriptions(): Prescription[] { return this.prescriptions; }
  getVitals(): VitalSigns[] { return this.vitals; }
  getOrgans(): Array<{ key: string; name: string; status: 'normal' | 'warning' | 'critical'; score: number; lastUpdated: Date; note?: string }> { return this.organs; }

  // Derived analytics helpers
  getAppointmentsByMonth(): Array<{ name: string; scheduled: number; completed: number }> {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const bucket: Record<string, { scheduled: number; completed: number }> = {};
    months.forEach(m => bucket[m] = { scheduled: 0, completed: 0 });
    for (const a of this.appointments) {
      const d = a.scheduledDate;
      const m = months[d.getMonth()];
      bucket[m].scheduled += 1;
      if (a.status === 'completed') bucket[m].completed += 1;
    }
    return months.slice(0, 6).map(m => ({ name: m, scheduled: bucket[m].scheduled, completed: bucket[m].completed }));
  }

  getReportTypeDistribution(): Array<{ name: string; value: number }> {
    const map: Record<string, number> = {};
    for (const r of this.reports) {
      map[r.reportType] = (map[r.reportType] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }
}

export default PatientDataService;


