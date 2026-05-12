import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import ReservationList from "./pages/reservation/ReservationList";
import UserDashboard from "./pages/reservation/UserDashboard";
import ReservationHistory from "./pages/reservation/ReservationHistory";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
        {/* Global Dynamic Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-emerald-500/20 blur-[110px]"></div>
        </div>

        <Navbar />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
          stacked
        />
        <main className="flex-1 flex flex-col relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reservasi" element={<ReservationList />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route
                path="/dashboard/riwayat"
                element={<ReservationHistory />}
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
