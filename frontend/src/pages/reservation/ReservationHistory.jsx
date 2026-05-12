import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import TopUpHistory from "./components/TopUpHistory";
import ReservationHistoryCardList from "./components/ReservationHistoryCardList";
import BalanceMutationHistory from "./components/BalanceMutationHistory";

const ReservationHistory = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("reservations");

  useEffect(() => {
    const fetchMyHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `reservation/my-history?page=${page}&limit=${limit}`,
        );
        const { data, meta } = response.data.data;
        setReservations(data || []);
        setMeta(meta);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil riwayat reservasi");
      } finally {
        setLoading(false);
      }
    };

    fetchMyHistory();
  }, [page, limit]);

  const handlePayment = (token) => {
    window.snap.pay(token, {
      onSuccess: () => navigate(0),
      onPending: () => navigate(0),
      onError: () => navigate(0),
      onClose: () => navigate(0),
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 relative min-h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Records
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
              Riwayat Aktivitas
            </h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Pantau riwayat reservasi dan top-up saldo Anda dalam satu tempat.
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[2rem] border-2 border-white/60 dark:border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "reservations"
                  ? "bg-white dark:bg-white/10 text-primary shadow-xl scale-105"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              Reservasi
            </button>
            <button
              onClick={() => setActiveTab("topups")}
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "topups"
                  ? "bg-white dark:bg-white/10 text-primary shadow-xl scale-105"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              Top Up
            </button>
            <button
              onClick={() => setActiveTab("mutations")}
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "mutations"
                  ? "bg-white dark:bg-white/10 text-primary shadow-xl scale-105"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              Mutasi
            </button>
          </div>

          <div className={`p-2 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 shadow-xl flex items-center gap-4 transition-all duration-300 ${activeTab !== "reservations" ? "opacity-0 pointer-events-none scale-95" : "opacity-100"}`}>
            <div className="flex items-center gap-2 pl-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Tampilan
              </span>
              <select
                className="bg-transparent border-none text-xs font-black uppercase tracking-wider text-primary focus:ring-0 cursor-pointer"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5 Baris</option>
                <option value={10}>10 Baris</option>
                <option value={20}>20 Baris</option>
              </select>
            </div>
          </div>
        </div>

        <div className="transition-all duration-500">
          {activeTab === "reservations" ? (
            <div className="space-y-10">
              <ReservationHistoryCardList 
                reservations={reservations} 
                loading={loading} 
                handlePayment={handlePayment} 
              />

              {/* Pagination */}
              {!loading && reservations.length > 0 && (
                <div className="flex items-center justify-center gap-4 py-10">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="h-12 w-12 rounded-2xl border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-all font-black"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="h-12 px-6 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                    {page} / {meta.totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === meta.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="h-12 w-12 rounded-2xl border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-all font-black"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          ) : activeTab === "topups" ? (
            <TopUpHistory />
          ) : (
            <BalanceMutationHistory />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationHistory;
