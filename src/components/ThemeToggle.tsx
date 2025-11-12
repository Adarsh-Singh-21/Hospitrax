import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleThemeChange = () => {
      // Force component re-render on theme change
      setMounted(false);
      setTimeout(() => setMounted(true), 0);
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const handleClick = () => {
    toggleTheme();
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-dark-hover hover:bg-gray-700 border border-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        <Sun size={18} className="text-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-dark-hover hover:bg-gray-700 border border-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-gray-300" />
      ) : (
        <Moon size={18} className="text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;

