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

const UserDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Saya</h1>
          <p className="text-muted-foreground text-lg">
            Kelola dan lihat riwayat reservasi lapangan Anda dalam satu tabel.
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Daftar Reservasi Aktif
              </CardTitle>
              <Badge variant="secondary" className="px-3">
                {reservations.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Memuat data...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 flex flex-col items-center text-center">
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-4">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">
                  Terjadi Kesalahan
                </h3>
                <p className="text-muted-foreground max-w-xs">{error}</p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="p-20 flex flex-col items-center text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Belum ada reservasi
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Anda belum memiliki jadwal reservasi aktif. Silakan buat
                  reservasi baru di menu Reservasi.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <th className="px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3" /> ID
                        </div>
                      </th>
                      <th className="px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" /> Lokasi & Lapangan
                        </div>
                      </th>
                      <th className="px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" /> Tanggal
                        </div>
                      </th>
                      <th className="px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Waktu
                        </div>
                      </th>
                      <th className="px-6 py-4 border-b text-right">
                        <div className="flex items-center justify-end gap-2">
                          <CreditCard className="h-3 w-3" /> Harga
                        </div>
                      </th>
                      <th className="px-6 py-4 border-b text-center">Status</th>
                      <th className="px-6 py-4 border-b text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {reservations.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-muted-foreground group-hover:text-primary transition-colors">
                            {item.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {item.location}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.court}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {item.startTime} - {item.endTime}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold text-primary">
                            {item.price}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isPast(item) ? (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
                            >
                              Selesai
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                            >
                              Mendatang
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isCancellable(item) ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleCancel(item)}
                              title="Batalkan Reservasi"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              {/* Locked */}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
