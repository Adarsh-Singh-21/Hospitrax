import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration is read from environment variables.
// For Create React App, variables must be prefixed with REACT_APP_.
// Create a .env.local file in the project root with your values, e.g.:
// REACT_APP_FIREBASE_API_KEY=...
// REACT_APP_FIREBASE_AUTH_DOMAIN=...
// REACT_APP_FIREBASE_PROJECT_ID=...
// REACT_APP_FIREBASE_STORAGE_BUCKET=...
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
// REACT_APP_FIREBASE_APP_ID=...
// REACT_APP_FIREBASE_MEASUREMENT_ID=...

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBxsn3j66wAyiaKesttNjdtb1AzcoQT3jo',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'hospitrax-9f0db.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'hospitrax-9f0db',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'hospitrax-9f0db.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '420440862611',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:420440862611:web:74ab81b3bdc6d1d26a0266',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-HCES529205',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;


