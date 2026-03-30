import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StatusBadge({ status }) {
  const isAvailable = status === "Available";
  const isClosed = status === "Closed" || status === "Expired";

  let colorClasses =
    "bg-amber-500/10 text-amber-600 border-amber-500/10 dark:text-amber-400";

  if (isAvailable) {
    colorClasses =
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:text-emerald-400";
  } else if (isClosed) {
    colorClasses =
      "bg-slate-500/10 text-slate-500 border-slate-500/10 dark:text-slate-400 opacity-60";
  }

  return (
    <span
      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all shadow-sm ${colorClasses}`}
    >
      {status}
    </span>
  );
}

export default function ReservationTable({
  reservations,
  scheduleTime,
  onCellClick,
  checkIsPast,
  selectedDate,
}) {
  const getReservationStatus = (timeSlot, courtName) => {
    const startTimeInSlot = timeSlot.split(" - ")[0];
    const found = reservations?.find((res) => {
      return (
        res.startTime <= startTimeInSlot &&
        res.endTime > startTimeInSlot &&
        res.court === courtName
      );
    });
    return found ? "Reserved" : "Available";
  };

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border-2 border-white/60 dark:border-white/10 shadow-2xl">
      <Table>
        <TableHeader className="bg-slate-500/5 dark:bg-white/5">
          <TableRow className="hover:bg-transparent border-b-2 border-slate-100 dark:border-white/5">
            <TableHead className="w-[180px] font-black text-xs uppercase tracking-widest text-slate-400 py-6 pl-8">
              Waktu
            </TableHead>
            <TableHead className="text-center font-black text-xs uppercase tracking-widest text-slate-400 py-6">
              Lapangan A
            </TableHead>
            <TableHead className="text-center font-black text-xs uppercase tracking-widest text-slate-400 py-6">
              Lapangan B
            </TableHead>
            <TableHead className="text-center font-black text-xs uppercase tracking-widest text-slate-400 py-6 pr-8">
              Lapangan C
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleTime.map((time, index) => {
            return (
              <TableRow
                key={index}
                className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 group/row"
              >
                <TableCell className="font-black text-slate-600 dark:text-slate-300 py-5 pl-8 text-sm">
                  {time}
                </TableCell>
                {["Lapangan A", "Lapangan B", "Lapangan C"].map((court, i) => {
                  const status = getReservationStatus(time, court);
                  const startTime = time.split(" - ")[0];
                  const isPast = checkIsPast(selectedDate, startTime);
                  return (
                    <TableCell
                      key={court}
                      className={`text-center py-5 ${i === 2 ? "pr-8" : ""}`}
                    >
                      <div
                        className={`inline-block transition-all ${status === "Available" && !isPast ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-not-allowed"}`}
                        onClick={() =>
                          status === "Available" &&
                          !isPast &&
                          onCellClick?.(time, court)
                        }
                      >
                        <StatusBadge
                          status={
                            status === "Available" && isPast ? "Closed" : status
                          }
                        />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
