export interface Appointment {
  id: string;
  patientUid: string;
  patientEmail: string;
  doctorName: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: number; // epoch ms
}


