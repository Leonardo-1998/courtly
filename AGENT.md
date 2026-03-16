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
| ∟ `common/` | Filter, interceptor, dan decorator yang digunakan global. |
| ∟ `dto/` | Data Transfer Objects untuk validasi request (e.g. Midtrans notification). |
| ∟ `midtrans/` | Modul integrasi dengan layanan pembayaran Midtrans. |
| ∟ `prisma/` | Client database yang di-generate dari schema. |
| ∟ `reservation/` | Logika bisnis utama terkait pemesanan/reservasi. |
| ∟ `user/` | Manajemen pengguna (Auth, Profile). |
| ∟ `utils/` | Fungsi pembantu (helper functions). |
| `prisma/` | Folder konfigurasi Prisma. |
| ∟ `schema.prisma` | Definisi tabel database dan relasi (User, Reservation, Midtrans). |
| `.env` | Konfigurasi variabel lingkungan (DB URL, Midtrans Keys). |
| `nest-cli.json` | Konfigurasi CLI NestJS. |

---

### 3. Frontend (`/frontend`)
Aplikasi web client yang interaktif.

| Direktori/File | Kegunaan |
| :--- | :--- |
| `src/` | Folder utama kode sumber React. |
| ∟ `assets/` | File statis seperti gambar atau icon. |
| ∟ `components/` | Komponen UI yang reusable (menggunakan Shadcn/UI). |
| ∟ `lib/` | Konfigurasi library seperti Axios atau Utils. |
| ∟ `pages/` | Komponen halaman utama aplikasi. |
| `public/` | Asset publik yang diakses langsung via URL. |
| `components.json` | Konfigurasi untuk Shadcn/UI. |
| `vite.config.js` | Konfigurasi build tool Vite. |
| `tailwind.config.js` | Konfigurasi styling CSS. |

---

## 🔑 File Penting & Dokumentasi Tambahan

### Database Schema (`backend/prisma/schema.prisma`)
Berisi 3 model utama:
- `User`: Menyimpan informasi akun pengguna.
- `Reservation`: Detail pesanan (waktu, lokasi, harga, status).
- `Midtrans`: Log transaksi dan token pembayaran.

### Panduan UUID (`backend/UUID_GUIDE.md`)
Dokumentasi spesifik mengenai penggunaan UUID dalam proyek untuk menjamin keunikan ID di seluruh sistem.

---

## 🚀 Perintah Pengembangan (Development Commands)

### Backend
```bash
cd backend
npm install
npm run start:dev   # Menjalankan server dalam mode watch
npx prisma generate # Men-generate client prisma
npx prisma db push  # Sinkronisasi schema ke database
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # Menjalankan aplikasi web secara lokal
```

---

## 💡 Catatan Penting untuk Pengembangan
- **Validasi**: Gunakan `class-validator` di backend dan `zod` di frontend.
- **Styling**: Selalu gunakan utility classes dari Tailwind CSS untuk konsistensi.
- **Pembayaran**: Pastikan `.env` di backend terisi dengan `MIDTRANS_SERVER_KEY` yang valid untuk testing.
