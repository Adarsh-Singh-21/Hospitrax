import React from 'react';
import { Bed, Activity, AlertTriangle, Wind } from 'lucide-react';

const OverviewCards: React.FC = () => {
  const cards = [
    {
      title: 'Available Beds',
      value: '45',
      change: '+12 vs last week',
      icon: Bed,
      color: 'text-blue-400'
    },
    {
      title: 'ICU Capacity',
      value: '8',
      change: '+3 vs last week',
      icon: Activity,
      color: 'text-red-400'
    },
    {
      title: 'Oxygen Supply',
      value: '92%',
      change: '+15% vs last week',
      icon: AlertTriangle,
      color: 'text-green-400'
    },
    {
      title: 'Ventilators',
      value: '156',
      change: '+8 vs last week',
      icon: Wind,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-dark-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                <p className="text-white text-2xl font-bold mb-1">{card.value}</p>
                <p className="text-green-400 text-sm">{card.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-dark-hover ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
