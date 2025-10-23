import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/app-example/constants/api";
import Swal from "sweetalert2";

const KurirAmbilOrderan = () => {
  const [orderan, setOrderan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Ambil data orderan dari API
  const fetchOrderan = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await api.post("/input", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ DATA ORDERAN:", res.data);
      setOrderan(res.data.data || []);
    } catch (err: any) {
      console.error("❌ Gagal memuat orderan:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memuat data orderan.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderan();
  }, []);

  // 🔹 Ambil orderan
  const handleAmbilOrderan = async (id: number) => {
  try {
    // Ambil data user yang sedang login
    const userData = await AsyncStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Data kurir tidak ditemukan. Silakan login ulang.",
      });
      return;
    }

    // Kirim permintaan klaim ke backend dengan id kurir
    const res = await api.post(`/input/${id}/claim`, {
      kurir_id: user.id, // ✅ kirim id kurir
    });

    if (!res.data.success) {
      Swal.fire({
        icon: "warning",
        title: "Gagal",
        text: res.data.message,
      });
      return;
    }

    // Update status order jadi "dalam proses"
    await api.put(`/ordered/${id}`, { status: "dalam proses" });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `Orderan berhasil diambil oleh ${user.name}`,
    });

    fetchOrderan(); // refresh data
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Terjadi kesalahan saat mengambil orderan.",
    });
  }
};

  // const handleAmbilOrderan = async (id: number) => {
  //   try {
  //     const res = await api.post(`/input/${id}/claim`);
  //     if (!res.data.success) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Gagal",
  //         text: res.data.message,
  //       });
  //       return;
  //     }

  //     await api.put(`/ordered/${id}`, { status: "dalam proses" });
  //     Swal.fire({
  //       icon: "success",
  //       title: "Berhasil!",
  //       text: "Orderan berhasil diambil.",
  //     });
  //     fetchOrderan();
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Terjadi kesalahan saat mengambil orderan.",
  //     });
  //   }
  // };

  // 🔹 Konfirmasi sebelum ambil orderan
  const ambilOrderan = (id: number) => {
    Swal.fire({
      title: "Ambil Orderan Ini?",
      text: "Yakin ingin mengambil orderan ini untuk dikirim?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAmbilOrderan(id);
      }
    });
  };

  // 🔹 Tampilan tiap item
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.nama_pengirim} → {item.nama_penerima}
      </Text>
      <Text style={styles.text}>📦 {item.jenis_barang}</Text>
      <Text style={styles.text}>🏠 {item.alamat_penerima}</Text>
      <Text style={styles.text}>📞 {item.no_telp_penerima}</Text>

      <Pressable style={styles.button} onPress={() => ambilOrderan(item.id)}>
        <Text style={styles.buttonText}>Antar</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Memuat orderan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orderan}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={fetchOrderan}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada orderan tersedia</Text>
        }
      />
    </View>
  );
};

export default KurirAmbilOrderan;

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
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
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
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert, StyleSheet } from "react-native";
// // import axios from "axios";
// import AwesomeAlert from "react-native-awesome-alerts";
// import api from "@/app-example/constants/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Pressable } from "react-native";

// const KurirAmbilOrderan = () => {
//   const [orderan, setOrderan] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchOrderan = async () => {
//   try {
//     setLoading(true);
//     const token = await AsyncStorage.getItem("token");

//     // 🔹 Samakan dengan cara ambil data di DataOrder
//     const res = await api.post("/input", null, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     console.log("✅ DATA ORDERAN:", res.data);

//     // kalau API kamu formatnya { data: [...] }
//     setOrderan(res.data.data || []);

//     // kalau langsung array, pakai ini:
//     // setOrderan(Array.isArray(res.data) ? res.data : res.data.data || []);

//   } catch (err: any) {
//     console.error("❌ Gagal memuat orderan:", err.response?.data || err.message);
//     setAlertMessage("Gagal memuat data orderan");
//     setAlertVisible(true);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchOrderan();
//   }, []);
  
// const ambilOrderan = (id: number) => {
//   Alert.alert(
//     "Ambil Orderan Ini?",
//     "Yakin ingin mengambil orderan ini untuk dikirim?",
//     [
//       { text: "Batal", style: "cancel" },
//       {
//         text: "Ya, Ambil",
//         onPress: () => handleAmbilOrderan(id),
//       },
//     ]
//   );
// };

