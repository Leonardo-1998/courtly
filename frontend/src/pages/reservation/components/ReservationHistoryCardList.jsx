import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  History as HistoryIcon,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function StatusBadge({ status }) {
  const isSettled = status === "SETTLEMENT" || status === "SUCCESS";
  const isPending = status === "PENDING";

  return (
    <span
      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all shadow-sm ${
        isSettled
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:text-emerald-400"
          : isPending
            ? "bg-amber-500/10 text-amber-600 border-amber-500/10 dark:text-amber-400"
            : "bg-slate-500/10 text-slate-600 border-slate-500/10 dark:text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

export default function ReservationHistoryCardList({ reservations, loading, handlePayment }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-96 rounded-[2.5rem] bg-white/20 dark:bg-white/5 animate-pulse border-2 border-white/20"
          ></div>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-24 w-24 rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 flex items-center justify-center shadow-2xl">
          <HistoryIcon className="h-10 w-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Belum Ada Riwayat
          </h3>
          <p className="text-slate-500 font-bold max-w-xs mx-auto">
            Anda belum memiliki catatan reservasi lapangan saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reservations.map((item) => (
        <div key={item.id} className="group relative">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10"></div>

          <Card className="h-full relative overflow-hidden bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/60 dark:border-white/10 shadow-2xl rounded-[2.5rem] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary/30">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <HistoryIcon className="h-6 w-6" />
                </div>
                <StatusBadge status={item.status} />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap">
                {item.court}
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3" /> {item.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-slate-500/5 dark:bg-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Tanggal
                  </p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {item.date.split("T")[0]}
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-500/5 dark:bg-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Durasi
                  </p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {item.startTime} - {item.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-3xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                  Total Biaya
                </p>
                <p className="text-lg font-black text-primary">
                  {item.price}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-8 px-8">
              {item.status === "PENDING" && item.midtrans?.token && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 rounded-2xl h-12 transition-all active:scale-95 text-xs uppercase tracking-widest"
                  onClick={() => handlePayment(item.midtrans.token)}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Bayar Sekarang
                </Button>
              )}
              {(item.status === "SETTLEMENT" ||
                item.status === "SUCCESS") && (
                <div className="w-full p-3 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center text-[10px] font-black uppercase tracking-widest">
                  Pembayaran Lunas
                </div>
              )}
              {item.status === "CANCELLED" && (
                <div className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 text-slate-400 text-center text-[10px] font-black uppercase tracking-widest">
                  Dibatalkan
                </div>
              )}
            </CardFooter>

            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -mr-4 -mt-4 group-hover:bg-primary/10 transition-colors"></div>
          </Card>
        </div>
      ))}
    </div>
  );
}
