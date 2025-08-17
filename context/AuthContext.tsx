

import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';

interface AuthContextProps {
  user: User | null;
  role: 'user' | 'realtor' | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setRole: React.Dispatch<React.SetStateAction<'user' | 'realtor' | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  loading: true,
  setUser: () => {},
  setRole: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const USER_KEY = '@myapp_user';
const ROLE_KEY = '@myapp_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'realtor' | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedUserString = await AsyncStorage.getItem(USER_KEY);
        const storedRole = await AsyncStorage.getItem(ROLE_KEY);

        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString);
          setUser(storedUser);
          setRole(storedRole as 'user' | 'realtor' | null);
        }
      } catch (error) {
        console.error('Failed to load user from AsyncStorage', error);
      } finally {
        setLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const fetchedRole = userDoc.data()?.role as 'user' | 'realtor' | null;
            setRole(fetchedRole);

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(firebaseUser));
            await AsyncStorage.setItem(ROLE_KEY, fetchedRole || '');
          } else {
            setRole(null);
            await AsyncStorage.removeItem(USER_KEY);
            await AsyncStorage.removeItem(ROLE_KEY);
          }
        } catch (e) {
          console.error('Error fetching role from Firestore:', e);
          setRole(null);
          await AsyncStorage.removeItem(USER_KEY);
          await AsyncStorage.removeItem(ROLE_KEY);
        }
      } else {
        setUser(null);
        setRole(null);
        await AsyncStorage.removeItem(USER_KEY);
        await AsyncStorage.removeItem(ROLE_KEY);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
