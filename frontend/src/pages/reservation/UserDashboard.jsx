import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Hash,
  Activity,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast, Bounce } from "react-toastify";

const UserDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Global UI Modernization Tasks:
  // - [x] Add global background blobs to `App.jsx`
  // - [x] Modernize `UserDashboard.jsx` (Glassmorphism cards)
  // - [x] Modernize `LoginPage.jsx` & `RegisterPage.jsx`
  // - [x] Modernize `Home.jsx` (Hero & Features)
  // - [x] Modernize `ReservationList.jsx` & `ReservationTable.jsx`
  // - [x] Modernize `AddReservation.jsx` (Premium form card)
  // - [x] Modernize `ReservationHistory.jsx` (Card grid layout)
  // - [x] Modernize `Navbar.jsx` (Glassmorphism header)
  // - [x] Fix syntax errors in `Home.jsx` and `ReservationHistory.jsx`
  // - [x] Final verification and lint cleanup

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "reservation/my-reservations?status=pending,paid",
        );
        setReservations(response.data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data reservasi");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservations();

    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScript;
    script.async = true;
    script.setAttribute("data-client-key", clientKey);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getReservationStart = (item) => {
    const reservationDate = new Date(item.date);
    const [startHour, startMinute] = item.startTime.split(".").map(Number);
    reservationDate.setHours(startHour, startMinute, 0, 0);
    return reservationDate;
  };

  const isCancellable = (item) => {
    const now = new Date();
    const start = getReservationStart(item);
    // Minimal 24 jam sebelum jadwal
    const diffInHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours >= 24;
  };

  const isPast = (item) => {
    const now = new Date();
    const start = getReservationStart(item);
    return start < now;
  };

  const handleCancel = async (item) => {
    if (!isCancellable(item)) {
      alert("Reservasi hanya dapat dibatalkan minimal 24 jam sebelum jadwal.");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) {
      try {
        await api.delete(`reservation/${item.id}`);
        setReservations((prev) => prev.filter((res) => res.id !== item.id));
      } catch (err) {
        console.error("Cancel error:", err);
        alert("Gagal membatalkan reservasi");
      }
    }
  };

  const handlePayment = (token) => {
    if (!window.snap) {
      alert("Midtrans Snap belum dimuat. Silakan coba lagi nanti.");
      return;
    }
    console.log(token);
    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log("success", result);
        toast.success("Pembayaran Berhasil!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => window.location.reload(), 1500);
      },
      onPending: function (result) {
        console.log("pending", result);
        toast.info("Menunggu Pembayaran...", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => window.location.reload(), 1500);
      },
      onError: function (result) {
        console.log("error", result);
        toast.error("Pembayaran Gagal!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
      },
      onClose: function () {
        console.log("customer closed the popup without finishing the payment");
        toast.info("Anda menutup jendela pembayaran", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      },
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto relative min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white">
            Dashboard Saya
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Kelola dan lihat riwayat reservasi Anda dengan sentuhan modern.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg shadow-black/5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Activity className="h-6 w-6 text-primary" />
              Reservasi Aktif
            </h2>
            <Badge
              variant="secondary"
              className="px-5 py-1.5 rounded-full bg-primary text-white border-none text-xs font-black shadow-lg shadow-primary/30"
            >
              {reservations.length} Reservasi
            </Badge>
          </div>

          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm font-bold text-slate-500 animate-pulse">
                  Menyiapkan data Anda...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 flex flex-col items-center text-center rounded-3xl bg-red-500/5 backdrop-blur-md border border-red-500/20">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-400">
                  Oops! Terjadi Kesalahan
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs font-medium">
                  {error}
                </p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="p-20 flex flex-col items-center text-center rounded-3xl bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10">
                <div className="bg-slate-100/50 dark:bg-slate-800/50 p-8 rounded-full mb-6 relative group">
                  <div className="absolute inset-x-0 inset-y-0 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all"></div>
                  <Calendar className="h-14 w-14 text-slate-400 relative z-10" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-slate-800 dark:text-white">
                  Belum ada reservasi
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                  Anda belum memiliki jadwal reservasi aktif. Silakan pilih
                  lapangan terbaik untuk Anda!
                </p>
                <Button className="rounded-full px-8 h-12 shadow-xl shadow-primary/20 font-bold group">
                  Buat Reservasi Baru
                  <MapPin className="ml-2 h-4 w-4 group-hover:translate-y-[-2px] transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reservations.map((item) => (
                  <div
                    key={item.id}
                    className="relative group overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
                  >
                    {/* Glassmorphism Background with Tint */}
                    <div className="absolute inset-0 bg-linear-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-2xl border-2 border-white/60 dark:border-white/10 shadow-2xl z-0 transition-colors group-hover:from-white dark:group-hover:from-slate-800"></div>

                    {/* Decorative Gradient Accent */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full z-0 transition-opacity opacity-20 group-hover:opacity-40 ${
                        item.status === "PAID"
                          ? "bg-emerald-400 text-emerald-600"
                          : "bg-amber-400 text-amber-600"
                      }`}
                    ></div>

                    <div className="relative z-10 p-8 flex flex-col h-full space-y-6">
                      {/* Header: ID & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-sm">
                            <Hash className="h-4 w-4" />
                          </div>
                          <span className="font-mono text-xs font-black text-slate-400 uppercase tracking-tighter">
                            ID: {item.id.slice(0, 8)}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-black text-[10px] flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border-2 ${
                            isPast(item)
                              ? "bg-slate-500/10 text-slate-600 border-slate-500/10"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/10 shadow-lg shadow-emerald-500/10"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${isPast(item) ? "bg-slate-400" : "bg-emerald-500 animate-pulse"}`}
                          ></div>
                          {isPast(item) ? "SELESAI" : "MENDATANG"}
                        </Badge>
                      </div>

                      {/* Location & Court */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-indigo-500/5 text-indigo-600 dark:text-indigo-400">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                              {item.location}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase">
                              {item.court}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-slate-500/5 dark:bg-white/5 border border-white/20 space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Tanggal
                          </p>
                          <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200">
                            <Calendar className="h-4 w-4 text-primary" />
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>
                        <div className="p-4 rounded-3xl bg-slate-500/5 dark:bg-white/5 border border-white/20 space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Waktu
                          </p>
                          <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200">
                            <Clock className="h-4 w-4 text-primary" />
                            {item.startTime}
                          </div>
                        </div>
                      </div>

                      {/* Price & Payment Status */}
                      <div className="pt-6 border-t-2 border-slate-500/10 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Total Tagihan
                          </p>
                          <span className="text-2xl font-black text-primary tracking-tight">
                            {item.price}
                          </span>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-xs ${
                            item.status === "PAID"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/10"
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center gap-4">
                        {!isPast(item) &&
                          item.status === "PENDING" &&
                          item.midtrans?.token && (
                            <Button
                              className="flex-2 bg-primary hover:bg-primary/90 text-white font-black shadow-2xl shadow-primary/40 rounded-[1.5rem] h-14 transition-all active:scale-95 text-sm group"
                              onClick={() => handlePayment(item.midtrans.token)}
                            >
                              <CreditCard className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                              BAYAR SEKARANG
                            </Button>
                          )}

                        {isCancellable(item) && (
                          <Button
                            variant="outline"
                            className={`${!isPast(item) && item.status === "PENDING" ? "flex-1" : "w-full"} h-14 rounded-[1.5rem] border-2 border-red-500/10 text-red-500 font-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 text-sm`}
                            onClick={() => handleCancel(item)}
                          >
                            BATALKAN
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
