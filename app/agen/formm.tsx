// app/formm.tsx
import api from "@/app-example/constants/api"; // pastikan path ini benar
import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { AlertNotificationRoot } from "react-native-alert-notification";
import * as Yup from "yup";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

// -----------------------
// Schema validasi
// -----------------------
const schema = Yup.object().shape({
  nama_pengirim: Yup.string().required("Nama pengirim wajib diisi"),
  alamat_pengirim: Yup.string().required("Alamat pengirim wajib diisi"),
  no_telp_pengirim: Yup.string().required("No. Telp pengirim wajib diisi"),

  provinceOrigin: Yup.string().required("Provinsi asal wajib diisi"),
  cityOrigin: Yup.string().required("Kota asal wajib diisi"),
  districtOrigin: Yup.string().required("Kecamatan asal wajib diisi"),

  nama_penerima: Yup.string().required("Nama penerima wajib diisi"),
  alamat_penerima: Yup.string().required("Alamat penerima wajib diisi"),
  no_telp_penerima: Yup.string().required("No HP penerima wajib diisi"),
  provinceDestination: Yup.string().required("Provinsi tujuan wajib diisi"),
  cityDestination: Yup.string().required("Kota tujuan wajib diisi"),
  districtDestination: Yup.string().required("Kecamatan tujuan wajib diisi"),

  nama_barang: Yup.string().required("Nama barang wajib diisi"),
  berat_barang: Yup.number()
    .typeError("Berat harus berupa angka")
    .required("Berat wajib diisi")
    .min(0.1, "Minimal 0.1 Kg"),

  ekspedisi: Yup.string().required("Kurir wajib dipilih"),
  layanan: Yup.string().required("Layanan wajib dipilih"),
});

