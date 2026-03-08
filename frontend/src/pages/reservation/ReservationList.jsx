import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddReservation from "./AddReservation";
import ReservationTable from "./ReservationTable";

const scheduleData = [
  { time: "09.00 - 10.00", A: "Kosong", B: "Kosong", C: "Kosong" },
  { time: "10.00 - 11.00", A: "Kosong", B: "Reservasi_A", C: "Kosong" },
  { time: "11.00 - 12.00", A: "Reservasi_B", B: "Kosong", C: "Reservasi_C" },
  { time: "12.00 - 13.00", A: "Kosong", B: "Kosong", C: "Kosong" },
  { time: "13.00 - 14.00", A: "Kosong", B: "Kosong", C: "Kosong" },
  { time: "14.00 - 15.00", A: "Kosong", B: "Kosong", C: "Kosong" },
  { time: "15.00 - 16.00", A: "Kosong", B: "Kosong", C: "Kosong" },
  { time: "16.00 - 17.00", A: "Kosong", B: "Kosong", C: "Kosong" },
];

const scheduleTime = [
  "09.00 - 10.00",
  "10.00 - 11.00",
  "11.00 - 12.00",
  "12.00 - 13.00",
  "13.00 - 14.00",
  "14.00 - 15.00",
  "15.00 - 16.00",
  "16.00 - 17.00",
];

export default function ReservationList() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedLocation, setSelectedLocation] = useState("Bandung");
  const [view, setView] = useState("list");
  const [prefillData, setPrefillData] = useState({ time: "", court: "" });

  const handleAddReservation = () => {
    setPrefillData({ time: "", court: "" });
    setView("add");
  };

  const handleCellClick = (time, court) => {
    setPrefillData({ time, court });
    setView("add");
  };

  if (view === "add") {
    return (
      <AddReservation
        selectedDate={selectedDate}
        selectedLocation={selectedLocation}
        initialTime={prefillData.time}
        initialCourt={prefillData.court}
        onClose={() => {
          setView("list");
          setPrefillData({ time: "", court: "" });
        }}
      />
    );
  }

  return (
    <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Jadwal Lapangan
            </h1>
            <p className="text-sm text-muted-foreground">
              Lihat ketersediaan dan buat reservasi baru.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Lokasi
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="Bandung">Bandung</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button onClick={handleAddReservation} className="mt-auto">
              Tambah Reservasi
            </Button>
          </div>
        </div>

        <ReservationTable
          scheduleData={scheduleData}
          scheduleTime={scheduleTime}
          onCellClick={handleCellClick}
        />
      </div>
    </div>
  );
}
