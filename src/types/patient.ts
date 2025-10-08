export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  bloodType: string;
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentType: 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'checkup';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
  scheduledDate: Date;
  actualDate?: Date;
  duration: number; // in minutes
  reason: string;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  appointmentId?: string;
  reportType: 'lab' | 'imaging' | 'pathology' | 'radiology' | 'cardiology' | 'other';
  title: string;
  description: string;
  doctorName: string;
  department: string;
  reportDate: Date;
  status: 'pending' | 'completed' | 'reviewed';
  findings: string;
  recommendations: string;
  attachments: ReportAttachment[];
  isConfidential: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedAt: Date;
}

export interface Prescription {
  id: string;
  patientId: string;
  appointmentId: string;
  doctorName: string;
  medications: Medication[];
  instructions: string;
  prescribedDate: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects?: string[];
}

export interface VitalSigns {
  id: string;
  patientId: string;
  appointmentId: string;
  recordedDate: Date;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  notes?: string;
}

export interface ReportFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  reportType?: string;
  status?: string;
  doctorName?: string;
  department?: string;
}

export interface AppointmentFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string;
  appointmentType?: string;
  doctorName?: string;
  department?: string;
}
