
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useAuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/firebaseConfig';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djguevz9c/upload';
const CLOUDINARY_UPLOAD_PRESET = 'glixen_upload'; 

export default function AddApartment() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Need access to your photos to upload');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.secure_url;
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !imageUri) {
      Alert.alert('Missing fields', 'All fields must be filled and an image selected.');
      return;
    }

    if (!user) {
      Alert.alert('Not logged in', 'You must be logged in to add an apartment.');
      return;
    }

    if (isNaN(Number(price))) {
      Alert.alert('Invalid price', 'Please enter a valid number for price.');
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await uploadImageToCloudinary(imageUri);
      await addDoc(collection(db, 'apartments'), {
        title,
        description,
        price: Number(price),
        imageUrl: uploadedUrl,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Apartment added successfully!');
      router.replace('/realtor/myApartments');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to upload or save apartment');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🏠 Add New Apartment</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={5}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Price "
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>📷 Select Apartment Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      {uploading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>✅ Add Apartment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fdfdfd',
    flexGrow: 1,
    marginTop : 30
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
