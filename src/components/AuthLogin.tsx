import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';

interface AuthLoginProps {
  role: 'patient' | 'doctor';
  onSuccess: () => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ role, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in Firestore on first registration
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: cred.user.email,
          displayName: cred.user.displayName || '',
          role,
          createdAt: serverTimestamp(),
        }, { merge: true });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Ensure user profile exists
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: cred.user.email,
          displayName: cred.user.displayName || '',
          role,
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email,
        displayName: cred.user.displayName || '',
        role,
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white p-6">
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl bg-white shadow-2xl p-8">
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center shadow">
            <LogIn className="text-sky-700" size={22} />
          </div>
          <h1 className="text-center text-2xl font-semibold text-gray-900 mt-4">Sign in with email</h1>
          <p className="text-center text-gray-500 text-sm mt-2">{role === 'patient' ? 'Access your health data securely.' : 'Manage hospital resources securely.'}</p>

          <form onSubmit={handleEmailPassword} className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gray-900 text-white py-3.5 font-medium hover:bg-gray-800 disabled:opacity-60">
              {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Get Started'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-400">or sign in with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center">
            <button onClick={handleGoogle} className="border border-gray-200 rounded-xl py-2.5 px-6 hover:bg-gray-50 font-medium">Continue with Google</button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <button onClick={() => setIsRegister((v) => !v)} className="underline">
              {isRegister ? 'Have an account? Sign in' : 'New here? Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;


