import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  role?: 'patient' | 'doctor';
}

const Header: React.FC<HeaderProps> = ({ currentSection, role }) => {
  const getSectionDisplayName = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'Dashboard';
      case 'notifications':
        return 'Notifications';
      case 'reports':
        return 'Reports';
      case 'analytics':
        return 'Analytics';
      default:
        return section.charAt(0).toUpperCase() + section.slice(1);
    }
  };

  return (
    <header className="bg-dark-sidebar border-b border-gray-700 px-6 py-4">
      <div className="flex items-center space-x-2 text-gray-400">
        <span>{role === 'doctor' ? 'Admin' : 'User'}</span>
        <ChevronRight size={16} />
        <span className="text-white">{getSectionDisplayName(currentSection)}</span>
      </div>
    </header>
  );
};

export default Header;
