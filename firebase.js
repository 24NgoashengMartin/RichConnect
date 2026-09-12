import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwz-a5HOoEPi-AvSm7m5lPiOfwJJ9aNqk",
  authDomain: "richconnect-b283e.firebaseapp.com",
  projectId: "richconnect-b283e",
  storageBucket: "richconnect-b283e.firebasestorage.app",
  messagingSenderId: "938895229066",
  appId: "1:938895229066:web:dd8bfaace519bb34c82d73"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);