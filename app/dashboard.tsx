import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // kalau user nggak ada → balik ke login
          router.replace("/login");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Gagal memuat data user");
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  // ambil roleName dengan aman
  const roleName =
    typeof user?.role === "object" ? user?.role?.name : user?.role;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Dashboard Agen</Text>

      {user && (
        <View style={styles.card}>
          <Text style={styles.text}>
            Halo, <Text style={styles.bold}>{user.name}</Text>
          </Text>
          {/* <Text style={styles.text}>
            Role: <Text style={styles.bold}>{roleName}</Text>
          </Text> */}
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#007bff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    width: "90%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  bold: {
    fontWeight: "600",
    color: "#111",
  },
  logoutBtn: {
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
