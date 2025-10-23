import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/app-example/constants/api"; // ganti sesuai path api kamu
import Swal from "sweetalert2";
import { useRouter } from "expo-router";

export default function RiwayatScreen() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await api.get("/paket-riwayat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRiwayat(res.data.data || []);
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  const showDetail = (item: any) => {
    Swal.fire({
      title: "Detail Pengiriman",
      html: `
        <div style="text-align: left;">
          <p><b>No Resi:</b> ${item.no_resi || "-"}</p>
          <p><b>Nama Pengirim:</b> ${item.nama_pengirim || "-"}</p>
          <p><b>Nama Penerima:</b> ${item.nama_penerima || "-"}</p>
          <p><b>Status:</b> ${item.status || "-"}</p>
          <p><b>Tanggal:</b> ${formatDate(item.created_at)}</p>
        </div>
      `,
      confirmButtonText: "Tutup",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Memuat riwayat...</Text>
      </View>
    );
  }

  if (riwayat.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Tidak ada riwayat pengiriman.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Pengiriman</Text>
      <FlatList
        data={riwayat}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => showDetail(item)}
          >
            <Text style={styles.resi}>No. Resi: {item.no_resi}</Text>
            <Text style={styles.text}>Pengirim: {item.nama_pengirim}</Text>
            <Text style={styles.text}>Penerima: {item.nama_penerima}</Text>
            <Text style={[styles.status, getStatusStyle(item.status)]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "menunggu":
      return { color: "#ffc107" };
    case "dalam proses":
      return { color: "#007bff" };
    case "selesai":
      return { color: "#28a745" };
    default:
      return { color: "#6c757d" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  resi: {
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    color: "#333",
  },
  status: {
    marginTop: 5,
    fontWeight: "600",
  },
});









// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import api from "@/app-example/constants/api"; // ganti sesuai path axios instance kamu
// import AwesomeAlert from "react-native-awesome-alerts"; // alternatif SweetAlert di mobile

// interface RiwayatItem {
//   id: number;
//   nama_pengirim: string;
//   alamat_pengirim: string;
//   nama_penerima: string;
//   alamat_penerima: string;
//   no_resi: string;
//   status: string;
//   rating?: number;
//   ulasan?: string;
//   riwayat?: {
//     id_riwayat: number;
//     deskripsi: string;
//     created_at: string;
//   }[];
// }

// const KurirRiwayatScreen = () => {
//   const [data, setData] = useState<RiwayatItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertTitle, setAlertTitle] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");

//   const fetchRiwayat = async () => {
//     try {
//       const res = await api.get("/paket-riwayat"); // endpoint dari Laravel
//       setData(res.data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRiwayat();
//   }, []);

//   const formatDate = (waktu: string | null | undefined) => {
//     if (!waktu) return "-";
//     const date = new Date(waktu);
//     if (isNaN(date.getTime())) return "-";
//     return date.toLocaleString("id-ID", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const showDetailRiwayat = (riwayat?: RiwayatItem["riwayat"]) => {
//     if (!riwayat || riwayat.length === 0) {
//       setAlertTitle("Riwayat Pengiriman");
//       setAlertMessage("Belum ada riwayat pengiriman.");
//       setAlertVisible(true);
//       return;
//     }

//     const list = riwayat
//       .map(
//         (item, i) =>
//           `${i + 1}. ${item.deskripsi} (${formatDate(item.created_at)})`
//       )
//       .join("\n");

//     setAlertTitle("Detail Riwayat");
//     setAlertMessage(list);
//     setAlertVisible(true);
//   };

//   const showDetailOrder = (item: RiwayatItem) => {
//     const detail = `
//     📦 No Resi: ${item.no_resi}
//     Pengirim: ${item.nama_pengirim}
//     Penerima: ${item.nama_penerima}
//     Alamat Asal: ${item.alamat_pengirim}
//     Alamat Tujuan: ${item.alamat_penerima}
//     Status: ${item.status}
//     `;
//     setAlertTitle("Detail Order");
//     setAlertMessage(detail);
//     setAlertVisible(true);
//   };

//   const showPenilaian = (item: RiwayatItem) => {
//     if (item.rating || item.ulasan) {
//       const text = `⭐ Rating: ${item.rating ?? "-"}\n💬 Ulasan: ${
//         item.ulasan ?? "-"
//       }`;
//       setAlertTitle("Detail Penilaian");
//       setAlertMessage(text);
//       setAlertVisible(true);
//     } else {
//       setAlertTitle("Penilaian");
//       setAlertMessage("Belum ada penilaian untuk pengiriman ini.");
//       setAlertVisible(true);
//     }
//   };

//   const renderItem = ({ item }: { item: RiwayatItem }) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>{item.nama_pengirim} ➜ {item.nama_penerima}</Text>
//       <Text style={styles.sub}>No. Resi: {item.no_resi}</Text>
//       <Text style={styles.status}>
//         Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//       </Text>

//       <View style={styles.actions}>
//         <TouchableOpacity
//           style={[styles.btn, { backgroundColor: "#ffc107" }]}
//           onPress={() => showDetailRiwayat(item.riwayat)}
//         >
//           <Text style={styles.btnText}>Lihat Riwayat</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, { backgroundColor: "#17a2b8" }]}
//           onPress={() => showDetailOrder(item)}
//         >
//           <Text style={styles.btnText}>Detail Order</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, { backgroundColor: "#6c757d" }]}
//           onPress={() => showPenilaian(item)}
//         >
//           <Text style={styles.btnText}>Penilaian</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Memuat data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>📦 Riwayat Pengiriman</Text>

//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       <AwesomeAlert
//         show={alertVisible}
//         title={alertTitle}
//         message={alertMessage}
//         closeOnTouchOutside
//         closeOnHardwareBackPress
//         showConfirmButton
//         confirmText="Tutup"
//         confirmButtonColor="#007bff"
//         onConfirmPressed={() => setAlertVisible(false)}
//       />
//     </View>
//   );
// };

// export default KurirRiwayatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     padding: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   sub: {
//     color: "#555",
//   },
//   status: {
//     marginTop: 5,
//     color: "#007bff",
//   },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//   },
//   btn: {
//     flex: 1,
//     marginHorizontal: 5,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });
