import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="relative text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors py-2 group"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></span>
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("accessToken");
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUserData(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-white/20 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl px-6 h-20 flex items-center shadow-xl shadow-slate-900/5">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-primary rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
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
          <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">
            Reservasi
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" label="Home" />
          <NavLink to="/reservasi" label="Jadwal" />
          {userData ? (
            <>
              <NavLink to="/dashboard" label="Dashboard" />
              <NavLink to="/dashboard/riwayat" label="Riwayat" />
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          {userData ? (
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selamat Datang</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{userData.username}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="h-11 rounded-xl px-6 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 hover:text-red-500 transition-all border-2 border-transparent hover:border-red-500/20"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="h-11 rounded-xl px-6 font-black uppercase tracking-widest text-xs">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="h-11 rounded-xl px-6 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all active:scale-95">
                <Link to="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
