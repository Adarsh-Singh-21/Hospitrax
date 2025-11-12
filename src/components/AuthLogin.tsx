import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { LogIn, ArrowLeft } from 'lucide-react';

interface AuthLoginProps {
  role: 'patient' | 'doctor';
  onSuccess: () => void;
  onBack?: () => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ role, onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        if (!username.trim()) {
          setError('Please enter a username');
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in Firestore on first registration
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: cred.user.email,
          displayName: cred.user.displayName || username,
          username: username.trim(),
          role,
          createdAt: serverTimestamp(),
        }, { merge: true });
      } else {
        if (!username.trim()) {
          setError('Please enter your username');
          setLoading(false);
          return;
        }
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Fetch existing user data to preserve username
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        const existingData = userDoc.exists() ? userDoc.data() : {};
        // Update username if provided, otherwise keep existing
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: cred.user.email,
          displayName: cred.user.displayName || existingData.displayName || username.trim(),
          username: username.trim() || existingData.username || cred.user.displayName || cred.user.email?.split('@')[0] || '',
          role: existingData.role || role,
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
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || '',
        username: cred.user.displayName || cred.user.email?.split('@')[0] || '',
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
    <div className="min-h-screen flex items-center justify-center bg-dark-bg dark:bg-dark-bg bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        )}
        <div className="relative rounded-3xl bg-dark-card dark:bg-dark-card bg-white border border-gray-700 dark:border-gray-700 border-gray-200 shadow-2xl p-8">
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gray-600 dark:bg-gray-600 bg-gray-500 border border-gray-500 dark:border-gray-500 border-gray-400 flex items-center justify-center shadow-lg">
            <LogIn className="text-white dark:text-white text-white" size={22} />
          </div>
          <h1 className="text-center text-2xl font-semibold text-white dark:text-white text-gray-900 mt-4">Sign in with email</h1>
          <p className="text-center text-gray-400 dark:text-gray-400 text-gray-600 text-sm mt-2">Welcome to HospiTrax</p>

          <form onSubmit={handleEmailPassword} className="mt-6 space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-xl border border-gray-600 dark:border-gray-600 dark:bg-dark-hover bg-gray-50 dark:text-white text-gray-900 px-4 py-3 placeholder-gray-500 dark:placeholder-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-gray-600 dark:border-gray-600 dark:bg-dark-hover bg-gray-50 dark:text-white text-gray-900 px-4 py-3 placeholder-gray-500 dark:placeholder-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-600 dark:border-gray-600 dark:bg-dark-hover bg-gray-50 dark:text-white text-gray-900 px-4 py-3 placeholder-gray-500 dark:placeholder-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
            )}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gray-600 dark:bg-gray-600 bg-gray-700 text-white py-3.5 font-medium hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-800 disabled:opacity-60 transition-colors">
              {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Get Started'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-700 dark:bg-gray-700 bg-gray-300" />
            <span className="px-3 text-xs text-gray-400 dark:text-gray-400 text-gray-600">or sign in with</span>
            <div className="flex-1 h-px bg-gray-700 dark:bg-gray-700 bg-gray-300" />
          </div>

          <div className="flex justify-center">
            <button onClick={handleGoogle} disabled={loading} className="border border-gray-600 dark:border-gray-600 border-gray-300 bg-dark-hover dark:bg-dark-hover bg-gray-50 text-white dark:text-white text-gray-900 rounded-xl py-2.5 px-6 hover:bg-dark-hover dark:hover:bg-dark-hover hover:bg-gray-100 hover:border-gray-500 dark:hover:border-gray-500 hover:border-gray-400 font-medium transition-colors disabled:opacity-60">
              Continue with Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-400 dark:text-gray-400 text-gray-600 mt-6">
            <button onClick={() => setIsRegister((v) => !v)} className="underline hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">
              {isRegister ? 'Have an account? Sign in' : 'New here? Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;


