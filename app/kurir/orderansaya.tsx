import api from "@/app-example/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

// ✅ Wrapper aman agar tidak error di web
const Wrapper = ({ children }: any) => {
  if (Platform.OS === "web") return <>{children}</>;
  return <AlertNotificationRoot>{children}</AlertNotificationRoot>;
};

const KurirOrderanSaya = () => {
  const [orderanSaya, setOrderanSaya] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data orderan berdasarkan kurir yang login
  const fetchOrderanSaya = async () => {
    try {
      setLoading(true);

      // 🔸 Ambil data user dari AsyncStorage
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      console.log("👤 Data user dari AsyncStorage:", user);

      if (!user || !user.id) {
        if (Platform.OS !== "web") {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Login Dulu",
            textBody: "Data kurir tidak ditemukan.",
            button: "OK",
          });
        } else {
          alert("Login dulu, data kurir tidak ditemukan.");
        }
        return;
      }

      // 🔹 Ambil data orderan dari backend Laravel
      const res = await api.post(`/ordered/${user.id}`);
      // console.log("📦 Respons orderan saya:", res.data);
      console.log(
        "📦 FULL RESPON DARI BACKEND:",
        JSON.stringify(res.data, null, 2)
      );

      // 🔍 Tangani berbagai bentuk respons dari Laravel
      let data: any[] = [];

      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data?.data) {
        data = res.data.data;
      } else if (res.data?.order) {
        data = res.data.order;
      } else if (res.data?.orders) {
        data = res.data.orders;
      }

      console.log("📊 Data hasil parsing:", data);

      // 🔹 Jika data kosong, tampilkan alert
      if (!data || data.length === 0) {
        console.warn("⚠️ Tidak ada data orderan untuk kurir ini.");
      }

      // 🔹 Filter status (opsional — bisa disesuaikan)
      const filteredData = data.filter(
        (item) =>
          item.status === "diproses" ||
          item.status === "dikirim" ||
          item.status === "selesai"
      );

      setOrderanSaya(filteredData.length ? filteredData : data);
    } catch (err: any) {
      console.error(
        "❌ Gagal memuat orderan saya:",
        err.response?.data || err.message
      );

      if (Platform.OS !== "web") {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Gagal",
          textBody: "Tidak bisa memuat orderan kamu.",
          button: "OK",
        });
      } else {
        alert("Gagal memuat orderan kamu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderanSaya();
  }, []);

  // 🔹 Tampilan setiap item orderan
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.nama_pengirim} → {item.nama_penerima}
      </Text>
      <Text style={styles.text}>📦 {item.jenis_barang}</Text>
      <Text style={styles.text}>🏠 {item.alamat_penerima}</Text>
      <Text style={styles.text}>📞 {item.no_telp_penerima}</Text>
      <Text
        style={[
          styles.status,
          item.status === "diproses"
            ? { color: "#ffc107" }
            : item.status === "dikirim"
            ? { color: "#17a2b8" }
            : { color: "#28a745" },
        ]}
      >
        🚚 Status: {item.status}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Memuat orderan kamu...</Text>
      </View>
    );
  }

  return (
    <Wrapper>
      <View style={styles.container}>
        <FlatList
          data={orderanSaya}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Belum ada orderan yang sedang diproses, dikirim, atau selesai.
            </Text>
          }
          onRefresh={fetchOrderanSaya}
          refreshing={loading}
        />
      </View>
    </Wrapper>
  );
};

export default KurirOrderanSaya;

//
// ✅ Styling rapi dan konsisten
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    color: "#555",
    marginBottom: 2,
  },
  status: {
    marginTop: 8,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import api from "@/app-example/constants/api";
// import {
//   AlertNotificationRoot,
//   ALERT_TYPE,
//   Dialog,
// } from "react-native-alert-notification";

// // 🔹 Wrapper aman agar tidak error di web
// const Wrapper = ({ children }: any) => {
//   if (Platform.OS === "web") return <>{children}</>;
//   return <AlertNotificationRoot>{children}</AlertNotificationRoot>;
// };

// const KurirOrderanSaya = () => {
//   const [orderanSaya, setOrderanSaya] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Ambil data orderan yang diklaim oleh kurir login
//   const fetchOrderanSaya = async () => {
//     try {
//       setLoading(true);

//       // Ambil data user dari AsyncStorage
//       const userData = await AsyncStorage.getItem("user");
//       const user = userData ? JSON.parse(userData) : null;

//       if (!user || !user.token) {
//         if (Platform.OS !== "web") {
//           Dialog.show({
//             type: ALERT_TYPE.WARNING,
//             title: "Login Dulu",
//             textBody: "Data kurir tidak ditemukan.",
//             button: "OK",
//           });
//         } else {
//           alert("Login dulu, data kurir tidak ditemukan.");
//         }
//         return;
//       }

//       // 🔹 Panggil endpoint claim (GET)
//       const res = await api.get("/claim", {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });

//       console.log("📦 Respons orderan saya:", res.data);

//       // 🔍 Tangani bentuk respons dari Laravel
//       const data = res.data?.data || [];
//       setOrderanSaya(data);
//     } catch (err: any) {
//       console.error("❌ Gagal memuat orderan saya:", err.response?.data || err.message);
//       if (Platform.OS !== "web") {
//         Dialog.show({
//           type: ALERT_TYPE.DANGER,
//           title: "Gagal",
//           textBody: "Tidak bisa memuat orderan kamu.",
//           button: "OK",
//         });
//       } else {
//         alert("Gagal memuat orderan kamu.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrderanSaya();
//   }, []);

//   // 🔹 Tampilan setiap item orderan
//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>
//         {item.nama_pengirim} → {item.nama_penerima}
//       </Text>
//       <Text style={styles.text}>📦 {item.jenis_barang}</Text>
//       <Text style={styles.text}>🏠 {item.alamat_penerima}</Text>
//       <Text style={styles.text}>📞 {item.no_telp_penerima}</Text>
//       <Text style={styles.status}>🚚 Status: {item.status}</Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Memuat orderan kamu...</Text>
//       </View>
//     );
//   }

//   return (
//     <Wrapper>
//       <View style={styles.container}>
//         <FlatList
//           data={orderanSaya}
//           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//           renderItem={renderItem}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               Belum ada orderan yang kamu ambil.
//             </Text>
//           }
//           onRefresh={fetchOrderanSaya}
//           refreshing={loading}
//         />
//       </View>
//     </Wrapper>
//   );
// };

// export default KurirOrderanSaya;

// // ✅ Styling rapi
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     padding: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   text: {
//     color: "#555",
//     marginBottom: 2,
//   },
//   status: {
//     marginTop: 8,
//     fontWeight: "bold",
//     color: "#007bff",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#777",
//   },
// });
