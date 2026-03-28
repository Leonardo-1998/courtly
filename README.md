# Courtly - Sports Court Reservation System

A full-stack, end-to-end sports facility reservation system designed for seamless booking experiences and secure payment processing.

## 🚀 Overview

**Courtly** is a modern web application that allows users to book sports courts (e.g., Badminton, Futsal, Basketball) online. The system features a robust backend for managing reservations and a clean, responsive frontend for an optimal user experience. It integrates the **Midtrans Payment Gateway** to handle secure transactions automatically.

---

## ✨ Key Features

- **Modern Glassmorphism UI**: A stunning, premium interface with dynamic background blobs, frosted glass effects, and responsive layout.
- **Secure Reservation System**: Real-time booking with specific time slots and court selection.
- **Reservation History & Pagination**: A dedicated dashboard for tracking past and upcoming bookings with efficient pagination (5, 10, or 20 items per page).
- **Midtrans Payment Integration**: Seamlessly integrated with Midtrans Snap for pop-up payments and Webhooks for automated status updates (Settlement, Pending, Expired, etc.).
- **User Authentication**: Secure user registration and login using JWT and bcrypt password hashing.
- **Relational Data Mapping**: Scalable database schema using Prisma ORM with UUID-based primary keys.

---

## 🛠️ Technology Stack

### **Backend**

- **Framework**: [NestJS](https://nestjs.co
  m/) (Progressive Node.js framework)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **Payment**: [Midtrans SDK](https://midtrans.com/)

### **Frontend**

- **Library**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism design)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Validation**: React Hook Form & Zod

---

## 📂 Project Architecture

The project is organized in a monorepo-style structure:

```text
Reservation/
├── backend/          # NestJS Server API
│   ├── src/          # Business logic, DTOs, and controllers
│   └── prisma/       # Database schema and migrations
├── frontend/         # React Application
│   ├── src/          # UI Components, Pages, and Hooks
│   └── public/       # Static assets
└── AGENT.md          # Technical structural documentation
```

---

## 🔧 Installation & Setup

### **Prerequisites**

- Node.js (v18+)
- PostgreSQL Database
- Midtrans Sandbox Account

### **1. Backend Configuration**

```bash
cd backend
npm install
# Create a .env file based on environment requirements
npx prisma generate
npx prisma db push
npm run start:dev
```

### **2. Frontend Configuration**

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security Measures

- **Password Hashing**: Implemented using `bcrypt` to ensure user data protection.
- **Validation**: Strict request validation using `class-validator` (Backend) and `Zod` (Frontend).
- **Environment Safety**: Sensitive keys (DB URL, Midtrans Keys) are managed through environment variables.

---

## 👤 Author

- **Leonardo** - _Full Stack Developer_

---

_This documentation was generated for professional portfolio and developer reference purposes._
