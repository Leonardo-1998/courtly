import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
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
import { Bounce, toast } from "react-toastify";
import { Calendar, Zap } from "lucide-react";

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
    paymentMethod: z.enum(["MIDTRANS", "SALDO"], {
      required_error: "Pilih metode pembayaran",
    }),
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
  checkIsPast,
}) {
  const navigate = useNavigate();
  const [isPast, setIsPast] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
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
      paymentMethod: "MIDTRANS",
    },
  });

  const watchedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/me");
        setUserProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");

  // Logika otomatis untuk Jam Selesai dan Perhitungan Harga
  useEffect(() => {
    const startIndex = timeOptions.indexOf(watchedStartTime);
    const endIndex = timeOptions.indexOf(watchedEndTime);
    setIsPast(checkIsPast(selectedDate, watchedStartTime));

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

      // Jika bayar pakai saldo, langsung sukses
      if (values.paymentMethod === "SALDO") {
        toast.success("Reservasi Berhasil Menggunakan Saldo!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        navigate("/dashboard/riwayat");
        return;
      }

      // Jika bayar pakai Midtrans, buka Snap
      window.snap.pay(response.data.data, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log("payment success!");
          console.log(result);
          toast.success("Pembayaran Berhasil!", {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
          });
          navigate("/dashboard/riwayat");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log("payment pending!");
          console.log(result);
          toast.info("Menunggu Pembayaran...", {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          navigate("/dashboard/riwayat");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log("payment error!");
          console.log(result);
          toast.error("Pembayaran Gagal!", {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          navigate("/dashboard/riwayat");
        },
        onClose: function () {
          /* You may add your own implementation here */
          toast.info("Anda menutup jendela pembayaran", {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
          });
          navigate("/dashboard/riwayat");
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
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
    <div className="flex flex-1 items-center justify-center p-4 relative overflow-hidden min-h-screen">
      <div className="w-full max-w-md relative z-10 group">
        {/* Glassmorphism Card Background */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border-2 border-white/60 dark:border-white/10 shadow-2xl z-0 transition-all duration-500 group-hover:shadow-primary/10"></div>

        <Card className="relative z-10 bg-transparent border-none shadow-none overflow-hidden rounded-[2.5rem]">
          <CardHeader className="space-y-2 pt-10 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Tambah Reservasi
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
              Konfirmasi jadwal pilihan Anda di bawah ini
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >
                    Lokasi
                  </Label>
                  <Input
                    id="location"
                    {...register("location")}
                    readOnly
                    className="h-12 rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 cursor-not-allowed font-bold shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >
                    Tanggal
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    readOnly
                    className="h-12 rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 cursor-not-allowed font-bold shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="startTime"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >
                    Jam Mulai
                  </Label>
                  <select
                    id="startTime"
                    {...register("startTime")}
                    className="flex h-12 w-full rounded-2xl border-2 border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary shadow-inner"
                  >
                    <option value="">-- Mulai --</option>
                    {timeOptions.slice(0, -1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <p className="text-[10px] font-bold text-red-500 ml-1">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="endTime"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >
                    Jam Selesai
                  </Label>
                  <select
                    id="endTime"
                    {...register("endTime")}
                    className="flex h-12 w-full rounded-2xl border-2 border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary shadow-inner"
                  >
                    <option value="">-- Selesai --</option>
                    {timeOptions.slice(1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && (
                    <p className="text-[10px] font-bold text-red-500 ml-1">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="court"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                >
                  Lapangan
                </Label>
                <select
                  id="court"
                  {...register("court")}
                  className="flex h-12 w-full rounded-2xl border-2 border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary shadow-inner"
                >
                  <option value="">-- Pilih Lapangan --</option>
                  <option value="Lapangan A">Lapangan A</option>
                  <option value="Lapangan B">Lapangan B</option>
                  <option value="Lapangan C">Lapangan C</option>
                </select>
                {errors.court && (
                  <p className="text-[10px] font-bold text-red-500 ml-1">
                    {errors.court.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="paymentMethod"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                >
                  Metode Pembayaran
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      watchedPaymentMethod === "MIDTRANS"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      value="MIDTRANS"
                      {...register("paymentMethod")}
                      className="hidden"
                    />
                    <Zap className="h-5 w-5 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Midtrans
                    </span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      watchedPaymentMethod === "SALDO"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      value="SALDO"
                      {...register("paymentMethod")}
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Saldo
                    </span>
                  </label>
                </div>
                {watchedPaymentMethod === "SALDO" && userProfile && (
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-bold text-slate-400">
                      SALDO ANDA:
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {formatCurrency(userProfile.saldo)}
                    </span>
                  </div>
                )}
                {errors.paymentMethod && (
                  <p className="text-[10px] font-bold text-red-500 ml-1">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>ESTIMASI BIAYA</span>
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <Input
                  id="price"
                  {...register("price")}
                  readOnly
                  className="bg-transparent border-none p-0 h-auto text-3xl font-black text-primary cursor-default shadow-none focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                disabled={isPast}
                className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPast ? "Tidak Bisa Reservasi" : "Konfirmasi Reservasi"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pb-10">
            <Button
              variant="link"
              onClick={onClose || (() => navigate("/reservasi"))}
              className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors"
            >
              Kembali ke Jadwal
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
