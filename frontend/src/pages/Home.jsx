import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  Star,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border-2 border-primary/20 bg-primary/10 px-6 py-2 text-sm font-black text-primary mb-8 backdrop-blur-xl shadow-lg shadow-primary/5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-pulse" />
            PLATFORM RESERVASI NO. 1 DI INDONESIA
          </div>
          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-7xl mb-8 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white">
              Pesan Lapangan Favoritmu
            </span>
            <br />
            <span className="text-slate-800 dark:text-slate-200">Dengan Lebih Mudah</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed font-medium">
            Platform modern yang memberikan kemudahan pencarian jadwal, 
            pembayaran instan, dan jaminan ketersediaan secara real-time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 bg-primary hover:bg-primary/90 h-14 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
            >
              <Link to="/reservasi">
                Mulai Reservasi <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-10 h-14 text-sm font-black uppercase tracking-widest border-2 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <Link to="/login">Lihat Jadwal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
              Keunggulan
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
              Kami menghadirkan fitur-fitur terbaik untuk kenyamanan aktivitas olahraga Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-amber-500" />}
              title="Booking Instan"
              description="Proses cepat tanpa menunggu lama, langsung konfirmasi jadwal dalam hitungan detik."
              color="amber"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-indigo-500" />}
              title="Real-time Schedule"
              description="Jadwal yang selalu terupdate otomatis untuk menghindari double booking."
              color="indigo"
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-emerald-500" />}
              title="Keamanan Terjamin"
              description="Setiap transaksi dan data pribadi Anda dilindungi dengan sistem keamanan tingkat tinggi."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 relative overflow-hidden bg-white/30 dark:bg-white/5 backdrop-blur-md border-y border-white/20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                 <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  Panduan
                </div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
                  Cara Kerja Kami <br /> Sangat Sederhana
                </h2>
              </div>
              <div className="space-y-8">
                <StepItem
                  number="01"
                  title="Pilih Lokasi & Tanggal"
                  text="Cari ketersediaan lapangan berdasarkan lokasi terdekat dan waktu luangmu."
                />
                <StepItem
                  number="02"
                  title="Tentukan Lapangan"
                  text="Pilih tipe lapangan yang sesuai dengan kebutuhan pertandingan atau latihanmu."
                />
                <StepItem
                  number="03"
                  title="Konfirmasi & Selesai"
                  text="Lakukan pembayaran dan tunjukkan bukti reservasi saat tiba di lokasi."
                />
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full animate-pulse"></div>
              <div className="aspect-square rounded-[3rem] bg-white/40 dark:bg-white/5 border-2 border-white/60 dark:border-white/10 backdrop-blur-2xl p-12 flex items-center justify-center relative z-10 shadow-2xl">
                <div className="grid grid-cols-2 gap-6 scale-110">
                  <div className="h-32 w-32 rounded-3xl bg-primary/20 animate-pulse shadow-xl shadow-primary/10" />
                  <div className="h-32 w-32 rounded-3xl bg-indigo-500/20 animate-pulse delay-150 shadow-xl shadow-indigo-500/10 translate-y-10" />
                  <div className="h-32 w-32 rounded-3xl bg-emerald-500/20 animate-pulse delay-300 shadow-xl shadow-emerald-500/10 -translate-y-10" />
                  <div className="h-32 w-32 rounded-3xl bg-slate-500/10 animate-pulse delay-500 shadow-xl shadow-slate-500/5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Wrap */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-primary rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-11.5 -10.23174 23 20.46348"
                      className="h-6 w-6 text-white"
                    >
                      <circle cx="0" cy="0" r="2.05" fill="currentColor" />
                      <g stroke="currentColor" strokeWidth="1" fill="none">
                        <ellipse rx="11" ry="4.2" />
                        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                      </g>
                    </svg>
                </div>
                <span className="text-2xl font-black tracking-tight uppercase">
                  Reservasi
                </span>
              </div>
              <p className="text-sm font-medium leading-[1.8] text-slate-500">
                Platform reservasi terdepan untuk memudahkan aktivitas olahraga
                dan produktivitas Anda setiap hari dengan teknologi terbaik.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                   <a
                    key={i}
                    href="#"
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary hover:text-white text-slate-400 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Layanan</h4>
              <ul className="space-y-4 text-sm font-bold">
                {['Pesan Lapangan', 'Member Eksklusif', 'Kerjasama Mitra'].map((item) => (
                  <li key={item}>
                    <Link to="/reservasi" className="hover:text-primary transition-colors flex items-center gap-2 group">
                      <span className="h-px w-0 bg-primary group-hover:w-3 transition-all"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Perusahaan</h4>
              <ul className="space-y-4 text-sm font-bold">
                 {['Tentang Kami', 'Kontak', 'Karir'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                      <span className="h-px w-0 bg-primary group-hover:w-3 transition-all"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Dapatkan Aplikasi</h4>
               <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                     <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Star className="h-5 w-5 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-500">Available on</p>
                        <p className="text-sm font-black text-white">App Store</p>
                     </div>
                  </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                     <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Zap className="h-5 w-5 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-500">Get it on</p>
                        <p className="text-sm font-black text-white">Google Play</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              © 2024 RESERVASI APP. SELURUH HAK CIPTA DILINDUNGI.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Link to="#" className="hover:text-primary transition-colors">KETENTUAN</Link>
              <Link to="#" className="hover:text-primary transition-colors">PRIVASI</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20 hover:shadow-primary/10",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:shadow-amber-500/10",
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:shadow-indigo-500/10",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:shadow-emerald-500/10",
  }[color];

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 shadow-xl z-0 transition-colors group-hover:bg-white dark:group-hover:bg-white/10"></div>
      
      <div className="relative z-10 p-10 space-y-6">
        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition-all duration-500 group-hover:scale-110 ${colorClasses}`}>
          {icon}
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-[1.8] font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, text }) {
  return (
    <div className="flex gap-8 group">
      <div className="flex-none flex items-center justify-center h-14 w-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="space-y-2 pt-1">
        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-[1.8] font-medium max-w-sm">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Home;
