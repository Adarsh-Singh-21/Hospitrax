import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AuthLogin from './components/AuthLogin';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [role, setRole] = useState<null | 'patient' | 'doctor'>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleSelectRole = (selected: 'patient' | 'doctor') => {
    localStorage.setItem('userRole', selected);
    setRole(selected);
  };

  const handleLogout = async () => {
    localStorage.removeItem('userRole');
    setRole(null);
    await signOut(auth);
  };

  // Step 1: choose role
  if (!role) {
    return <Login onSelectRole={handleSelectRole} />;
  }

  // Step 2: authenticate with Firebase
  if (!isAuthenticated) {
    return <AuthLogin role={role} onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="App">
      <Dashboard role={role} />
      {/* Optional: Temporary logout control for testing */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-3 py-2 text-sm bg-gray-800 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default App;
