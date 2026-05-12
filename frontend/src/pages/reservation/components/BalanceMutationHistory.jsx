import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      icon: Clock,
      label: "Pending",
    },
    success: {
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      icon: CheckCircle2,
      label: "Berhasil",
    },
    cancelled: {
      color: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
      icon: XCircle,
      label: "Dibatalkan",
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  );
}

const BalanceMutationHistory = () => {
  const [mutations, setMutations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`wallet/history?page=${page}&limit=10`);
        setMutations(response.data.data.data);
        setMeta(response.data.data.meta);
      } catch (error) {
        console.error("Failed to fetch mutation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  if (loading && mutations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">
          Memuat riwayat mutasi...
        </p>
      </div>
    );
  }

  if (!loading && mutations.length === 0) {
    return (
      <div className="text-center py-20 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10">
        <p className="text-slate-500 font-bold">
          Belum ada riwayat mutasi saldo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] overflow-hidden border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500">
      <Table>
        <TableHeader className="bg-slate-100/50 dark:bg-white/5">
          <TableRow className="border-b-2 border-white/20">
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Tipe
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Keterangan
            </TableHead>
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
              Jumlah
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
          {mutations.map((item) => (
            <TableRow
              key={item.id}
              className="group border-b border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <TableCell className="py-6 px-8">
                <div className="flex items-center gap-3">
                  {item.amount > 0 ? (
                    <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                  )}
                  <span className="font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200">
                    {item.type.replace("_", " ")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-6 px-8 font-bold text-xs text-slate-500 dark:text-slate-400">
                {item.description}
              </TableCell>
              <TableCell className="py-6 px-8 text-center">
                <span
                  className={`font-black text-xs ${
                    item.amount > 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {item.amount > 0 ? "+" : ""}
                  Rp {Math.abs(item.amount).toLocaleString("id-ID")}
                </span>
              </TableCell>
              <TableCell className="py-6 px-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {format(new Date(item.createdAt), "dd MMM yyyy, HH:mm", {
                  locale: id,
                })}
              </TableCell>
              <TableCell className="py-6 px-8 text-right">
                <StatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!loading && mutations.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="h-12 w-12 flex items-center justify-center rounded-2xl border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-all font-black"
          >
            <Clock className="h-5 w-5 -scale-110" />
          </button>

          <div className="h-12 px-6 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
            {page} / {meta.totalPages || 1}
          </div>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="h-12 w-12 flex items-center justify-center rounded-2xl border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 transition-all font-black"
          >
            <Clock className="h-5 w-5 scale-110" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BalanceMutationHistory;
