import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/app-example/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Email dan Password wajib diisi!");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.status) {
        const user = res.data.user;

        // ✅ Cek role user → pastikan agen
        const roleName = typeof user.role === "object" ? user.role.name : user.role;

        if (roleName !== "agen") {
          Alert.alert("Gagal", "Hanya role agen yang bisa login!");
          return;
        }

        console.log("Role:", roleName);

        // Simpan token & user
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // Arahkan ke dashboard
        router.replace("/");
      } else {
        Alert.alert("Gagal", res.data.message || "Email atau password salah");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.card}>
        <Image
          source={require("../assets/images/kurir.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>
          Masuk ke <Text style={styles.brand}>Kurir</Text>
        </Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  card: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  brand: {
    color: "#007bff",
    fontWeight: "bold",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f0f6ff",
    fontSize: 15,
    color: "#000",
    marginBottom: 10,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f6ff",
    borderRadius: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
