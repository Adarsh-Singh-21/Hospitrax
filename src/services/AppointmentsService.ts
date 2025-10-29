import { db } from '../firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { Appointment } from '../types/appointment';

export default class AppointmentsService {
  private static instance: AppointmentsService;
  static getInstance(): AppointmentsService {
    if (!this.instance) this.instance = new AppointmentsService();
    return this.instance;
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'status'> & { status?: Appointment['status'] }): Promise<string> {
    const ref = await addDoc(collection(db, 'appointments'), {
      ...data,
      status: data.status || 'scheduled',
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async listAppointmentsForPatient(patientUid: string): Promise<Appointment[]> {
    const q = query(collection(db, 'appointments'), where('patientUid', '==', patientUid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const v: any = d.data();
      return {
        id: d.id,
        patientUid: v.patientUid,
        patientEmail: v.patientEmail,
        doctorName: v.doctorName,
        department: v.department,
        date: v.date,
        time: v.time,
        notes: v.notes,
        status: v.status || 'scheduled',
        createdAt: (v.createdAt?.toMillis?.() ?? Date.now()) as number,
      } as Appointment;
    });
  }
}


