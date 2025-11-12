import React from 'react';
import { LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LandingNavbarProps {
  onLoginClick: () => void;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="bg-dark-sidebar border-b border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">H</span>
            </div>
            <span className="text-white text-xl font-semibold">Hospitrax</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;

