# Courtly - Sports Court Reservation System

A full-stack, end-to-end sports facility reservation system designed for seamless booking experiences and secure payment processing.

## 🚀 Overview

**Courtly** is a modern web application that allows users to book sports courts (e.g., Badminton, Futsal, Basketball) online. The system features a robust backend for managing reservations and a clean, responsive frontend for an optimal user experience. It integrates the **Midtrans Payment Gateway** to handle secure transactions automatically.

---

## ✨ Key Features

- **Secure Reservation System**: Real-time booking with specific time slots and court selection.
- **Midtrans Payment Integration**: Integrated with Midtrans Snap and Webhooks for automated payment status updates (Settlement, Pending, Expired, etc.).
- **User Authentication**: Secure user registration and login using JWT and password hashing.
- **Reservation Management**: Track booking history and status through a centralized dashboard.
- **Relational Data Mapping**: Comprehensive database schema designed for scalability using Prisma ORM.

---

## 🛠️ Technology Stack

### **Backend**
- **Framework**: [NestJS](https://nestjs.com/) (Progressive Node.js framework)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **API Documentation**: Implementation of RESTful architecture

### **Frontend**
- **Library**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Form Handling**: React Hook Form & Zod (Schema Validation)

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
- **Leonardo** - *Full Stack Developer*

---
*This documentation was generated for professional portfolio and developer reference purposes.*
