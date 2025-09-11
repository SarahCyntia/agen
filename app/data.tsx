import api from "@/app-example/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DataOrder() {
  const [input, setInput] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Ini penting

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await api.post("/input");
      // const res = await api.post("/input", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      setInput(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await api.get("/input ");
  //     setInput(res.data);
  //   } catch (error) {
  //     console.error("Gagal fetch data", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Halaman Data Input</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>No</Text>
              <Text style={styles.headerCell}>Pengirim</Text>
              <Text style={styles.headerCell}>Alamat Pengirim</Text>
              <Text style={styles.headerCell}>Penerima</Text>
              <Text style={styles.headerCell}>Alamat Penerima</Text>
              <Text style={styles.headerCell}>No Resi</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Riwayat</Text>
            </View>

            {/* Render data di sini */}
            {Array.isArray(input) &&
              input.map((item, index) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{item.nama_pengirim}</Text>
                  <Text style={styles.cell}>{item.alamat_pengirim}</Text>
                  <Text style={styles.cell}>{item.nama_penerima}</Text>
                  <Text style={styles.cell}>{item.alamat_penerima}</Text>
                  <Text style={styles.cell}>{item.no_resi}</Text>
                  <Text
                    style={[
                      styles.cell,
                      item.status === "selesai" ? styles.done : styles.pending,
                    ]}
                  >
                    {item.status}
                  </Text>
                  <Text style={styles.cell}>
                    {Array.isArray(item.riwayat) && item.riwayat.length > 0
                      ? "Detail Riwayat"
                      : "Belum ada riwayat"}
                  </Text>
                </View>
              ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    width: 120,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 6,
  },
  cell: {
    width: 120,
    color: "#555",
  },
  done: {
    backgroundColor: "green",
    color: "white",
    padding: 4,
    borderRadius: 4,
  },
  pending: {
    backgroundColor: "orange",
    color: "white",
    padding: 4,
    borderRadius: 4,
  },
});
