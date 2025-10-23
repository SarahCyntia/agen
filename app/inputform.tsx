import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import api from "@/app-example/constants/api";


export default function InputForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    // Data Pengirim
    nama_pengirim: "",
    alamat_pengirim: "",
    no_telp_pengirim: "",
    provinsi_asal: "",
    kota_asal: "",
    kecamatan_asal: "",

    // Data Penerima
    nama_penerima: "",
    alamat_penerima: "",
    no_telp_penerima: "",
    provinsi_tujuan: "",
    kota_tujuan: "",
    kecamatan_tujuan: "",

    // Data Barang
    jenis_barang: "",
    berat_barang: "",
    ekspedisi: "",
    jenis_layanan: "",
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [citiesOrigin, setCitiesOrigin] = useState<any[]>([]);
  const [citiesDestination, setCitiesDestination] = useState<any[]>([]);
  const [districtsOrigin, setDistrictsOrigin] = useState<any[]>([]);
  const [districtsDestination, setDistrictsDestination] = useState<any[]>([]);

  // --- API CALLS ---
  const fetchProvinces = async () => {
    try {
      const res = await api.get("/provinces");
      const formatted = Object.entries(res.data).map(([id, name]) => ({
        id: String(id),
        title: String(name),
      }));
      setProvinces(formatted);
    } catch {
      Toast.show({ type: "error", text1: "Gagal mengambil provinsi" });
    }
  };

  const fetchCities = async (
    provId: string,
    type: "origin" | "destination"
  ) => {
    try {
      const res = await api.get(`/cities/${provId}`);
      const formatted = Object.entries(res.data).map(([id, name]) => ({
        id: String(id),
        title: String(name),
      }));
      if (type === "origin") setCitiesOrigin(formatted);
      else setCitiesDestination(formatted);
    } catch {
      Toast.show({ type: "error", text1: "Gagal mengambil kota" });
    }
  };

  const fetchDistricts = async (
    cityId: string,
    type: "origin" | "destination"
  ) => {
    try {
      const res = await api.get(`/districts/${cityId}`);
      const formatted = Object.entries(res.data).map(([id, name]) => ({
        id: String(id),
        title: String(name),
      }));
      if (type === "origin") setDistrictsOrigin(formatted);
      else setDistrictsDestination(formatted);
    } catch {
      Toast.show({ type: "error", text1: "Gagal mengambil kecamatan" });
    }
  };

  // --- HOOKS ---
  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // const handleSubmit = async () => {
  //   try {
  //     const noResi = `RESI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  //     const payload = {
  //       ...form,
  //       berat_barang: parseFloat(form.berat_barang),
  //       no_resi: noResi,
  //       biaya: 0,
  //       status: "menunggu",
  //     };

  //     const res = await fetch("/input/store", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || "Gagal simpan data");
  //     }

  //     Alert.alert("Berhasil", `No Resi: ${noResi}`, [
  //       { text: "OK", onPress: () => router.push("/input") },
  //     ]);
  //   } catch (err: any) {
  //     Alert.alert("Error", err.message || "Terjadi kesalahan");
  //   }
  // };



  const handleSubmit = async () => {
  try {
    const noResi = `RESI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      nama_pengirim: form.nama_pengirim,
      alamat_pengirim: form.alamat_pengirim,
      no_telp_pengirim: form.no_telp_pengirim,
      asal_provinsi_id: form.provinsi_asal,
      asal_kota_id: form.kota_asal,
      asal_kecamatan_id: form.kecamatan_asal,

      nama_penerima: form.nama_penerima,
      alamat_penerima: form.alamat_penerima,
      no_telp_penerima: form.no_telp_penerima,
      tujuan_provinsi_id: form.provinsi_tujuan,
      tujuan_kota_id: form.kota_tujuan,
      tujuan_kecamatan_id: form.kecamatan_tujuan,

      jenis_barang: form.jenis_barang,
      berat_barang: parseFloat(form.berat_barang),
      ekspedisi: form.ekspedisi,
      jenis_layanan: form.jenis_layanan,

      biaya: 0,
      status: "menunggu",
    };

    // pakai axios instance biar baseURL benar
    // const res = await api.post("/input/store", payload);
    // const res = await api.post("/input", payload);
    await api.post("input/store", payload);
              
console.log("POST to:", api.defaults.baseURL + "/input/store");
console.log("Payload:", payload);


    Alert.alert("Berhasil", `No Resi: ${res.data.data.no_resi}`, [
      { text: "OK", onPress: () => router.push("/input") },
    ]);
  } catch (err) {
    console.error(err);
    Alert.alert("Error", err.response?.data?.message || "Terjadi kesalahan");
  }
};

// useEffect(() => {
//   ambilData();
// }, []);

// const ambilData = async () => {
//   const res = await api.get("input");
//   setData(res.data.data);
// };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tambah Order</Text>

      {/* Provinsi Asal */}
      <Text>Provinsi Asal</Text>
      <Picker
        selectedValue={form.provinsi_asal}
        onValueChange={(v) => {
          handleChange("provinsi_asal", v);
          fetchCities(v, "origin");
          setCitiesOrigin([]);
          setDistrictsOrigin([]);
        }}
        style={styles.picker}
      >
        <Picker.Item label="-- Pilih Provinsi --" value="" />
        {provinces.map((prov) => (
          <Picker.Item key={prov.id} label={prov.title} value={prov.id} />
        ))}
      </Picker>

      {/* Kota Asal */}
      <Text>Kota Asal</Text>
      <Picker
        selectedValue={form.kota_asal}
        onValueChange={(v) => {
          handleChange("kota_asal", v);
          fetchDistricts(v, "origin");
          setDistrictsOrigin([]);
        }}
        style={styles.picker}
      >
        <Picker.Item label="-- Pilih Kota --" value="" />
        {citiesOrigin.map((kota) => (
          <Picker.Item key={kota.id} label={kota.title} value={kota.id} />
        ))}
      </Picker>

      {/* Kecamatan Asal */}
      <Text>Kecamatan Asal</Text>
      <Picker
        selectedValue={form.kecamatan_asal}
        onValueChange={(v) => handleChange("kecamatan_asal", v)}
        style={styles.picker}
      >
        <Picker.Item label="-- Pilih Kecamatan --" value="" />
        {districtsOrigin.map((dist) => (
          <Picker.Item key={dist.id} label={dist.title} value={dist.id} />
        ))}
      </Picker>

      {/* Provinsi Tujuan */}
      <Text>Provinsi Tujuan</Text>
      <Picker
        selectedValue={form.provinsi_tujuan}
        onValueChange={(v) => {
          handleChange("provinsi_tujuan", v);
          fetchCities(v, "destination");
          setCitiesDestination([]);
          setDistrictsDestination([]);
        }}
        style={styles.picker}
      >
        <Picker.Item label="-- Pilih Provinsi --" value="" />
        {provinces.map((prov) => (
          <Picker.Item key={prov.id} label={prov.title} value={prov.id} />
        ))}
      </Picker>

      {/* Kota Tujuan */}
      <Text>Kota Tujuan</Text>
      <Picker
        selectedValue={form.kota_tujuan}
        onValueChange={(v) => {
          handleChange("kota_tujuan", v);
          fetchDistricts(v, "destination");
          setDistrictsDestination([]);
        }}
        style={styles.picker}
      >
        <Picker.Item label="-- Pilih Kota --" value="" />
        {citiesDestination.map((kota) => (
          <Picker.Item key={kota.id} label={kota.title} value={kota.id} />
        ))}
      </Picker>

      {/* Kecamatan Tujuan */}
      <Text>Kecamatan Tujuan</Text>
      <Picker
        selectedValue={form.kecamatan_tujuan}
        onValueChange={(v) => handleChange("kecamatan_tujuan", v)}
        style={styles.picker}
      >
        <Picker.Item label="-- Pilih Kecamatan --" value="" />
        {districtsDestination.map((dist) => (
          <Picker.Item key={dist.id} label={dist.title} value={dist.id} />
        ))}
      </Picker>

      {/* Input lainnya */}
      <TextInput
        style={styles.input}
        placeholder="Nama Pengirim"
        value={form.nama_pengirim}
        onChangeText={(v) => handleChange("nama_pengirim", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Alamat Pengirim"
        value={form.alamat_pengirim}
        onChangeText={(v) => handleChange("alamat_pengirim", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="No. Telp Pengirim"
        value={form.no_telp_pengirim}
        onChangeText={(v) => handleChange("no_telp_pengirim", v)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Nama Penerima"
        value={form.nama_penerima}
        onChangeText={(v) => handleChange("nama_penerima", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Alamat Penerima"
        value={form.alamat_penerima}
        onChangeText={(v) => handleChange("alamat_penerima", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="No. Telp Penerima"
        value={form.no_telp_penerima}
        onChangeText={(v) => handleChange("no_telp_penerima", v)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Jenis Barang"
        value={form.jenis_barang}
        onChangeText={(v) => handleChange("jenis_barang", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Berat Barang (Kg)"
        value={form.berat_barang}
        onChangeText={(v) => handleChange("berat_barang", v)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Ekspedisi (misal: JNE, TIKI, POS)"
        value={form.ekspedisi}
        onChangeText={(v) => handleChange("ekspedisi", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Jenis Layanan"
        value={form.jenis_layanan}
        onChangeText={(v) => handleChange("jenis_layanan", v)}
      />

      <Button title="Simpan" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
});
