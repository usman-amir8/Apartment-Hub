

import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/firebaseConfig';

interface Apartment {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  createdBy: string;
  createdAt?: any;
}

const MyApartments = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchMyApartments = async () => {
      const q = query(collection(db, 'apartments'), where('createdBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const myApartments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Apartment[];
      setApartments(myApartments);
    };

    fetchMyApartments();
  }, [user]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this apartment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'apartments', id));
              setApartments(prev => prev.filter(ap => ap.id !== id));
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert("Error", "Failed to delete apartment.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Apartment }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      <Text style={styles.price}>Price: ${item.price}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/realtor/editApartment/${item.id}` as any)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (apartments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no apartments listed.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={apartments}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 40,
    marginTop : 30
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  price: {
    fontWeight: '600',
    color: 'green',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#0a84ff',
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MyApartments;
