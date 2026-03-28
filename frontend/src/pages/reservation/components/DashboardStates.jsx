import React from "react";
import { Activity, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center p-20 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <p className="text-sm font-bold text-slate-500 animate-pulse">
      Menyiapkan data Anda...
    </p>
  </div>
);

export const ErrorState = ({ error }) => (
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
);

export const EmptyState = () => (
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
);
