import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [role, setRole] = useState<null | 'patient' | 'doctor'>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as null | 'patient' | 'doctor';
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleSelectRole = (selected: 'patient' | 'doctor') => {
    localStorage.setItem('userRole', selected);
    setRole(selected);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setRole(null);
  };

  if (!role) {
    return <Login onSelectRole={handleSelectRole} />;
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
