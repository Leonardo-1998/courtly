import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import api from "@/lib/axios";

const TopupModal = ({ isOpen, onClose, onTokenReceived }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [50000, 100000, 150000, 200000];

  const handleQuickSelect = (val) => {
    setAmount(val.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 10000) return;

    setLoading(true);
    try {
      const response = await api.post("/topup/payment", {
        amount: parseInt(amount),
      });
      const token = response.data.data;
      onTokenReceived(token);
      onClose();
    } catch (error) {
      console.error("Topup error:", error);
      alert("Gagal membuat permintaan pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] overflow-hidden border-none p-0 bg-transparent shadow-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all">
          <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight text-white m-0">
                  Isi Saldo Akun
                </DialogTitle>
              </div>
              <DialogDescription className="text-emerald-50 text-sm opacity-90 border-none m-0 p-0 leading-relaxed">
                Tingkatkan saldo Anda untuk transaksi lapangan yang lebih cepat
                dan mudah.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8 bg-white dark:bg-slate-900"
          >
            <div className="space-y-4">
              <Label
                htmlFor="amount"
                className="text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Nominal Top-Up
              </Label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-600 group-focus-within:scale-110 transition-transform">
                  Rp
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-14 h-16 text-2xl font-black border-slate-200 dark:border-slate-800 focus:ring-emerald-500 focus:border-emerald-500 rounded-2xl bg-slate-50 dark:bg-slate-950 transition-all shadow-sm group-hover:shadow-md"
                  min="10000"
                  required
                />
              </div>
              <p className="text-xs text-slate-400 font-medium ml-1">
                Minimal pengisian Rp 10.000
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Pilih Cepat
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickSelect(val)}
                    className={`h-14 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group ${
                      amount === val.toString()
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-2 ring-emerald-500/20"
                        : "hover:border-emerald-300 hover:bg-emerald-50 active:scale-95"
                    }`}
                  >
                    Rp {val.toLocaleString("id-ID")}
                    {amount === val.toString() && (
                      <CheckCircle2 className="absolute top-1 right-1 h-3 w-3 text-emerald-600" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 flex flex-col-reverse! sm:flex-row! items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="w-full sm:w-auto h-14 rounded-2xl font-bold text-slate-500 hover:text-slate-900 transition-all"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading || !amount}
                className="w-full h-14 rounded-2xl font-black bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-all group overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Bayar Sekarang</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none opacity-20"></div>
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopupModal;
