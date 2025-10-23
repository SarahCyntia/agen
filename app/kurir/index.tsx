import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AwesomeAlert from "react-native-awesome-alerts";
// import { logout } from "@/app/logout";


const KurirIndex: React.FC = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = () => {
    setShowAlert(true);
  };

  const confirmLogout = async () => {
    setShowAlert(false);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  const goToAmbilOrderan = () => {
    router.push("/kurir/orderan"); // pastikan path ini sesuai file kamu
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Selamat Datang di Halaman Kurir</Text>
        <Text style={styles.subtitle}>Anda login sebagai Kurir</Text>

        {/* 🔹 Tombol ke halaman ambil orderan */}
        <TouchableOpacity
          style={styles.orderButton}
          onPress={goToAmbilOrderan}
          activeOpacity={0.8}
        >
          <Text style={styles.orderText}>Ambil Orderan</Text>
        </TouchableOpacity>

        {/* 🔹 Tombol logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Konfirmasi Logout"
        message="Yakin ingin logout?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Batal"
        confirmText="Logout"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={confirmLogout}
      />
    </SafeAreaView>
    
  );
};

export default KurirIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  inner: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  orderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
