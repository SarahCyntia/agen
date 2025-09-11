import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    // balik ke halaman login
    router.replace("/home/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selamat datang di Home 🎉</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
