# Courtly - Frontend

The frontend of Courtly is a modern, high-performance React application built with Vite and Tailwind CSS. It features a premium Glassmorphism design system.

## 🚀 Features

- **Modern UI/UX**: Glassmorphism aesthetic with dynamic backgrounds and smooth transitions.
- **Reservation Management**: Add new bookings, view active reservations, and check history.
- **Midtrans Integration**: Snap pop-up for secure and seamless payments.
- **Paginasi**: Efficiently handle large sets of reservation history.
- **Protected Routes**: Secure access to user dashboards and booking forms.

## 🛠️ Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI
- **Icons**: Lucide React
- **Validation**: React Hook Form + Zod
- **Networking**: Axios

## 📦 Installation

```bash
cd frontend
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the `frontend` root:

```env
VITE_API_URL=http://localhost:3000
VITE_MIDTRANS_CLIENT_KEY=your_client_key
```

## 🏃 Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build
```

## 📂 Key Directory Structure

- `src/components`: Reusable UI components.
- `src/pages`: Feature-based route components.
- `src/lib`: API configuration and utility helpers.
- `src/hooks`: Custom React hooks for data fetching and state.
