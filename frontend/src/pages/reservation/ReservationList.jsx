import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddReservation from "./AddReservation";
import ReservationTable from "./ReservationTable";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedLocation, setSelectedLocation] = useState("Bandung");
  const [view, setView] = useState("list");
  const [prefillData, setPrefillData] = useState({ time: "", court: "" });
  const [reservations, setReservations] = useState([]);

  const handleAddReservation = () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }

    setPrefillData({ time: "", court: "" });
    setView("add");
  };

  const handleCellClick = (time, court) => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }

    setPrefillData({ time, court });
    setView("add");
  };

  useEffect(() => {
    const fetchReservation = async () => {
      const response = await api.get(
        `reservation/reservations?location=${selectedLocation}&date=${selectedDate}`,
      );
      setReservations(response.data.data);
    };
    fetchReservation();
  }, [selectedDate, selectedLocation, view]);

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
    <div className="flex-1 p-4 md:p-8 relative min-h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border-2 border-white/60 dark:border-white/10 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Jadwal Lapangan
            </h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Pilih waktu terbaik untuk aktivitas olahraga Anda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Lokasi
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 rounded-2xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary h-12 min-w-[140px] shadow-inner"
              >
                <option value="Bandung">Bandung</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 rounded-2xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary h-12 shadow-inner"
              />
            </div>
            <Button 
              onClick={handleAddReservation} 
              className="mt-auto h-12 rounded-2xl px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              Cek Ketersediaan
            </Button>
          </div>
        </div>

        <ReservationTable
          reservations={reservations}
          scheduleTime={scheduleTime}
          onCellClick={handleCellClick}
        />
      </div>
    </div>
  );
}
