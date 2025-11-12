import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface HeaderProps {
  currentSection: string;
  role?: 'patient' | 'doctor';
}

const Header: React.FC<HeaderProps> = ({ currentSection, role }) => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Prioritize username field from Firestore - use it if it exists and is not empty
            if (userData.username && userData.username.trim() !== '') {
              setUserName(userData.username.trim());
            } else if (userData.displayName && userData.displayName.trim() !== '') {
              setUserName(userData.displayName.trim());
            } else if (user.displayName && user.displayName.trim() !== '') {
              setUserName(user.displayName.trim());
            } else {
              // Only use email prefix as last resort if no username is set
              setUserName(user.email?.split('@')[0] || '');
            }
          } else {
            // If user doc doesn't exist, try to get from auth displayName
            if (user.displayName && user.displayName.trim() !== '') {
              setUserName(user.displayName.trim());
            } else {
              setUserName(user.email?.split('@')[0] || '');
            }
          }
        } catch (error) {
          if (user.displayName && user.displayName.trim() !== '') {
            setUserName(user.displayName.trim());
          } else {
            setUserName(user.email?.split('@')[0] || '');
          }
        }
      } else {
        setUserName('');
      }
    });
    return () => unsub();
  }, []);

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
    <header className="bg-dark-sidebar dark:bg-dark-sidebar bg-white border-b border-gray-700 dark:border-gray-700 border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-400 text-gray-600">
          <span>{role === 'doctor' ? 'Admin' : 'Patient'}</span>
          <ChevronRight size={16} />
          <span className="text-white dark:text-white text-gray-900">{getSectionDisplayName(currentSection)}</span>
          {userName && (
            <>
              <ChevronRight size={16} />
              <span className="text-gray-300 dark:text-gray-300 text-gray-700">{userName}</span>
            </>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
