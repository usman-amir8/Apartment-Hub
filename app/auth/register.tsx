
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase/firebaseConfig';

import Button from '../../components/ui/button';
import TextInput from '../../components/ui/textInput';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'realtor' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!role) {
      Alert.alert('Select Role', 'Please choose either User or Realtor.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      await setDoc(doc(db, 'users', uid), {
        email,
        role,
      });

      router.replace(role === 'user' ? '/user' : '/realtor');
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleContainer}>
        
        <TouchableOpacity
  style={[styles.roleButton, role === 'user' && styles.selectedRole]}
  onPress={() => setRole('user')}
>
  <Text
    style={[
      styles.roleText,
      role === 'user' && styles.selectedRoleText,
    ]}
  >
    User
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.roleButton, role === 'realtor' && styles.selectedRole]}
  onPress={() => setRole('realtor')}
>
  <Text
    style={[
      styles.roleText,
      role === 'realtor' && styles.selectedRoleText,
    ]}
  >
    Realtor
  </Text>
</TouchableOpacity>

      </View>

      <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} loading={loading} />

      <Button
        title="Already have an account? Login"
        onPress={() => router.push('/auth/login')}
        variant="secondary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#0077b6' },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#0077b6',
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#e0f0ff',
  },
  selectedRole: {
    backgroundColor: '#0077b6',
  },
  
  roleText: {
  color: '#0077b6',
  fontWeight: '600',
  fontSize: 16,
},
selectedRoleText: {
  color: '#fff',
}

});
