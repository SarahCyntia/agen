import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import InputForm from "./inputform"; 
import { useNavigate } from "react-router-dom";

const input: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        <h2 className="mb-0">List Order</h2>
        <button
          className="btn btn-sm btn-primary ms-auto"
          onClick={() => navigate("/input")}  // ⬅ pindah ke halaman /input
        >
          Tambah <i className="la la-plus"></i>
        </button>
      </div>

      <div className="card-body">
        {/* tabel kamu */}
      </div>
    </div>
  );
};

// Typings
interface Input {
  id: number;
  nama_pengirim: string;
  alamat_pengirim: string;
  no_telp_pengirim: string;
  nama_penerima: string;
  alamat_penerima: string;
  no_telp_penerima: string;
  jenis_barang: string;
  berat_barang: number;
  ekspedisi: string;
  jenis_layanan: string;
  no_resi: string;
  biaya: number;
  status: string;
  status_pembayaran?: string;
  payment_at?: string;
}

// Dummy reusable component for pagination
const PaginateTable = React.forwardRef(({ columns, url }: any, ref) => {
  return <div>Implement PaginateTable Here</div>;
});

const InputOrders: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const paginateRef = useRef<any>(null);

  const refresh = () => paginateRef.current?.refetch?.();

  const downloadReceipt = async (noResi: string) => {
    try {
      const response = await axios.get(`/download-resi/${noResi}`, {
        responseType: "blob",
      });
      saveAs(response.data, `struk-${noResi}.pdf`);
    } catch (error) {
      console.error("Download gagal:", error);
      Swal.fire("Error", "Gagal mengunduh struk", "error");
    }
  };

  const redirectToPayment = async (id: number) => {
    try {
      const { data } = await axios.get(`/payment/token/${id}`);
      const snapToken = data.snap_token;

      if (!snapToken) {
        Swal.fire({ icon: "error", title: "Token Tidak Tersedia" });
        return;
      }

      if (typeof window.snap === "undefined") {
        Swal.fire({ icon: "error", title: "Snap Belum Siap" });
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          await axios.post("/manual-update-status", {
            order_id: result.order_id,
            transaction_status: result.transaction_status,
            payment_type: result.payment_type,
          });
          Swal.fire({ icon: "success", title: "Pembayaran Berhasil" }).then(refresh);
        },
        onPending: async (result: any) => {
          await axios.post("/manual-update-status", {
            order_id: result.order_id,
            transaction_status: result.transaction_status,
            payment_type: result.payment_type,
          });
          Swal.fire({ icon: "info", title: "Menunggu Pembayaran" });
        },
        onError: () => {
          Swal.fire({ icon: "error", title: "Pembayaran Gagal" });
        },
        onClose: () => {
          Swal.fire({ icon: "warning", title: "Dibatalkan" });
        },
      });
    } catch (error) {
      console.error("❌ Gagal ambil token:", error);
      Swal.fire({ icon: "error", title: "Error mengambil token" });
    }
  };

  useEffect(() => {
    if (!window.snap) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", "SB-Mid-client-XXXXX"); // ganti sesuai client key kamu
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        <h2 className="mb-0">List Order</h2>
        {/* {!openForm && (
          <button className="btn btn-sm btn-primary ms-auto" onClick={() => setOpenForm(true)}>
            Tambah <i className="la la-plus"></i>
          </button>
        )} */}
      </div>

      <div className="card-body">
        <PaginateTable
          ref={paginateRef}
          url="/input?status=menunggu"
          columns={[
            {
              header: "No Resi",
              accessorKey: "no_resi",
              cell: ({ row }: any) => row.original.no_resi,
            },
            {
              header: "Status",
              accessorKey: "status",
              cell: ({ row }: any) => (
                <span className="badge bg-secondary">{row.original.status}</span>
              ),
            },
            {
              header: "Pembayaran",
              accessorKey: "status_pembayaran",
              cell: ({ row }: any) => {
                const status = row.original.status_pembayaran?.toLowerCase();
                const map = {
                  settlement: "badge bg-success fw-bold",
                  pending: "badge bg-warning text-dark fw-bold",
                  expire: "badge bg-secondary fw-bold",
                  failure: "badge bg-danger fw-bold",
                  refund: "badge bg-info text-dark fw-bold",
                } as Record<string, string>;

                return (
                  <span className={map[status] ?? "badge bg-secondary fw-bold"}>
                    {status ?? "Tidak Diketahui"}
                  </span>
                );
              },
            },
            {
              header: "Struk",
              id: "struk",
              cell: ({ row }: any) => (
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => downloadReceipt(row.original.no_resi)}
                >
                  <i className="la la-download me-1" />
                  Download
                </button>
              ),
            },
            {
              header: "Aksi",
              id: "aksi",
              cell: ({ row }: any) => {
                const status = row.original.status_pembayaran?.toLowerCase();
                const canPay = !row.original.payment_at && status !== "settlement";

                return canPay ? (
                  <button
                    className="btn btn-sm btn-success me-1"
                    onClick={() => redirectToPayment(row.original.id)}
                  >
                    <i className="bi bi-credit-card me-1" />
                    Bayar
                  </button>
                ) : null;
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default InputOrders;



// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// export default function InputOrder() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>➕ Halaman Input Order</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 18 },
// });
