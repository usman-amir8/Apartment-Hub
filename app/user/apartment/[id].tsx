

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { db } from "../../../firebase/firebaseConfig";

export default function ApartmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [apartment, setApartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchApartment = async () => {
      try {
        const cacheKey = `apartment-${id}`;
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const cachedData = JSON.parse(cached);
          setApartment(cachedData);
        }

        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          console.warn("Offline mode: using cached apartment data");
          return;
        }

        const docRef = doc(db, "apartments", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          
          let realtorEmail = "Unknown";
          if (data.createdBy) {
            const userDoc = await getDoc(doc(db, "users", data.createdBy));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              realtorEmail = userData?.email || "Unknown";
            }
          }

          const combined = {
            ...data,
            realtorEmail,
          };

          setApartment(combined);
          await AsyncStorage.setItem(cacheKey, JSON.stringify(combined));
        } else {
          Alert.alert("Not found", "Apartment does not exist");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching apartment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!apartment) {
    return (
      <Text style={styles.errorText}>Apartment details not found.</Text>
    );
  }

  return (
    <View style={styles.container}>
      {apartment.imageUrl && (
        <Image source={{ uri: apartment.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.title}>{apartment.title}</Text>
      <Text style={styles.price}>${apartment.price}</Text>
      <Text style={styles.description}>{apartment.description}</Text>
      <Text style={styles.meta}>
        Posted by: {apartment.realtorEmail || "Unknown"}
        {"\n"}
        <DateText createdAt={apartment.createdAt} />
      </Text>
    </View>
  );
}

function DateText({ createdAt }: { createdAt: any }) {
  let date: Date | null = null;

  if (!createdAt) return <>Date: Unknown</>;

  if (createdAt.toDate && typeof createdAt.toDate === "function") {
    date = createdAt.toDate();
  } else if (typeof createdAt === "number") {
    date = new Date(createdAt);
  } else if (typeof createdAt === "string") {
    const parsedDate = new Date(createdAt);
    if (!isNaN(parsedDate.getTime())) date = parsedDate;
  }

  if (!date) return <>Date: Unknown</>;

  return (
    <>
      Date: {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 20, color: "green", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 16 },
  meta: { fontSize: 14, color: "#555" },
  errorText: { padding: 20, textAlign: "center", color: "red" },
});
