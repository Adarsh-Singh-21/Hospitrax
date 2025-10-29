import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, Activity, FileText, TrendingUp } from 'lucide-react';
import PatientDataService from '../services/PatientDataService';

const svc = PatientDataService.getInstance();

const vitalsTrend = [
  { name: 'W1', systolic: 132, diastolic: 86, glucose: 118 },
  { name: 'W2', systolic: 129, diastolic: 84, glucose: 112 },
  { name: 'W3', systolic: 126, diastolic: 82, glucose: 110 },
  { name: 'W4', systolic: 124, diastolic: 80, glucose: 105 },
  { name: 'W5', systolic: 122, diastolic: 79, glucose: 103 },
];

const COLORS = ['#60A5FA', '#34D399', '#F59E0B'];

const PatientAnalytics: React.FC = () => {
  const appointmentsByMonth = useMemo(() => svc.getAppointmentsByMonth(), []);
  const reportTypes = useMemo(() => svc.getReportTypeDistribution(), []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Patient Analytics</h2>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar size={16} />
              <span>Last 6 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top row: Appointments and Report mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card rounded-lg p-6 border border-gray-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity size={18} className="text-emerald-400" />
              <h3 className="text-white font-medium">Appointments Overview</h3>
            </div>
            <div className="text-gray-400 text-sm">Scheduled vs Completed</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="scheduled" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={18} className="text-yellow-400" />
            <h3 className="text-white font-medium">Report Types</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reportTypes} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {reportTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            {reportTypes.map((rt, i) => (
              <div key={rt.name} className="flex items-center space-x-2 text-gray-300">
                <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{rt.name}</span>
                <span className="text-gray-500">{rt.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Vitals trend */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={18} className="text-blue-400" />
          <h3 className="text-white font-medium">Vitals Trend</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="systolic" stroke="#60A5FA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="diastolic" stroke="#34D399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="glucose" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <p className="text-gray-400">Avg Blood Pressure</p>
            <p className="text-white text-lg">126/82</p>
          </div>
          <div>
            <p className="text-gray-400">Avg Glucose</p>
            <p className="text-white text-lg">110 mg/dL</p>
          </div>
          <div>
            <p className="text-gray-400">Improvement</p>
            <p className="text-emerald-400 text-lg">▲ Steady</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAnalytics;


