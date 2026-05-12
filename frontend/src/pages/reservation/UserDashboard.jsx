import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast, Bounce } from "react-toastify";

// Sub-components
import DashboardHeader from "./components/DashboardHeader";
import ActiveReservationsHeader from "./components/ActiveReservationsHeader";
import ReservationGrid from "./components/ReservationGrid";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "./components/DashboardStates";
import WalletCard from "./components/WalletCard";
import TopupModal from "./components/TopupModal";

const UserDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [closestReservations, setClosestReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  const getReservationStart = (item) => {
    const reservationDate = new Date(item.date);
    const [startHour, startMinute] = item.startTime.split(".").map(Number);
    reservationDate.setHours(startHour, startMinute, 0, 0);
    return reservationDate;
  };

  const isCancellable = (item) => {
    const now = new Date();
    const start = getReservationStart(item);
    const diffInHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours >= 24;
  };

  const isPast = (item) => {
    const now = new Date();
    const start = getReservationStart(item);
    return start < now;
  };

  const handleCancel = async (item) => {
    if (!isCancellable(item)) {
      alert("Reservasi hanya dapat dibatalkan minimal 24 jam sebelum jadwal.");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) {
      try {
        await api.delete(`reservation/${item.id}`);
        setReservations((prev) => prev.filter((res) => res.id !== item.id));
        setClosestReservations((prev) =>
          prev.filter((res) => res.id !== item.id),
        );
      } catch (err) {
        console.error("Cancel error:", err);
        alert("Gagal membatalkan reservasi");
      }
    }
  };

  const handlePayment = (token) => {
    if (!window.snap) {
      alert("Midtrans Snap belum dimuat. Silakan coba lagi nanti.");
      return;
    }
    window.snap.pay(token, {
      onSuccess: function (result) {
        toast.success("Pembayaran Berhasil!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => window.location.reload(), 1500);
      },
      onPending: function (result) {
        toast.info("Menunggu Pembayaran...", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => window.location.reload(), 1500);
      },
      onError: function (result) {
        toast.error("Pembayaran Gagal!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
      },
      onClose: function () {
        toast.info("Anda menutup jendela pembayaran", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      },
    });
  };

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        setLoading(true);
        const [resResponse, userResponse] = await Promise.all([
          api.get("reservation/my-reservations?status=pending,paid"),
          api.get("user/me"),
        ]);

        const data = resResponse.data.data.filter((item) => !isPast(item));
        setReservations(data || []);
        setClosestReservations(data.slice(0, 3) || []);
        setBalance(userResponse.data.data.balance || 0);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservations();

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
    <div className="flex-1 p-4 md:p-8 overflow-y-auto relative min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <DashboardHeader
          title="Dashboard Saya"
          description="Kelola dan lihat riwayat reservasi Anda dengan sentuhan modern."
        />

        <WalletCard
          balance={balance}
          onTopupClick={() => setIsTopupModalOpen(true)}
        />

        <div className="space-y-6">
          <ActiveReservationsHeader count={reservations.length} />

          <div className="relative min-h-[400px]">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} />
            ) : reservations.length === 0 ? (
              <EmptyState />
            ) : (
              <ReservationGrid
                viewAll={viewAll}
                reservations={reservations}
                closestReservations={closestReservations}
                setViewAll={setViewAll}
                isPast={isPast}
                isCancellable={isCancellable}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </div>

      <TopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        onTokenReceived={(token) => {
          console.log("Token received for Top-up:", token);
          handlePayment(token);
        }}
      />
    </div>
  );
};

export default UserDashboard;
