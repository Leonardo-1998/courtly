import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reservationSchema = z.object({
  location: z.string(),
  date: z.string(),
  time: z.string().min(1, { message: "Pilih waktu terlebih dahulu" }),
  court: z.string().min(1, { message: "Pilih lapangan terlebih dahulu" }),
  price: z.string(),
});

export default function AddReservation({
  onClose,
  selectedDate,
  selectedLocation,
  initialTime = "",
  initialCourt = "",
}) {
  const navigate = useNavigate();
  const fixedPrice = "Rp 50.000";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      location: selectedLocation || "Bandung",
      date: selectedDate || new Date().toISOString().split("T")[0],
      time: initialTime,
      court: initialCourt,
      price: fixedPrice,
    },
  });

  // Update form values when props change
  useEffect(() => {
    reset({
      location: selectedLocation,
      date: selectedDate,
      time: initialTime,
      court: initialCourt,
      price: fixedPrice,
    });
  }, [selectedLocation, selectedDate, initialTime, initialCourt, reset]);

  function onSubmit(values) {
    console.log("Reservation Submitted:", values);
    alert(
      `Reservasi Berhasil!\n\nLapangan: ${values.court}\nLokasi: ${values.location}\nTanggal: ${values.date}\nWaktu: ${values.time}\nHarga: ${values.price}`,
    );
    if (onClose) {
      onClose();
    } else {
      navigate("/reservasi");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tambah Reservasi</CardTitle>
          <CardDescription>
            Isi detail reservasi Anda di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                {...register("location")}
                readOnly
                className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                readOnly
                className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Waktu</Label>
              <select
                id="time"
                {...register("time")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Pilih Waktu --</option>
                <option value="09.00 - 10.00">09.00 - 10.00</option>
                <option value="10.00 - 11.00">10.00 - 11.00</option>
                <option value="11.00 - 12.00">11.00 - 12.00</option>
                <option value="12.00 - 13.00">12.00 - 13.00</option>
                <option value="13.00 - 14.00">13.00 - 14.00</option>
                <option value="14.00 - 15.00">14.00 - 15.00</option>
                <option value="15.00 - 16.00">15.00 - 16.00</option>
                <option value="16.00 - 17.00">16.00 - 17.00</option>
              </select>
              {errors.time && (
                <p className="text-sm font-medium text-destructive">
                  {errors.time.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Lapangan</Label>
              <select
                id="court"
                {...register("court")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Pilih Lapangan --</option>
                <option value="Lapangan A">Lapangan A</option>
                <option value="Lapangan B">Lapangan B</option>
                <option value="Lapangan C">Lapangan C</option>
              </select>
              {errors.court && (
                <p className="text-sm font-medium text-destructive">
                  {errors.court.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                {...register("price")}
                readOnly
                className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed font-semibold text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-lg">
              Konfirmasi Reservasi
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="link"
            onClick={onClose || (() => navigate("/reservasi"))}
            className="text-muted-foreground"
          >
            Batal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
