import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, CreditCard, Hash } from "lucide-react";

const ReservationCard = ({ 
  item, 
  isPast, 
  isCancellable, 
  handlePayment, 
  handleCancel 
}) => {
  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
      <div className="absolute inset-0 bg-linear-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-2xl border-2 border-white/60 dark:border-white/10 shadow-2xl z-0 transition-colors group-hover:from-white dark:group-hover:from-slate-800"></div>

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
  );
};

export default ReservationCard;
