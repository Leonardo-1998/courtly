import api from "@/lib/axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Coins, Loader2 } from "lucide-react";

function StatusBadge({ status }) {
  const isSettled = status === "SETTLEMENT" || status === "SUCCESS";
  const isPending = status === "PENDING";

  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
        isSettled
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          : isPending
            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
            : "bg-slate-500/10 text-slate-600 border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default function TopUpHistory() {
  const [topUpHistory, setTopUpHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUpHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("topup/history");
        setTopUpHistory(response.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil riwayat top up:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopUpHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">
          Memuat riwayat top up...
        </p>
      </div>
    );
  }

  if (topUpHistory.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-24 w-24 rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 flex items-center justify-center shadow-2xl">
          <Coins className="h-10 w-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Belum Ada Top Up
          </h3>
          <p className="text-slate-500 font-bold max-w-xs mx-auto">
            Anda belum memiliki riwayat pengisian saldo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] overflow-hidden border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
      <Table>
        <TableHeader className="bg-slate-100/50 dark:bg-white/5">
          <TableRow className="border-b-2 border-white/20">
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              ID Transaksi
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Jumlah
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
              Metode
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
              Tanggal
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topUpHistory.map((item) => (
            <TableRow
              key={item.id}
              className="group border-b border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <TableCell className="py-6 px-8 font-black text-xs text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {item.id.split("-")[0].toUpperCase()}...
              </TableCell>
              <TableCell className="py-6 px-8">
                <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors italic">
                  Rp {item.amount.toLocaleString("id-ID")}
                </span>
              </TableCell>
              <TableCell className="py-6 px-8 text-center font-bold text-[10px] uppercase tracking-wider text-slate-500">
                {item.paymentMethod || "N/A"}
              </TableCell>
              <TableCell className="py-6 px-8 text-center font-bold text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="py-6 px-8 text-right">
                <StatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
