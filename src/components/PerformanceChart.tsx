import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const PerformanceChart: React.FC = () => {
  const data = [
    { name: 'Mon', value: 57, label: 'Mon +57%' },
    { name: 'Tue', value: 44, label: 'Tue +44%' },
    { name: 'Wed', value: 81, label: 'Wed +81%' },
    { name: 'Thu', value: 37, label: 'Thu +37%' },
    { name: 'Fri', value: 53, label: 'Fri +53%' },
    { name: 'Sat', value: 48, label: 'Sat +48%' },
    { name: 'Sun', value: 77, label: 'Sun +77%' },
  ];

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp size={20} className="text-gray-400" />
          <h3 className="text-white text-lg font-semibold">Resource Utilization</h3>
        </div>
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <span>+12% vs last week</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Weekly Resource Usage</div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Calendar size={16} />
          <span>Last week</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#6B7280"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`text-xs ${item.name === 'Wed' ? 'text-white' : 'text-gray-400'}`}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
