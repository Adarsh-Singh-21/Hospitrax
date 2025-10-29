import React, { useMemo, useState } from 'react';
import { auth } from '../firebase';
import AppointmentsService from '../services/AppointmentsService';
import { Star } from 'lucide-react';

const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics'];

type Doctor = {
  id: string;
  name: string;
  speciality: string;
  experienceYears: number;
  rating: number;
  hospital: string;
};

const POPULAR_DOCTORS: Record<string, Doctor[]> = {
  Cardiology: [
    { id: 'd1', name: 'Dr. Anil Verma', speciality: 'Interventional Cardiologist', experienceYears: 14, rating: 4.8, hospital: 'City Heart Center' },
    { id: 'd2', name: 'Dr. Neha Kapoor', speciality: 'Pediatric Cardiologist', experienceYears: 9, rating: 4.7, hospital: "Saint Mary's" },
  ],
  Neurology: [
    { id: 'd3', name: 'Dr. Raghav Menon', speciality: 'Neurologist', experienceYears: 12, rating: 4.6, hospital: 'Metro Neuro Care' },
    { id: 'd4', name: 'Dr. Aisha Khan', speciality: 'Neurosurgeon', experienceYears: 11, rating: 4.9, hospital: 'Apollo Neuro' },
  ],
  Orthopedics: [
    { id: 'd5', name: 'Dr. Sandeep Rao', speciality: 'Orthopedic Surgeon', experienceYears: 15, rating: 4.7, hospital: 'OrthoPlus' },
  ],
  Oncology: [
    { id: 'd6', name: 'Dr. Priya Nair', speciality: 'Medical Oncologist', experienceYears: 13, rating: 4.8, hospital: 'Hope Cancer Care' },
  ],
  Pediatrics: [
    { id: 'd7', name: 'Dr. Arjun Patel', speciality: 'Pediatrician', experienceYears: 10, rating: 4.6, hospital: 'Children First' },
  ],
};

const AppointmentBooking: React.FC = () => {
  const [doctorName, setDoctorName] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const svc = AppointmentsService.getInstance();
  const doctors = useMemo(() => POPULAR_DOCTORS[department] || [], [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Please sign in first.');
      return;
    }
    setStatus('saving');
    setError(null);
    try {
      await svc.createAppointment({
        patientUid: auth.currentUser.uid,
        patientEmail: auth.currentUser.email || '',
        doctorName,
        department,
        date,
        time,
        notes,
      });
      setStatus('success');
      setDoctorName('');
      setNotes('');
      setDate('');
      setTime('');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Failed to create appointment');
    }
  };

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
      <h3 className="text-white font-medium mb-4">Book an Appointment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select className="px-3 py-2 rounded bg-dark-bg border border-gray-700 text-white" value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <div className="px-3 py-2 rounded bg-dark-bg border border-gray-700 text-gray-300 flex items-center">
          {doctorName ? <span>Selected: <span className="text-white">{doctorName}</span></span> : 'Choose a doctor below'}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-300 mb-3">Popular doctors in {department}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <button key={doc.id} onClick={() => setDoctorName(doc.name)} className={`text-left border rounded-lg p-4 bg-dark-bg border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition ${doctorName===doc.name ? 'border-blue-500' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{doc.name}</p>
                  <p className="text-gray-400 text-sm">{doc.speciality}</p>
                  <p className="text-gray-500 text-xs mt-1">{doc.experienceYears} yrs • {doc.hospital}</p>
                </div>
                <div className="flex items-center text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                  <span className="ml-1 text-sm">{doc.rating.toFixed(1)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="px-3 py-2 rounded bg-dark-bg border border-gray-700 text-white" placeholder="Doctor name (auto-filled from selection)" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
        <input type="date" className="px-3 py-2 rounded bg-dark-bg border border-gray-700 text-white" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" className="px-3 py-2 rounded bg-dark-bg border border-gray-700 text-white" value={time} onChange={(e) => setTime(e.target.value)} required />
        <div className="md:col-span-2">
          <textarea className="w-full px-3 py-2 rounded bg-dark-bg border border-gray-700 text-white" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <div className="md:col-span-2 text-red-400 text-sm">{error}</div>}
        <div className="md:col-span-2">
          <button type="submit" disabled={status==='saving'} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
            {status==='saving' ? 'Booking…' : 'Book Appointment'}
          </button>
          {status==='success' && <span className="ml-3 text-emerald-400">Booked successfully</span>}
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;


