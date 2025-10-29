import React from 'react';

type UserRole = 'patient' | 'doctor';

interface LoginProps {
  onSelectRole: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-gray-300 mt-2">Select how you want to continue</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectRole('patient')}
            className="group rounded-xl border border-gray-700 bg-gray-800/40 p-6 text-left hover:border-blue-500 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Patient</h2>
                <p className="text-gray-400 mt-1 text-sm">Access your appointments and reports</p>
              </div>
              <span className="text-blue-400 group-hover:text-blue-300">→</span>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('doctor')}
            className="group rounded-xl border border-gray-700 bg-gray-800/40 p-6 text-left hover:border-emerald-500 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Admin</h2>
                <p className="text-gray-400 mt-1 text-sm">Manage resources and monitor operations</p>
              </div>
              <span className="text-emerald-400 group-hover:text-emerald-300">→</span>
            </div>
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          By continuing, you agree to the terms and policies.
        </p>
      </div>
    </div>
  );
};

export default Login;



