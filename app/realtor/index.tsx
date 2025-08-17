


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SafeAreaLayout from '../../components/SafeAreaLayout';
import Button from '../../components/ui/button';
import { AuthContext, useAuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase/firebaseConfig';

export default function RealtorHome() {
  const { user } = useContext(AuthContext);
  const router = useRouter();


 const { setUser, setRole } = useAuthContext();
const handleLogout = async () => {
 

  try {
    await signOut(auth);

    await AsyncStorage.removeItem('@myapp_user');
    await AsyncStorage.removeItem('@myapp_role');

    setUser(null);
    setRole(null);

    router.replace('/auth/login');
  } catch (err: any) {
    console.error('Logout error:', err.message || err);
  }
};


  return (
    <SafeAreaLayout>
        
      <View style={styles.container}>
        <Text style={styles.title}>🏠 Welcome, Realtor {user?.email || ''}</Text>

       
  <Button style={styles.button} title=' View My Apartments' onPress={() => router.push('/realtor/myApartments')}>
         
        </Button>
        <Button style={styles.button} title='Add New Apartment' onPress={() => router.push('/realtor/addApartment')}>
          
        </Button>

      
         <Button style={styles.button}title=' Logout' onPress={handleLogout} variant="primary">
         
        </Button>
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
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#023047',
  },
  button: {
    width: '80%',
    marginVertical: 8,
  },
});