// const handleAmbilOrderan = async (id: number) => {
//   try {
//     const res = await api.post(`/input/${id}/claim`);
//     if (!res.data.success) {
//       setAlertMessage(res.data.message);
//       setAlertVisible(true);
//       return;
//     }

//     await api.put(`/ordered/${id}`, { status: "dalam proses" });
//     setAlertMessage("Orderan berhasil diambil!");
//     setAlertVisible(true);
//     fetchOrderan();
//   } catch (err) {
//     console.error(err);
//     setAlertMessage("Terjadi kesalahan saat mengambil orderan");
//     setAlertVisible(true);
//   }
// };

// //   const ambilOrderan = async (id: number) => {
// //     Alert.alert(
// //       "Ambil Orderan Ini?",
// //       "Yakin ingin mengambil orderan ini untuk dikirim?",
// //       [
// //         { text: "Batal", style: "cancel" },
// //         {
// //           text: "Ya, Ambil",
// //           onPress: async () => {
// //             try {
// //               const res = await api.post(`/input/${id}/claim`);
// //               if (!res.data.success) {
// //                 setAlertMessage(res.data.message);
// //                 setAlertVisible(true);
// //                 return;
// //               }

// //               await api.put(`/ordered/${id}`, {
// //                 status: "dalam proses",
// //               });

// //               setAlertMessage("Orderan berhasil diambil!");
// //               setAlertVisible(true);
// //               fetchOrderan();
// //             } catch (err) {
// //               console.error(err);
// //               setAlertMessage("Terjadi kesalahan saat mengambil orderan");
// //               setAlertVisible(true);
// //             }
// //           },
// //         },
// //       ]
// //     );
// //   };

//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>{item.nama_pengirim} → {item.nama_penerima}</Text>
//       <Text style={styles.text}>📦 {item.jenis_barang}</Text>
//       <Text style={styles.text}>🏠 {item.alamat_penerima}</Text>
//       <Text style={styles.text}>📞 {item.no_telp_penerima}</Text>

// <Pressable
//   style={styles.button}
//   onPress={() => ambilOrderan(item.id)}
//   pointerEvents="auto"
// >
//   <Text style={styles.buttonText}>Antar</Text>
// </Pressable>

// {/* <Pressable style={styles.button} onPress={() => ambilOrderan(item.id)}>
//   <Text style={styles.buttonText}>Antar</Text>
// </Pressable> */}

//       {/* <TouchableOpacity
//         style={styles.button}
//         onPress={() => ambilOrderan(item.id)}
//       >
//         <Text style={styles.buttonText}>Antar</Text>
//       </TouchableOpacity> */}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Memuat orderan...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={orderan}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         refreshing={refreshing}
//         onRefresh={fetchOrderan}
//         ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada orderan tersedia</Text>}
//       />

// <AwesomeAlert
//   show={alertVisible}
//   title="Informasi"
//   message={alertMessage}
//   closeOnTouchOutside={false}
//   closeOnHardwareBackPress={true}
//   showConfirmButton
//   confirmText="OK"
//   confirmButtonColor="#007bff"
//   onConfirmPressed={() => setAlertVisible(false)}
//   overlayStyle={{
//     backgroundColor: alertVisible ? "rgba(0,0,0,0.5)" : "transparent",
//     pointerEvents: alertVisible ? "auto" : "none", // ✅ ini penting
//   }}
// />


//       {/* <AwesomeAlert
//         show={alertVisible}
//         title="Informasi"
//         message={alertMessage}
//         // closeOnTouchOutside
//         closeOnTouchOutside={false}
//         closeOnHardwareBackPress={true}  
//         // closeOnHardwareBackPress
//         showConfirmButton
//         confirmText="OK"
//         confirmButtonColor="#007bff"
//         onConfirmPressed={() => setAlertVisible(false)}
//         overlayStyle={{ zIndex: 1, elevation: 1 }}
//       /> */}
//     </View>
//   );
// };

// export default KurirAmbilOrderan;

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
//   button: {
//     backgroundColor: "#007bff",
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
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
