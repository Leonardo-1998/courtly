import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StatusBadge({ status }) {
  const isAvailable = status === "Kosong";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        isAvailable
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function ReservationTable({
  scheduleData,
  scheduleTime,
  onCellClick,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead className="w-[150px] font-bold">Waktu</TableHead>
            <TableHead className="text-center font-bold">Lapangan A</TableHead>
            <TableHead className="text-center font-bold">Lapangan B</TableHead>
            <TableHead className="text-center font-bold">Lapangan C</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleData.map((row, index) => {
            const time = scheduleTime[index];
            return (
              <TableRow
                key={index}
                className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
              >
                <TableCell className="font-medium">{time}</TableCell>
                <TableCell
                  className="text-center cursor-pointer"
                  onClick={() =>
                    row.A === "Kosong" && onCellClick?.(time, "Lapangan A")
                  }
                >
                  <StatusBadge status={row.A} />
                </TableCell>
                <TableCell
                  className="text-center cursor-pointer"
                  onClick={() =>
                    row.B === "Kosong" && onCellClick?.(time, "Lapangan B")
                  }
                >
                  <StatusBadge status={row.B} />
                </TableCell>
                <TableCell
                  className="text-center cursor-pointer"
                  onClick={() =>
                    row.C === "Kosong" && onCellClick?.(time, "Lapangan C")
                  }
                >
                  <StatusBadge status={row.C} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