// -----------------------
// Komponen utama
// -----------------------
export default function InputForm({showForm, setShowForm}: any) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nama_pengirim: "",
      no_telp_pengirim: "",
      alamat_pengirim: "",
      provinceOrigin: "",
      cityOrigin: "",
      districtOrigin: "",
      nama_penerima: "",
      no_telp_penerima: "",
      alamat_penerima: "",
      provinceDestination: "",
      cityDestination: "",
      districtDestination: "",
      nama_barang: "",
      berat_barang: "",
      ekspedisi: "",
      layanan: "",
    },
  });

  // loading flags
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingOngkir, setLoadingOngkir] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // data lists
  const [provinces, setProvinces] = useState<any[]>([]);
  const [citiesOrigin, setCitiesOrigin] = useState<any[]>([]);
  const [citiesDestination, setCitiesDestination] = useState<any[]>([]);
  const [districtsOrigin, setDistrictsOrigin] = useState<any[]>([]);
  const [districtsDestination, setDistrictsDestination] = useState<any[]>([]);
  const [couriers] = useState([
    { id: "jne", title: "JNE" },
    { id: "tiki", title: "TIKI" },
    { id: "pos", title: "POS Indonesia" },
  ]);
  const [services, setServices] = useState<any[]>([]);
  const [biaya, setBiaya] = useState<number>(0);

  // -----------------------
  // API calls
  // -----------------------
  const fetchProvinces = async () => {
    try {
      setLoadingProvince(true);
      const res = await api.get("/provinces");
      // asumsi res.data: { id: name, ... } atau array => penyesuaian
      const formatted = Array.isArray(res.data)
        ? res.data.map((p: any) => ({ id: String(p.id), title: p.name }))
        : Object.entries(res.data).map(([id, name]: any) => ({
            id: String(id),
            title: String(name),
          }));
      setProvinces(formatted);
    } catch (err) {
      console.warn("fetchProvinces error:", err);
      Toast.show({ type: "error", text1: "Gagal mengambil provinsi" });
    } finally {
      setLoadingProvince(false);
    }
  };

  const fetchCities = async (
    provinceId: string,
    type: "origin" | "destination"
  ) => {
    if (!provinceId) return;
    try {
      setLoadingCity(true);
      const res = await api.get(`/cities/${provinceId}`);
      const formatted = Array.isArray(res.data)
        ? res.data.map((c: any) => ({ id: String(c.id), title: c.name }))
        : Object.entries(res.data).map(([id, name]: any) => ({
            id: String(id),
            title: String(name),
          }));

      if (type === "origin") setCitiesOrigin(formatted);
      else setCitiesDestination(formatted);
    } catch (err) {
      console.warn("fetchCities error:", err);
      Toast.show({ type: "error", text1: "Gagal mengambil kota" });
    } finally {
      setLoadingCity(false);
    }
  };

  const fetchDistricts = async (
    cityId: string,
    type: "origin" | "destination"
  ) => {
    if (!cityId) return;
    try {
      setLoadingDistrict(true);
      const res = await api.get(`/districts/${cityId}`);
      const formatted = Array.isArray(res.data)
        ? res.data.map((d: any) => ({ id: String(d.id), title: d.name }))
        : Object.entries(res.data).map(([id, name]: any) => ({
            id: String(id),
            title: String(name),
          }));

      if (type === "origin") setDistrictsOrigin(formatted);
      else setDistrictsDestination(formatted);
    } catch (err) {
      console.warn("fetchDistricts error:", err);
      Toast.show({ type: "error", text1: "Gagal mengambil kecamatan" });
    } finally {
      setLoadingDistrict(false);
    }
  };

  const fetchOngkir = async () => {
    const d = getValues();
    if (
      !d.districtOrigin ||
      !d.districtDestination ||
      !d.ekspedisi ||
      !d.berat_barang
    ) {
      setServices([]);
      setBiaya(0);
      return;
    }

    try {
      setLoadingOngkir(true);
      // berat dalam gram
      const weight = Math.round(Number(d.berat_barang) * 1000);
      const res = await api.post("/cost", {
        origin: d.districtOrigin,
        destination: d.districtDestination,
        weight,
        courier: d.ekspedisi,
        price: "lowest",
      });

      // asumsi res.data array of services
      const formattedServices = (res.data || []).map((s: any) => ({
        service: s.service,
        description: `${s.service} - Rp${Number(s.cost).toLocaleString()} (${
          s.etd ?? "-"
        })`,
        cost: Number(s.cost),
      }));

      setServices(formattedServices);
      setBiaya(0);
      setValue("layanan", "");
    } catch (err) {
      console.warn("fetchOngkir error:", err);
      Toast.show({ type: "error", text1: "Gagal mengambil ongkir" });
      setServices([]);
      setBiaya(0);
    } finally {
      setLoadingOngkir(false);
    }
  };

  // -----------------------
  // Submit
  // -----------------------
  const onSubmit = async (values: any) => {
    try {
      setLoadingSubmit(true);

      const noResi = `RESI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


      const payload = {
  nama_pengirim: values.nama_pengirim,
  alamat_pengirim: values.alamat_pengirim,
  no_telp_pengirim: values.no_telp_pengirim,

  asal_provinsi_id: values.provinceOrigin,
  asal_kota_id: values.cityOrigin,
  asal_kecamatan_id: values.districtOrigin,

  nama_penerima: values.nama_penerima,
  alamat_penerima: values.alamat_penerima,
  no_telp_penerima: values.no_telp_penerima,

  tujuan_provinsi_id: values.provinceDestination,
  tujuan_kota_id: values.cityDestination,
  tujuan_kecamatan_id: values.districtDestination,

  jenis_barang: values.nama_barang,
  berat_barang: Number(values.berat_barang),
  ekspedisi: values.ekspedisi,
  jenis_layanan: values.layanan,

  no_resi: noResi,
  biaya: biaya || 0,
  status: "menunggu",
};

      // const payload = {
      //   nama_pengirim: values.nama_pengirim,
      //   alamat_pengirim: values.alamat_pengirim,
      //   no_telp_pengirim: values.no_telp_pengirim,
      //   provinsi_asal: values.provinceOrigin,
      //   kota_asal: values.cityOrigin,
      //   kecamatan_asal: values.districtOrigin,

      //   nama_penerima: values.nama_penerima,
      //   alamat_penerima: values.alamat_penerima,
      //   no_telp_penerima: values.no_telp_penerima,
      //   provinsi_tujuan: values.provinceDestination,
      //   kota_tujuan: values.cityDestination,
      //   kecamatan_tujuan: values.districtDestination,

      //   nama_barang: values.nama_barang,
      //   berat_barang: Number(values.berat_barang),
      //   ekspedisi: values.ekspedisi,
      //   jenis_layanan: values.layanan,

      //   no_resi: noResi,
      //   biaya: biaya || 0,
      //   status: "menunggu",
      // };
console.log("Payload dikirim:", payload);

      const res = await api.post("/input/store", payload);

      Toast.show({ type: "success", text1: "Transaksi tersimpan" });
      Alert.alert("Berhasil", `No Resi: ${noResi}`, [
        {
          text: "OK",
          onPress: () => setShowForm(false),
        },
      ]);
      reset();
    } catch (err: any) {
      console.warn("submit error:", err);
      Alert.alert("Error", err?.message || "Gagal menyimpan transaksi");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // -----------------------
  // Hooks
  // -----------------------
  useEffect(() => {
    fetchProvinces();
  }, []);

  // jika user memilih provinsi origin => load kota origin
  useEffect(() => {
    const sub = async () => {
      const prov = getValues("provinceOrigin");
      if (prov) await fetchCities(prov, "origin");
    };
    sub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("provinceOrigin")]);

  // jika user memilih provinsi destination => load kota destination
  useEffect(() => {
    const sub = async () => {
      const prov = getValues("provinceDestination");
      if (prov) await fetchCities(prov, "destination");
    };
    sub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("provinceDestination")]);

  // jika user mengubah kota origin => load districts origin
  useEffect(() => {
    const sub = async () => {
      const city = getValues("cityOrigin");
      if (city) await fetchDistricts(city, "origin");
    };
    sub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("cityOrigin")]);

  // jika user mengubah kota destination => load districts destination
  useEffect(() => {
    const sub = async () => {
      const city = getValues("cityDestination");
      if (city) await fetchDistricts(city, "destination");
    };
    sub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues("cityDestination")]);

  // ketika berat/kurir/kecamatan berubah => hit ongkir
  useEffect(() => {
    const sub = () => {
      // kecilkan delay agar tidak spam API (debounce sederhana bisa ditambahkan)
      fetchOngkir();
    };
    // kamu bisa menambahkan debounce di sini jika mau
    sub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getValues("districtOrigin"),
    getValues("districtDestination"),
    getValues("ekspedisi"),
    getValues("berat_barang"),
  ]);


  const [data, setData] = useState([]);
// const [showForm, setShowForm] = useState(false);

const ambilData = async () => {
  const res = await api.get("/input");
  setData(res.data.data);
};
useEffect(() => {
  if (!showForm) ambilData();
}, [showForm]);
  // -----------------------
  // Render
  // -----------------------
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Form Transaksi</Text>

        {/* Pengirim */}
        {/* <Text style={styles.section}>Informasi Pengirim</Text> */}
        <FormInput
          name="nama_pengirim"
          control={control}
          label="Nama Pengirim"
          errors={errors}
          placeholder="Nama Pengirim"
        />
        

        <DropdownInput
          label="Provinsi Asal"
          name="provinceOrigin"
          data={provinces}
          control={control}
          errors={errors}
          loading={loadingProvince}
          onSelect={(id: string) => {
            // reset downwards
            setValue("cityOrigin", "");
            setValue("districtOrigin", "");
            fetchCities(id, "origin");
          }}
        />

        <DropdownInput
          label="Kota Asal"
          name="cityOrigin"
          data={citiesOrigin}
          control={control}
          errors={errors}
          loading={loadingCity}
          onSelect={(id: string) => {
            setValue("districtOrigin", "");
            fetchDistricts(id, "origin");
          }}
        />

        <DropdownInput
          label="Kecamatan Asal"
          name="districtOrigin"
          data={districtsOrigin}
          control={control}
          errors={errors}
          loading={loadingDistrict}
        />

        <FormInput
          name="alamat_pengirim"
          control={control}
          label="Alamat Pengirim"
          errors={errors}
          placeholder="Alamat lengkap"
        />

          <FormInput
          name="no_telp_pengirim"
          control={control}
          label="No. Hp Pengirim"
          errors={errors}
          placeholder="08xxxxxxxxx"
        />

        {/* Penerima */}
        {/* <Text style={styles.section}>Informasi Penerima</Text> */}
        <FormInput
          name="nama_penerima"
          control={control}
          label="Nama Penerima"
          errors={errors}
          placeholder="Nama penerima"
        />
       

        <DropdownInput
          label="Provinsi Tujuan"
          name="provinceDestination"
          data={provinces}
          control={control}
          errors={errors}
          loading={loadingProvince}
          onSelect={(id: string) => {
            setValue("cityDestination", "");
            setValue("districtDestination", "");
            fetchCities(id, "destination");
          }}
        />

        <DropdownInput
          label="Kota Tujuan"
          name="cityDestination"
          data={citiesDestination}
          control={control}
          errors={errors}
          loading={loadingCity}
          onSelect={(id: string) => {
            setValue("districtDestination", "");
            fetchDistricts(id, "destination");
          }}
        />

        <DropdownInput
          label="Kecamatan Tujuan"
          name="districtDestination"
          data={districtsDestination}
          control={control}
          errors={errors}
          loading={loadingDistrict}
        />

          <FormInput
          name="alamat_penerima"
          control={control}
          label="Alamat Penerima"
          errors={errors}
          placeholder="Alamat tujuan"
        />

           <FormInput
          name="no_telp_penerima"
          control={control}
          label="No. Hp Penerima"
          errors={errors}
          placeholder="08xxxxxxxxx"
        />
      

        {/* Barang */}
        {/* <Text style={styles.section}>Informasi Barang</Text> */}
        <FormInput
          name="nama_barang"
          control={control}
          label="Nama Barang"
          errors={errors}
          placeholder="Contoh: pakaian"
        />
        <FormInput
          name="berat_barang"
          control={control}
          label="Berat Barang (Kg)"
          errors={errors}
          placeholder="0.5"
          numeric
        />

        {/* Ekspedisi */}
        {/* <Text style={styles.section}>Ekspedisi</Text> */}
        <DropdownInput
          label="Kurir"
          name="ekspedisi"
          data={couriers}
          control={control}
          errors={errors}
          onSelect={() => fetchOngkir()}
        />

        <DropdownInput
          label="Layanan"
          name="layanan"
          data={services.map((s) => ({
            id: s.service,
            title: s.description,
            cost: s.cost,
          }))}
          control={control}
          errors={errors}
          loading={loadingOngkir}
          onSelect={(id: string) => {
            const selected = services.find((srv) => srv.service === id);
            if (selected) setBiaya(selected.cost);
            else setBiaya(0);
          }}
        />

        <Text style={styles.fee}>
          Biaya Ongkir: Rp {biaya?.toLocaleString?.() ?? 0}
        </Text>

        <View style={{ marginVertical: 12 }}>
          <Button title="Simpan Transaksi" onPress={handleSubmit(onSubmit)} />
        </View>
        <View style={{ marginBottom: 20 }}>
  <Button
    title="Kembali"
    color="#888"
    onPress={() => setShowForm(false)} // langsung buka halaman /input
  />
</View>
      </ScrollView>

      {/* Overlay loading saat submit */}
      {loadingSubmit && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Menyimpan transaksi...
          </Text>
        </View>
      )}
    </View>
  );
}

// =======================
// Komponen Reusable
// =======================
const FormInput = ({
  name,
  control,
  label,
  errors,
  numeric = false,
  placeholder,
  editable = true,
}: any) => (
  <View style={{ marginBottom: 8 }}>
    <Text style={{ marginBottom: 4 }}>{label}</Text>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={[styles.input, !editable && { backgroundColor: "#f5f5f5" }]}
          value={value == null ? "" : String(value)}
          placeholder={placeholder}
          keyboardType={numeric ? "numeric" : "default"}
          onChangeText={(val) => onChange(val)}
          editable={editable}
        />
      )}
    />
    {errors?.[name] && <Text style={styles.error}>{errors[name].message}</Text>}
  </View>
);

const DropdownInput = ({
  label,
  name,
  data = [],
  control,
  errors,
  onSelect,
  loading,
}: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ marginBottom: 4 }}>{label}</Text>
    {loading ? (
      <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
    ) : (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.dropdown}>
            <Picker
              selectedValue={value}
              onValueChange={(val) => {
                onChange(val);
                onSelect?.(val);
              }}
              style={styles.picker}
            >
              <Picker.Item label={`Pilih ${label}`} value="" />
              {data.map((item: any) => (
                <Picker.Item
                  key={item.id}
                  label={item.title ?? item.name}
                  value={item.id}
                />
              ))}
            </Picker>
          </View>
        )}
      />
    )}
    {errors?.[name] && <Text style={styles.error}>{errors[name].message}</Text>}
  </View>
);

// =======================
// Styles
// =======================
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
    borderColor: "#ccc",
      height: 50, 
        fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 4,
    justifyContent: "center",
  },
  picker: { height: 50, color: "#000" },
  error: { color: "red", marginBottom: 8 },
  fee: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
