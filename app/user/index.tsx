


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SafeAreaLayout from '../../components/SafeAreaLayout';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase/firebaseConfig';

import Button from '../../components/ui/button';

export default function UserHome() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');  
      await AsyncStorage.removeItem('role');  
      router.replace('/auth/login');
    } catch (err: any) {
      console.error('Logout error:', err.message || err);
    }
  };

  return (
    <SafeAreaLayout>
      <View style={styles.container}>
        <Text style={styles.title}>
          👤 Welcome, {user?.email || 'User'}!
        </Text>

        <Button title="Browse Apartments" onPress={() => router.push('/user/browseApartments')} />

        <Button 
          title="Logout" 
          onPress={handleLogout} 
          variant="primary"
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 36, 
    textAlign: 'center',
    color: '#0077b6',
  },
});
