import api from "@/app-example/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

interface Riwayat {
  id: number;
  deskripsi: string;
  created_at: string;
}

interface Order {
  id: number;
  nama_pengirim: string;
  alamat_pengirim: string;
  nama_penerima: string;
  alamat_penerima: string;
  no_resi: string;
  status: string;
  riwayat: Riwayat[];
}

export default function DataOrder() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [riwayatVisible, setRiwayatVisible] = useState(false);
  const [riwayatData, setRiwayatData] = useState<Riwayat[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await api.post("/input", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data || []);
    } catch (err: any) {
      console.error("❌ Gagal ambil data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (waktu: string) => {
    const date = new Date(waktu);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openRiwayat = (riwayat: Riwayat[]) => {
    setRiwayatData(riwayat);
    setRiwayatVisible(true);
  };

  const renderRow = ({ item, index }: { item: Order; index: number }) => (
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { width: 60 }]}>
        <Text>{index + 1}</Text>
      </View>
      <View style={[styles.tableCell, { width: 120 }]}>
        <Text>{item.nama_pengirim}</Text>
      </View>
      <View style={[styles.tableCell, { width: 150 }]}>
        <Text>{item.alamat_pengirim}</Text>
      </View>
      <View style={[styles.tableCell, { width: 120 }]}>
        <Text>{item.nama_penerima}</Text>
      </View>
      <View style={[styles.tableCell, { width: 150 }]}>
        <Text>{item.alamat_penerima}</Text>
      </View>
      <View style={[styles.tableCell, { width: 130 }]}>
        <Text>{item.no_resi}</Text>
      </View>
      {/* <View style={[styles.tableCell, { width: 90 }]}>
        <Text>{item.status}</Text>
      </View> */}
      {/* <View style={[styles.tableCell, { width: 90 }]}><Text>Lihat</Text></View> */}

      {/* Status */}
      <View style={[styles.tableCell, { flex: 0.8 }]}>
        <Text style={item.status === "selesai" ? styles.done : styles.pending}>
          {item.status}
        </Text>
      </View>

      {/* Riwayat */}
      <View style={[styles.tableCell, { flex: 1 }]}>
        {Array.isArray(item.riwayat) && item.riwayat.length > 0 ? (
          <TouchableOpacity
            style={styles.buttonRiwayat}
            onPress={() => openRiwayat(item.riwayat)}
          >
            <Text style={styles.buttonText}>Lihat</Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={{ fontStyle: "italic", color: "#777", textAlign: "center" }}
          >
            Kosong
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Data Pengiriman</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : orders.length > 0 ? (
        <ScrollView horizontal>
          <View>
            {/* Header Tabel */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellHeader, { width: 60 }]}>No</Text>
              <Text style={[styles.tableCellHeader, { width: 120 }]}>
                Pengirim
              </Text>
              <Text style={[styles.tableCellHeader, { width: 150 }]}>
                Alamat Pengirim
              </Text>
              <Text style={[styles.tableCellHeader, { width: 120 }]}>
                Penerima
              </Text>
              <Text style={[styles.tableCellHeader, { width: 150 }]}>
                Alamat Penerima
              </Text>
              <Text style={[styles.tableCellHeader, { width: 130 }]}>
                No Resi
              </Text>
              <Text style={[styles.tableCellHeader, { width: 90 }]}>
                Status
              </Text>
              <Text style={[styles.tableCellHeader, { width: 90 }]}>
                Riwayat
              </Text>
            </View>
            {/* <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellHeader, { flex: 0.3 }]}>No</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Pengirim</Text>
              <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Alamat Pengirim</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Penerima</Text>
              <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Alamat Penerima</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>No Resi</Text>
              <Text style={[styles.tableCellHeader, { flex: 0.8 }]}>Status</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Riwayat</Text>
            </View> */}

            {/* Isi Tabel */}
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRow}
            />
          </View>
        </ScrollView>
      ) : (
        <Text>Tidak ada data</Text>
      )}

      {/* Modal Riwayat */}
      <Modal
        visible={riwayatVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRiwayatVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🕒 Riwayat Pengiriman</Text>
            <FlatList
              data={riwayatData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.riwayatItem}>
                  <Text>
                    {index + 1}. {item.deskripsi}
                  </Text>
                  <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                </View>
              )}
            />
            <Button title="Tutup" onPress={() => setRiwayatVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 2,
    borderBottomColor: "#555",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableCellHeader: {
    padding: 8,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  tableCell: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },

  // tableCell: {
  //   padding: 8,
  //   borderRightWidth: 1,
  //   borderRightColor: "#ddd",
  //   textAlign: "center",
  // },
  done: {
    backgroundColor: "green",
    color: "white",
    paddingVertical: 4,
    borderRadius: 4,
    textAlign: "center",
  },
  pending: {
    backgroundColor: "orange",
    color: "white",
    paddingVertical: 4,
    borderRadius: 4,
    textAlign: "center",
  },
  buttonRiwayat: {
    backgroundColor: "#3b82f6",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "center",
  },
  buttonText: { color: "white", fontSize: 12, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  riwayatItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  date: { fontSize: 12, color: "gray" },
});

// import api from "@/app-example/constants/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Icon from "react-native-vector-icons/FontAwesome";

