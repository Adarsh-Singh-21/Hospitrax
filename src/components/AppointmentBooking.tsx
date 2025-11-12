import React, { useMemo, useState } from 'react';
import { auth } from '../firebase';
import AppointmentsService from '../services/AppointmentsService';
import NotificationService from '../services/NotificationService';
import { NotificationType, NotificationPriority, NotificationCategory, DeliveryChannel } from '../types/notifications';
import { Star, GraduationCap, Award, Languages } from 'lucide-react';

const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics'];

type Doctor = {
  id: string;
  name: string;
  speciality: string;
  experienceYears: number;
  rating: number;
  hospital: string;
  degree: string;
  certifications?: string[];
  consultationFee?: number;
  languages?: string[];
};

const POPULAR_DOCTORS: Record<string, Doctor[]> = {
  Cardiology: [
    { 
      id: 'd1', 
      name: 'Dr. Anil Verma', 
      speciality: 'Interventional Cardiologist', 
      experienceYears: 14, 
      rating: 4.8, 
      hospital: 'City Heart Center',
      degree: 'MBBS, MD (Cardiology), DM (Interventional Cardiology)',
      certifications: ['FACC', 'FSCAI'],
      consultationFee: 800,
      languages: ['English', 'Hindi', 'Marathi']
    },
    { 
      id: 'd2', 
      name: 'Dr. Neha Kapoor', 
      speciality: 'Pediatric Cardiologist', 
      experienceYears: 9, 
      rating: 4.7, 
      hospital: "Saint Mary's",
      degree: 'MBBS, MD (Pediatrics), DM (Pediatric Cardiology)',
      certifications: ['FACP'],
      consultationFee: 600,
      languages: ['English', 'Hindi']
    },
  ],
  Neurology: [
    { 
      id: 'd3', 
      name: 'Dr. Raghav Menon', 
      speciality: 'Neurologist', 
      experienceYears: 12, 
      rating: 4.6, 
      hospital: 'Metro Neuro Care',
      degree: 'MBBS, MD (Medicine), DM (Neurology)',
      certifications: ['FIAN', 'FACP'],
      consultationFee: 900,
      languages: ['English', 'Hindi', 'Tamil']
    },
    { 
      id: 'd4', 
      name: 'Dr. Aisha Khan', 
      speciality: 'Neurosurgeon', 
      experienceYears: 11, 
      rating: 4.9, 
      hospital: 'Apollo Neuro',
      degree: 'MBBS, MS (General Surgery), MCh (Neurosurgery)',
      certifications: ['FACS', 'FIAN'],
      consultationFee: 1000,
      languages: ['English', 'Hindi', 'Urdu']
    },
  ],
  Orthopedics: [
    { 
      id: 'd5', 
      name: 'Dr. Sandeep Rao', 
      speciality: 'Orthopedic Surgeon', 
      experienceYears: 15, 
      rating: 4.7, 
      hospital: 'OrthoPlus',
      degree: 'MBBS, MS (Orthopedics), DNB (Orthopedics)',
      certifications: ['FACS', 'AO Fellowship'],
      consultationFee: 750,
      languages: ['English', 'Hindi', 'Kannada']
    },
  ],
  Oncology: [
    { 
      id: 'd6', 
      name: 'Dr. Priya Nair', 
      speciality: 'Medical Oncologist', 
      experienceYears: 13, 
      rating: 4.8, 
      hospital: 'Hope Cancer Care',
      degree: 'MBBS, MD (Medicine), DM (Medical Oncology)',
      certifications: ['ESMO Certified', 'ASCO Member'],
      consultationFee: 950,
      languages: ['English', 'Hindi', 'Malayalam']
    },
  ],
  Pediatrics: [
    { 
      id: 'd7', 
      name: 'Dr. Arjun Patel', 
      speciality: 'Pediatrician', 
      experienceYears: 10, 
      rating: 4.6, 
      hospital: 'Children First',
      degree: 'MBBS, MD (Pediatrics), DCH',
      certifications: ['IAP Member'],
      consultationFee: 500,
      languages: ['English', 'Hindi', 'Gujarati']
    },
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
  const notificationService = NotificationService.getInstance();
  const doctors = useMemo(() => POPULAR_DOCTORS[department] || [], [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Please sign in first.');
      setStatus('error');
      return;
    }
    
    if (!doctorName || !date || !time) {
      setError('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('saving');
    setError(null);
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated. Please sign in again.');
      }

      const appointmentId = await svc.createAppointment({
        patientUid: auth.currentUser.uid,
        patientEmail: auth.currentUser.email || '',
        doctorName,
        department,
        date,
        time,
        notes,
      });
      
      // Create notification for the patient
      await notificationService.createNotification({
        type: NotificationType.APPOINTMENT_CONFIRMATION,
        title: 'Appointment Booked Successfully',
        message: `Your appointment with ${doctorName} on ${date} at ${time} has been confirmed.`,
        isRead: false,
        priority: NotificationPriority.MEDIUM,
        category: NotificationCategory.APPOINTMENTS,
        deliveryChannels: [DeliveryChannel.IN_APP],
        actionUrl: `/appointments/${appointmentId}`,
      });

      setStatus('success');
      setDoctorName('');
      setNotes('');
      setDate('');
      setTime('');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      console.error('Appointment booking error:', err);
      if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
        setError('Permission denied. Please ensure you are logged in and Firestore security rules allow appointment creation.');
      } else {
        setError(err?.message || 'Failed to create appointment. Please try again.');
      }
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
            <button 
              key={doc.id} 
              onClick={() => setDoctorName(doc.name)} 
              className={`text-left border rounded-lg p-4 bg-dark-bg border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition ${doctorName===doc.name ? 'border-gray-500 bg-gray-800' : ''}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium">{doc.name}</p>
                    <p className="text-gray-400 text-sm">{doc.speciality}</p>
                  </div>
                  <div className="flex items-center text-amber-400">
                    <Star size={16} className="fill-amber-400" />
                    <span className="ml-1 text-sm">{doc.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 text-gray-400 text-xs">
                  <GraduationCap size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{doc.degree}</span>
                </div>
                
                {doc.certifications && doc.certifications.length > 0 && (
                  <div className="flex items-start space-x-2 text-gray-400 text-xs">
                    <Award size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{doc.certifications.join(', ')}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-700">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <span>{doc.experienceYears} yrs exp</span>
                    <span>•</span>
                    <span>{doc.hospital}</span>
                  </div>
                  {doc.consultationFee && (
                    <div className="flex items-center text-gray-300">
                      <span className="text-xs">₹</span>
                      <span>{doc.consultationFee}</span>
                    </div>
                  )}
                </div>
                
                {doc.languages && doc.languages.length > 0 && (
                  <div className="flex items-start space-x-2 text-gray-400 text-xs">
                    <Languages size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{doc.languages.join(', ')}</span>
                  </div>
                )}
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
          <button type="submit" disabled={status==='saving'} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white">
            {status==='saving' ? 'Booking…' : 'Book Appointment'}
          </button>
          {status==='success' && <span className="ml-3 text-emerald-400">Booked successfully</span>}
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;


