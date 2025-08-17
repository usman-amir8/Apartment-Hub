

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { db } from '../../firebase/firebaseConfig';

export default function BrowseApartmentsScreen() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const cached = await AsyncStorage.getItem('cachedApartments');
        if (cached) {
          setApartments(JSON.parse(cached));
        }

        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          console.warn('Offline mode: using cached data');
          return;
        }

        const snapshot = await getDocs(collection(db, 'apartments'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApartments(data);
        await AsyncStorage.setItem('cachedApartments', JSON.stringify(data));
      } catch (err) {
        console.error('Failed to fetch apartments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#0077b6" />;
  if (apartments.length === 0)
    return <Text style={styles.empty}>No apartments available at the moment.</Text>;

  return (
    <FlatList
      data={apartments}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/user/apartment/${item.id}` as any)}>
          <View style={styles.card}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.meta}>
              📅 {item.createdAt ? formatDate(item.createdAt) : 'Unknown'}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

function formatDate(createdAt: any) {
  let date: Date | null = null;

  if (!createdAt) return 'Unknown';
  if (createdAt.toDate && typeof createdAt.toDate === 'function') date = createdAt.toDate();
  else if (typeof createdAt === 'number') date = new Date(createdAt);
  else if (typeof createdAt === 'string') {
    const parsedDate = new Date(createdAt);
    if (!isNaN(parsedDate.getTime())) date = parsedDate;
  }

  return date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : 'Unknown';
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    marginTop : 30
  },
  card: {
    backgroundColor: '#fefefe',
    padding: 18,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#009688',
    fontWeight: '600',
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});
