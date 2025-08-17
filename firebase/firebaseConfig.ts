

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyChPT6D6EjxGEieroKw-IjPNAMQy_EHaf8",
  authDomain: "glixen-apartments.firebaseapp.com",
  projectId: "glixen-apartments",
  storageBucket: "glixen-apartments.firebasestorage.app",
  messagingSenderId: "946379299379",
  appId: "1:946379299379:web:ee4910c682ae6771cf6146",
  measurementId: "G-PFCXYVPH3F"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

