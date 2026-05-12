import React from "react";
import { Wallet, PlusCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WalletCard = ({ balance, onTopupClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="relative overflow-hidden group border-none bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-2xl transition-all duration-300 hover:shadow-emerald-500/20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-100/80 font-medium">
              <Wallet size={18} className="animate-pulse" />
              <span className="text-sm tracking-wide uppercase">Saldo Akun</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-baseline gap-1">
              <span className="text-2xl font-bold opacity-80">Rp</span>
              {balance.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onTopupClick}
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-6 py-6 rounded-2xl shadow-lg hover:translate-y-[-2px] transition-all active:scale-95 group"
            >
              <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Isi Saldo
            </Button>
          </div>
        </div>

        {/* Quick Stats/Actions Placeholder */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6 text-emerald-100/70 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <ArrowUpCircle size={14} className="text-emerald-300" />
            <span>TOPUP TERAKHIR: Rp 50.000</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/30"></div>
          <div>TRANSAKSI AMAN & CEPAT</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
