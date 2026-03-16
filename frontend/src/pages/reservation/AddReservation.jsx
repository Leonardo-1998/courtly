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
import api from "@/lib/axios";

const timeOptions = [
  "09.00",
  "10.00",
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
  "17.00",
];

const reservationSchema = z
  .object({
    location: z.string(),
    date: z.string(),
    startTime: z.string().min(1, { message: "Pilih jam mulai" }),
    endTime: z.string().min(1, { message: "Pilih jam selesai" }),
    court: z.string().min(1, { message: "Pilih lapangan" }),
    price: z.string(),
  })
  .superRefine((data, ctx) => {
    const startIdx = timeOptions.indexOf(data.startTime);
    const endIdx = timeOptions.indexOf(data.endTime);

    if (startIdx !== -1 && endIdx !== -1 && endIdx <= startIdx) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Jam selesai harus setelah jam mulai",
        path: ["endTime"],
      });
    }
  });

export default function AddReservation({
  onClose,
  selectedDate,
  selectedLocation,
  initialTime = "",
  initialCourt = "",
}) {
  const navigate = useNavigate();
  const fixedPricePerPool = 50000;

  // Split initialTime (e.g. "09.00 - 10.00") if provided
  const prefillStart = initialTime ? initialTime.split(" - ")[0] : "";
  const prefillEnd = initialTime ? initialTime.split(" - ")[1] : "";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      location: selectedLocation || "Bandung",
      date: selectedDate || new Date().toISOString().split("T")[0],
      startTime: prefillStart,
      endTime: prefillEnd,
      court: initialCourt,
      price: "Rp 50.000",
    },
  });

  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");

  // Logika otomatis untuk Jam Selesai dan Perhitungan Harga
  useEffect(() => {
    const startIndex = timeOptions.indexOf(watchedStartTime);
    const endIndex = timeOptions.indexOf(watchedEndTime);

    // 1. Auto-fill jam selesai jika kosong atau tidak valid
    if (watchedStartTime && startIndex !== -1) {
      if (endIndex === -1 || endIndex <= startIndex) {
        const nextTime = timeOptions[startIndex + 1];
        if (nextTime) {
          setValue("endTime", nextTime);
        }
      }
    }

    // 2. Hitung harga berdasarkan durasi yang terpilih
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const hours = endIndex - startIndex;
      const totalPrice = hours * fixedPricePerPool;
      setValue("price", `Rp ${totalPrice.toLocaleString("id-ID")}`);
    } else {
      setValue("price", "Rp 0");
    }
  }, [watchedStartTime, watchedEndTime, setValue]);

  // Update form values when props change
  useEffect(() => {
    const start = initialTime ? initialTime.split(" - ")[0] : "";
    const end = initialTime ? initialTime.split(" - ")[1] : "";

    // Hitung harga awal berdasarkan durasi
    const startIndex = timeOptions.indexOf(start);
    const endIndex = timeOptions.indexOf(end);
    let initialPriceDisplay = "Rp 0";

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const hours = endIndex - startIndex;
      const totalPrice = hours * fixedPricePerPool;
      initialPriceDisplay = `Rp ${totalPrice.toLocaleString("id-ID")}`;
    }

    reset({
      location: selectedLocation,
      date: selectedDate,
      startTime: start,
      endTime: end,
      court: initialCourt,
      price: initialPriceDisplay,
    });
  }, [selectedLocation, selectedDate, initialTime, initialCourt, reset]);

  const onSubmit = async (values) => {
    try {
      const response = await api.post("/reservation/add", values);

      window.snap.pay(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScript;
    script.async = true;
    script.setAttribute("data-client-key", clientKey);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Jam Mulai</Label>
                <select
                  id="startTime"
                  {...register("startTime")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">-- Mulai --</option>
                  {timeOptions.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.startTime && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Jam Selesai</Label>
                <select
                  id="endTime"
                  {...register("endTime")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">-- Selesai --</option>
                  {timeOptions.slice(1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.endTime && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Lapangan</Label>
              <select
                id="court"
                {...register("court")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
