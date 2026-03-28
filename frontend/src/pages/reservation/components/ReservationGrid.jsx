import React from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReservationCard from "./ReservationCard";

const ReservationGrid = ({
  viewAll,
  reservations,
  closestReservations,
  setViewAll,
  isPast,
  isCancellable,
  handlePayment,
  handleCancel,
}) => {
  const displayReservations = viewAll ? reservations : closestReservations;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayReservations.map((item) => (
          <ReservationCard
            key={item.id}
            item={item}
            isPast={isPast}
            isCancellable={isCancellable}
            handlePayment={handlePayment}
            handleCancel={handleCancel}
          />
        ))}
      </div>

      {!viewAll && reservations.length > 3 && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            className="rounded-full px-12 h-14 text-sm font-black uppercase tracking-widest border-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all group lg:w-fit w-full"
            onClick={() => setViewAll(true)}
          >
            Lihat Semua Reservasi ({reservations.length})
            <Activity className="ml-2 h-4 w-4 group-hover:scale-125 transition-transform" />
          </Button>
        </div>
      )}

      {viewAll && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            className="rounded-full px-12 h-14 text-sm font-black uppercase tracking-widest border-2 border-slate-500/10 hover:border-slate-500/50 hover:bg-slate-500/5 text-slate-500 transition-all group lg:w-fit w-full"
            onClick={() => setViewAll(false)}
          >
            Tampilkan Lebih Sedikit
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReservationGrid;
