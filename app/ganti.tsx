import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    // Reset navigation agar tidak bisa kembali ke Home dengan tombol back
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Selamat Datang di Home!</Text>
      <Text style={styles.subtitle}>Kamu berhasil login</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F4FF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 2, // efek shadow di Android
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});