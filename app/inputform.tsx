import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
// import InputForm from "inputform";

interface Province { id: string; name: string }
interface City { id: string; name: string }
interface District { id: string; name: string }
interface Service { service: string; description: string; cost: number; etd: string }

const couriers = [
  { code: "jne", name: "JNE" },
  { code: "tiki", name: "TIKI" },
  { code: "pos", name: "POS" },
];

const schema = Yup.object().shape({
  nama_pengirim: Yup.string().required("Nama Pengirim harus diisi"),
  alamat_pengirim: Yup.string().required("Alamat Pengirim harus diisi"),
  no_telp_pengirim: Yup.string().required("No. Telp Pengirim harus diisi"),
  nama_penerima: Yup.string().required("Nama Penerima harus diisi"),
  alamat_penerima: Yup.string().required("Alamat Penerima harus diisi"),
  no_telp_penerima: Yup.string().required("No. Telp Penerima harus diisi"),
  ekspedisi: Yup.string().required("Ekspedisi harus dipilih"),
  jenis_barang: Yup.string().required("Jenis Barang harus diisi"),
  jenis_layanan: Yup.string().required("Jenis Layanan harus diisi"),
  berat_barang: Yup.number().required().min(0.1, "Berat minimal 0.1 Kg"),
});

export default function InputForm({ selected, onClose, onRefresh }: { selected?: string, onClose: () => void, onRefresh: () => void }) {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [citiesOrigin, setCitiesOrigin] = useState<City[]>([]);
  const [citiesDestination, setCitiesDestination] = useState<City[]>([]);
  const [districtsOrigin, setDistrictsOrigin] = useState<District[]>([]);
  const [districtsDestination, setDistrictsDestination] = useState<District[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [biaya, setBiaya] = useState<number>(0);

  const [provinceOrigin, setProvinceOrigin] = useState("0");
  const [cityOrigin, setCityOrigin] = useState("");
  const [districtOrigin, setDistrictOrigin] = useState("");
  const [provinceDestination, setProvinceDestination] = useState("0");
  const [cityDestination, setCityDestination] = useState("");
  const [districtDestination, setDistrictDestination] = useState("");
  const [beratBarang, setBeratBarang] = useState<number | null>(null);

  useEffect(() => {
    axios.get("/provinces").then(res => {
      const provs = Object.entries(res.data).map(([id, name]) => ({ id, name: name as string }));
      setProvinces(provs);
    });
  }, []);

  const fetchCities = async (provId: string, type: "origin" | "destination") => {
    if (!provId || provId === "0") return;
    const res = await axios.get(`/cities/${provId}`);
    const data = Object.entries(res.data).map(([id, name]) => ({ id, name: name as string }));
    if (type === "origin") setCitiesOrigin(data); else setCitiesDestination(data);
  };

  const fetchDistricts = async (cityId: string, type: "origin" | "destination") => {
    if (!cityId) return;
    const res = await axios.get(`/districts/${cityId}`);
    const data = Object.entries(res.data).map(([id, name]) => ({ id, name: name as string }));
    if (type === "origin") setDistrictsOrigin(data); else setDistrictsDestination(data);
  };

  const fetchOngkir = async () => {
    if (!districtOrigin || !districtDestination || !selectedCourier || !beratBarang) return;
    try {
      const res = await axios.post("/cost", {
        origin: districtOrigin,
        destination: districtDestination,
        weight: Math.round(beratBarang * 1000),
        courier: selectedCourier,
        price: "lowest"
      });
      const sv = res.data.map((s: any) => ({
        service: s.service,
        description: s.description,
        cost: s.cost,
        etd: s.etd,
      }));
      setServices(sv);
      setSelectedService("");
      setBiaya(0);
    } catch {
      toast.error("Gagal mengambil ongkir");
    }
  };

  useEffect(() => {
    fetchOngkir();
  }, [districtOrigin, districtDestination, selectedCourier, beratBarang]);

  const onSubmit = async (data: any) => {
    const noResi = generateNoResi();
    const formData = new FormData();
    formData.append("nama_pengirim", data.nama_pengirim);
    formData.append("asal_provinsi_id", provinceOrigin);
    formData.append("asal_kota_id", cityOrigin);
    formData.append("asal_kecamatan_id", districtOrigin);
    formData.append("alamat_pengirim", data.alamat_pengirim);
    formData.append("no_telp_pengirim", data.no_telp_pengirim);
    formData.append("nama_penerima", data.nama_penerima);
    formData.append("tujuan_provinsi_id", provinceDestination);
    formData.append("tujuan_kota_id", cityDestination);
    formData.append("tujuan_kecamatan_id", districtDestination);
    formData.append("alamat_penerima", data.alamat_penerima);
    formData.append("no_telp_penerima", data.no_telp_penerima);
    formData.append("jenis_barang", data.jenis_barang);
    formData.append("jenis_layanan", selectedService);
    formData.append("ekspedisi", selectedCourier);
    formData.append("berat_barang", beratBarang?.toString() || "0");
    formData.append("biaya", biaya.toString());
    formData.append("no_resi", noResi);
    if (selected) formData.append("_method", "PUT"); else formData.append("status", "menunggu");

    try {
      await axios.post(selected ? `/input/${selected}` : "/input/store", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        html: `
          <div style="text-align:left">
            <p><strong>No. Resi:</strong> ${noResi}</p>
            <p><strong>Biaya Pengiriman:</strong> Rp ${biaya.toLocaleString("id-ID")}</p>
            <p><strong>Ekspedisi:</strong> ${selectedCourier.toUpperCase()}</p>
          </div>`
      }).then(() => {
        onClose();
        onRefresh();
        toast.success("Data berhasil disimpan");
        reset();
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  function generateNoResi() {
    const prefix = "RESI";
    const timestamp = Date.now().toString();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${random}`;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow rounded-xl space-y-4">
      <h2 className="text-xl font-bold">{selected ? "Edit" : "Tambah"} Input</h2>
      <div>
        <label>Nama Pengirim</label>
        <input {...register("nama_pengirim")} className="form-input" />
        <p className="text-red-500">{errors.nama_pengirim?.message}</p>
      </div>
      {/* lanjutkan semua input: provinsi, kota, kecamatan, penerima, dll. */}

      <div>
        <label>Ekspedisi</label>
        <select {...register("ekspedisi")} value={selectedCourier} onChange={e => setSelectedCourier(e.target.value)}>
          <option value="">-- Pilih Ekspedisi --</option>
          {couriers.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <p className="text-red-500">{errors.ekspedisi?.message}</p>
      </div>

      <div>
        <label>Jenis Layanan</label>
        <select value={selectedService} onChange={e => {
          setSelectedService(e.target.value);
          const svc = services.find(s => s.service === e.target.value);
          setBiaya(svc?.cost || 0);
        }}>
          <option value="">{services.length === 0 ? "Tidak ada layanan" : "Pilih layanan"}</option>
          {services.map(s => (
            <option key={s.service} value={s.service}>{s.service} - Rp{s.cost.toLocaleString()} ({s.etd} Hari)</option>
          ))}
        </select>
      </div>

      <div>
        <label>Biaya</label>
        <input type="text" value={biaya ? biaya.toLocaleString("id-ID") : "-"} readOnly className="form-input" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Dapatkan No. Resi</button>
    </form>
  );
}
