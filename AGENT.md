# AGENT.md - Dokumentasi Proyek Reservasi

Dokumen ini menjelaskan struktur direktori dan kegunaan file dalam proyek **Reservation** untuk mempermudah pengembangan bagi pengembang (human) dan AI agent.

## 🏗️ Gambaran Umum Proyek
Proyek ini adalah sistem reservasi dengan integrasi pembayaran melalui Midtrans. Terdiri dari backend berbasis NestJS dan frontend berbasis React (Vite).

### Stack Teknologi
- **Backend**: NestJS, Prisma ORM, PostgreSQL, Midtrans SDK.
- **Frontend**: React (Vite), Tailwind CSS, Shadcn/UI, React Hook Form, Zod.

---

## 📂 Struktur Direktori Utama

### 1. Root Directory
| Nama | Tipe | Kegunaan |
| :--- | :--- | :--- |
| `backend/` | Folder | Kode sumber dan konfigurasi untuk server API (NestJS). |
| `frontend/` | Folder | Kode sumber dan konfigurasi untuk antarmuka pengguna (React). |
| `README.md` | File | Dokumentasi dasar proyek. |
| `AGENT.md` | File | Panduan struktur dan detail proyek untuk AI/Human. |

---

### 2. Backend (`/backend`)
Server API yang menangani logika bisnis, database, dan integrasi Midtrans.

| Direktori/File | Kegunaan |
| :--- | :--- |
| `src/` | Folder utama kode sumber TypeScript. |
| ∟ `common/` | Filter, interceptor, dan decorator global. |
| ∟ ∟ `api.response.ts` | Utilitas untuk standarisasi format response API. |
| ∟ ∟ `guards/` | Proteksi route (e.g. `auth.guard.ts`). |
| ∟ `dto/` | Data Transfer Objects untuk validasi request (Midtrans, Reservation, Auth). |
| ∟ `midtrans/` | Modul integrasi payment gateway Midtrans (Controller, Service). |
| ∟ `prisma/` | Integrasi database via Prisma (Service & Module). |
| ∟ `reservation/` | Logika bisnis utama terkait pemesanan dan reservasi. |
| ∟ `user/` | Manajemen pengguna (Registrasi & Login). |
| ∟ `utils/` | Fungsi pembantu seperti `bcrypt.util.ts` dan `jwt.util.ts`. |
| `prisma/` | Folder konfigurasi Prisma. |
| ∟ `schema.prisma` | Definisi tabel database (User, Reservation, Midtrans). |
| `.env` | Konfigurasi variabel lingkungan (DB URL, Midtrans Keys). |

---

### 3. Frontend (`/frontend`)
Aplikasi web client yang interaktif.

| Direktori/File | Kegunaan |
| :--- | :--- |
| `src/` | Folder utama kode sumber React. |
| ∟ `components/` | Komponen UI yang dikelompokkan: |
| ∟ ∟ `auth/` | Komponen terkait autentikasi (e.g. ProtectedRoute). |
| ∟ ∟ `layout/` | Komponen struktur halaman (e.g. Navbar). |
| ∟ ∟ `ui/` | Komponen dasar dari Shadcn/UI (Button, Input, Form, dll). |
| ∟ `lib/` | Konfigurasi library seperti `axios.js` dan helper `utils.js`. |
| ∟ `pages/` | Halaman utama yang diorganisir per fitur: |
| ∟ ∟ `auth/` | Halaman Login dan Register. |
| ∟ ∟ `reservation/` | Dashboard, List Reservasi, History, dan Form Tambah. |
| ∟ ∟ ∟ `AddReservation.jsx` | Form pembuatan booking baru. |
| ∟ ∟ ∟ `ReservationHistory.jsx` | Halaman riwayat pemesanan dengan paginasi. |
| ∟ ∟ ∟ `ReservationList.jsx` | Tampilan daftar reservasi aktif. |
| ∟ ∟ ∟ `ReservationTable.jsx` | Komponen tabel reusable untuk reservasi. |
| ∟ ∟ ∟ `UserDashboard.jsx` | Ringkasan akun dan status booking. |
| `public/` | Asset publik (gambar, icon, dll). |
| `tailwind.config.js` | Konfigurasi styling CSS (termasuk variabel glassmorphism). |

---

## 🔑 File Penting & Dokumentasi Tambahan

### Database Schema (`backend/prisma/schema.prisma`)
Berisi 3 model utama:
- `User`: Akun pengguna.
- `Reservation`: Detail pesanan (waktu, lokasi, harga, status).
- `Midtrans`: Log transaksi dan sinkronisasi status pembayaran.

### Panduan UUID (`backend/UUID_GUIDE.md`)
Dokumentasi mengenai standarisasi penggunaan UUID sebagai primary key.

---

## 🚀 Perintah Pengembangan (Development Commands)

### Backend
```bash
cd backend
npm install
npm run start:dev   # Jalankan server mode dev
npx prisma generate # Update prisma client
npx prisma db push  # Update schema database
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # Jalankan dev server Vite
```

---

## 💡 Catatan Penting untuk Pengembangan
- **API Standard**: Gunakan helper di `common/api.response.ts` untuk setiap response.
- **Validasi**: Gunakan `class-validator` di backend dan `zod` di frontend.
- **Styling**: Gunakan Glassmorphism design system (vibrant colors, dark mode support, frosted glass cards).
- **Paginasi**: Backend mendukung parameter `page`, `limit`, `skip`, dan `take`. Metadata dikembalikan dalam field `meta`.
- **Pembayaran**: Endpoint Midtrans notification ada di `/midtrans/notification`.
