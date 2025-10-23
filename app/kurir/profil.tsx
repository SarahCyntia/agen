import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const KurirProfileScreen = () => {
  const [kurir, setKurir] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadKurir = async () => {
      try {
        const data = await AsyncStorage.getItem("user");
        if (data) {
          const parsed = JSON.parse(data);
          setKurir(parsed);
        }
      } catch (error) {
        console.log("Gagal memuat data user:", error);
      }
    };
    loadKurir();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  // Handle role agar tidak error jika object
  const roleName =
    kurir?.role?.name || kurir?.role_name || "Kurir";

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            kurir?.photo ||
            "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{kurir?.name || "Kurir"}</Text>
      <Text style={styles.email}>{kurir?.email || "email@example.com"}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{roleName}</Text>

        <Text style={styles.label}>ID Kurir:</Text>
        <Text style={styles.value}>{kurir?.uuid || "-"}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            { color: kurir?.status === "nonaktif" ? "#dc3545" : "#28a745" },
          ]}
        >
          {kurir?.status || "Aktif"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#17a2b8" }]}
        onPress={() => router.push("/kurir/riwayat") }
      >
        <Text style={styles.buttonText}>Lihat Riwayat Pengiriman</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={() => router.push("/kurir/orderan")}
      >
        <Text style={styles.buttonText}>Mulai Antar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc3545" }]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default KurirProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  email: {
    color: "#555",
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    marginVertical: 20,
    elevation: 2,
  },
  label: {
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
