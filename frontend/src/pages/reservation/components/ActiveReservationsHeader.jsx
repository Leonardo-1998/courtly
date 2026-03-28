import React from "react";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ActiveReservationsHeader = ({ count }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg shadow-black/5">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Activity className="h-6 w-6 text-primary" />
        Reservasi Aktif
      </h2>
      <Badge
        variant="secondary"
        className="px-5 py-1.5 rounded-full bg-primary text-white border-none text-xs font-black shadow-lg shadow-primary/30"
      >
        {count} Reservasi
      </Badge>
    </div>
  );
};

export default ActiveReservationsHeader;
