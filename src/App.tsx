import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AuthLogin from './components/AuthLogin';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [role, setRole] = useState<null | 'patient' | 'doctor'>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as null | 'patient' | 'doctor';
    if (storedRole) {
      setRole(storedRole);
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsub();
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSelectRole = (selected: 'patient' | 'doctor') => {
    localStorage.setItem('userRole', selected);
    setRole(selected);
  };

  const handleLogout = async () => {
    localStorage.removeItem('userRole');
    setRole(null);
    setIsAuthenticated(false);
    setShowLogin(false);
    await signOut(auth);
  };

  // If authenticated and has role, show dashboard
  if (isAuthenticated && role) {
    return (
      <div className="App">
        <Dashboard role={role} />
      </div>
    );
  }

  // If role is selected but not authenticated, show Firebase auth
  if (role && !isAuthenticated) {
    return (
      <AuthLogin 
        role={role} 
        onSuccess={() => setIsAuthenticated(true)} 
        onBack={() => {
          setRole(null);
          localStorage.removeItem('userRole');
        }}
      />
    );
  }

  // If login button clicked, show role selection
  if (showLogin) {
    return <Login onSelectRole={handleSelectRole} onBack={() => setShowLogin(false)} />;
  }

  // Default: show landing page
  return <LandingPage onLoginClick={handleLoginClick} />;
}

export default App;
