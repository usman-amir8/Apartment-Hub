

import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function Index() {
  const { user, role, loading } = useContext(AuthContext);
  const router = useRouter();
  const hasNavigated = useRef(false); 

  useEffect(() => {
    if (loading || hasNavigated.current) return;

    if (!user) {
      router.replace('/auth/login');
    } else if (role === 'user') {
      router.replace('/user');
    } else if (role === 'realtor') {
      router.replace('/realtor');
    } else {
      router.replace('/auth/login');
    }

    hasNavigated.current = true; 
  }, [user, role, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
