import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { db } from '../../../firebase/firebaseConfig';

const EditApartment = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchApartment = async () => {
      const docRef = doc(db, 'apartments', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description || '');
        setPrice(data.price.toString());
      } else {
        Alert.alert("Error", "Apartment not found");
        router.back();
      }
    };

    fetchApartment();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !price) {
      Alert.alert('Please fill in all required fields');
      return;
    }
    try {
      const docRef = doc(db, 'apartments', id as string);
      await updateDoc(docRef, {
        title,
        description,
        price: Number(price),
      });
      Alert.alert('Apartment updated successfully');
      router.back();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Failed to update apartment');
    }
  };

  return (
    <View style={{ padding: 20 , marginTop : 30 }}>
      <Text>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10 }}
        multiline
      />
      <Text>Price:</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 20 }}
      />
      <Button title="Update Apartment" onPress={handleUpdate} />
    </View>
  );
};

export default EditApartment;
