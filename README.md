# Courtly - Sports Court Reservation System

A full-stack, end-to-end sports facility reservation system designed for seamless booking experiences, secure payment processing, and integrated wallet management.

## 🚀 Overview

**Courtly** is a modern web application that allows users to book sports courts (e.g., Badminton, Futsal, Basketball) online. The system features a robust backend for managing reservations, a clean glassmorphism-inspired frontend for an optimal user experience, and a dual-payment system integrating **Midtrans Payment Gateway** and a **User Balance (Wallet)**.

---

## ✨ Key Features

- **Modern Glassmorphism UI**: A stunning, premium interface with dynamic background blobs, frosted glass effects, and responsive layout.
- **Secure Reservation System**: Real-time booking with specific time slots, court selection, and instant availability checks.
- **Dual Payment Methods**: 
  - **Midtrans Snap**: Seamless integrated pop-up payments for cards, e-wallets, and bank transfers.
  - **Account Balance (Wallet)**: Pay instantly using your in-app balance.
- **Top-Up & Wallet System**: Secure top-up mechanism via Midtrans to increase account balance.
- **Financial Transaction History**: Full audit trail of all balance mutations (Top-ups, Payments, Refunds) with transaction statuses.
- **Authentication Options**: 
  - **Standard**: Secure user registration and login using JWT and Bcrypt.
  - **Google OAuth**: One-tap sign-in/registration for a frictionless onboarding experience.
- **Reservation Management**: A dedicated dashboard for tracking past and upcoming bookings with efficient pagination.
- **Relational Data Mapping**: Scalable database schema using Prisma ORM with UUID-based primary keys and PostgreSQL.

---

## 🛠️ Technology Stack

### **Backend**

- **Framework**: [NestJS](https://nestjs.com/) (Modular, scalable Node.js architecture)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT (JSON Web Tokens), Passport.js, & Google OAuth
- **Payment Gateway**: [Midtrans SDK](https://midtrans.com/)
- **Validation**: Class-validator & Class-transformer

### **Frontend**

- **Library**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) (Glassmorphism design)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **State & Logic**: React Hook Form, Zod (Validation), Axios
- **Authentication**: `@react-oauth/google`

---

## 📂 Project Architecture

The project is organized in a monorepo-style structure for clean separation of concerns:

```text
Reservation/
├── backend/          # NestJS Server API
│   ├── src/api/      # Feature modules (User, Reservation, Wallet, Topup, Midtrans)
│   ├── src/prisma/   # Generated Prisma Client
│   └── prisma/       # Database schema and migrations
├── frontend/         # React Application (Vite)
│   ├── src/components/ # Reusable UI components
│   ├── src/pages/      # View layouts (Dashboard, Booking, History, etc.)
│   └── src/hooks/      # Custom React hooks for API interaction
└── README.md         # Project documentation
```

---

## 🔧 Installation & Setup

### **Prerequisites**

- Node.js (v18+)
- PostgreSQL Database
- Midtrans Sandbox Account
- Google Cloud Console Project (for OAuth)

### **1. Backend Configuration**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (`.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/courtly"
   JWT_SECRET="your_secret_key"
   MIDTRANS_CLIENT_KEY="your_midtrans_client_key"
   MIDTRANS_SERVER_KEY="your_midtrans_server_key"
   GOOGLE_CLIENT_ID="your_google_oauth_client_id"
   NEXT_PUBLIC_API="http://localhost:3000"
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the server:
   ```bash
   npm run start:dev
   ```

### **2. Frontend Configuration**

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (`.env`):
   ```env
   VITE_API_URL="http://localhost:3000"
   VITE_GOOGLE_CLIENT_ID="your_google_oauth_client_id"
   VITE_MIDTRANS_CLIENT_KEY="your_midtrans_client_key"
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

---

## 🔒 Security & Best Practices

- **Atomic Transactions**: Balance mutations and reservations use Prisma transactions to ensure data consistency.
- **JWT Protection**: All sensitive API routes are guarded by JWT authentication strategies.
- **Webhook Validation**: Midtrans webhooks are processed with server-side validation to prevent payment fraud.
- **Input Sanitization**: Strict schema validation on both client and server layers.

---

## 👤 Author

- **Leonardo** - _Full Stack Developer_

---

_This documentation reflects the complete evolution of the Courtly system, from basic reservations to a comprehensive financial and booking platform._