// interface Riwayat {
//   id: number;
//   deskripsi: string;
//   created_at: string;
// }

// interface Order {
//   id: number;
//   nama_pengirim: string;
//   alamat_pengirim: string;
//   nama_penerima: string;
//   alamat_penerima: string;
//   no_resi: string;
//   status: string;
//   riwayat: Riwayat[];
// }

// export default function DataOrder() {
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState<Order[]>([]);

//   // modal riwayat
//   const [riwayatVisible, setRiwayatVisible] = useState(false);
//   const [riwayatData, setRiwayatData] = useState<Riwayat[]>([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");

//       const res = await api.post("/input", null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(res.data.data || []);
//     } catch (err: any) {
//       console.error("❌ Gagal ambil data:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // format tanggal Indonesia
//   const formatDate = (waktu: string) => {
//     const date = new Date(waktu);
//     return date.toLocaleString("id-ID", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // buka modal riwayat
//   const openRiwayat = (riwayat: Riwayat[]) => {
//     setRiwayatData(riwayat);
//     setRiwayatVisible(true);
//   };

//   const renderRow = ({ item, index }: { item: Order; index: number }) => (
//    <View style={styles.row}>
//   <Text style={[styles.cell, { flex: 0.3 }]}>{index + 1}</Text>
//   <Text style={[styles.cell, { flex: 1 }]}>{item.nama_pengirim}</Text>
//   <Text style={[styles.cell, { flex: 1.5 }]}>{item.alamat_pengirim}</Text>
//   <Text style={[styles.cell, { flex: 1 }]}>{item.nama_penerima}</Text>
//   <Text style={[styles.cell, { flex: 1.5 }]}>{item.alamat_penerima}</Text>
//   <Text style={[styles.cell, { flex: 1 }]}>{item.no_resi}</Text>

//   {/* Status */}
//   <View style={[styles.cell, { flex: 0.8, alignItems: "center" }]}>
//     <Text style={item.status === "selesai" ? styles.done : styles.pending}>
//       {item.status}
//     </Text>
//   </View>

//   {/* Riwayat */}
//   <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
//     {Array.isArray(item.riwayat) && item.riwayat.length > 0 ? (
//       <TouchableOpacity
//         style={styles.buttonRiwayat}
//         onPress={() => openRiwayat(item.riwayat)}
//       >
//         <Text style={styles.buttonText}>Lihat Riwayat</Text>
//       </TouchableOpacity>
//     ) : (
//       <Text style={{ fontStyle: "italic", color: "#777" }}>
//         Belum ada riwayat
//       </Text>
//     )}
//   </View>
// </View>

//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📋 Halaman Data Input</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : orders.length > 0 ? (
//         <ScrollView horizontal>
//           <View style={{ flex: 1 }}>
//             {/* Header */}
//             <View style={styles.headerRow}>
//               <Text style={styles.headerCell}>No</Text>
//               <Text style={styles.headerCell}>Pengirim</Text>
//               <Text style={styles.headerCell}>Alamat Pengirim</Text>
//               <Text style={styles.headerCell}>Penerima</Text>
//               <Text style={styles.headerCell}>Alamat Penerima</Text>
//               <Text style={styles.headerCell}>No Resi</Text>
//               <Text style={styles.headerCell}>Status</Text>
//               <Text style={styles.headerCell}>Riwayat</Text>
//             </View>

//             {/* Data */}
//             <FlatList
//               data={orders}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={renderRow}
//             />
//           </View>
//         </ScrollView>
//       ) : (
//         <Text>Tidak ada data</Text>
//       )}

//       {/* Modal Riwayat */}
//       <Modal
//         visible={riwayatVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setRiwayatVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Detail Riwayat</Text>

//             <FlatList
//               data={riwayatData}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item, index }) => (
//                 <View style={styles.riwayatItem}>
//                   <Text>
//                     {index + 1}. {item.deskripsi}
//                   </Text>
//                   <Text style={styles.date}>{formatDate(item.created_at)}</Text>
//                 </View>
//               )}
//             />

//             <Button title="Tutup" onPress={() => setRiwayatVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   headerRow: {
//     flexDirection: "row",
//     borderBottomWidth: 2,
//     borderBottomColor: "#444",
//     paddingVertical: 8,
//     backgroundColor: "#f1f1f1",
//   },
//   headerCell: {
//     flex: 1,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     paddingVertical: 8,
//   },
//   cell: {
//     paddingHorizontal: 6,
//     justifyContent: "center",
//     textAlign: "center",
//   },
//   done: {
//     backgroundColor: "green",
//     color: "white",
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//     overflow: "hidden",
//     textAlign: "center",
//     minWidth: 70,
//   },
//   pending: {
//     backgroundColor: "orange",
//     color: "white",
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//     overflow: "hidden",
//     textAlign: "center",
//     minWidth: 70,
//   },
//   buttonRiwayat: {
//     backgroundColor: "#f4a261",
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     marginHorizontal: 4,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     margin: 20,
//     padding: 20,
//     borderRadius: 10,
//     maxHeight: "80%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   riwayatItem: {
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     paddingBottom: 5,
//   },
//   date: { fontSize: 12, color: "gray" },
// });
