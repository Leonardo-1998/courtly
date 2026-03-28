# Courtly - Backend

The backend of Courtly is a robust, scalable NestJS API designed for managing sports court reservations and processing payments via Midtrans.

## 🚀 Key Features

- **Auth System**: Secure JWT-based authentication and bcrypt password hashing.
- **Reservation API**: Complete CRUD for bookings with advanced time slot management.
- **Midtrans Integration**: Automated payment processing with status sync via webhooks.
- **Paginasi Support**: Efficient data fetching with `page`, `limit`, `skip`, and `take`.
- **Relational DB**: PostgreSQL managed with Prisma ORM and UUID primary keys.

## 🛠️ Tech Stack

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Security**: JWT + bcrypt
- **Validation**: Class-validator + Class-transformer
- **Payment**: Midtrans SDK

## 📦 Installation

```bash
cd backend
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the `backend` root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/courtly"
JWT_SECRET="your_very_secret_key"
MIDTRANS_SERVER_KEY="your_server_key"
MIDTRANS_CLIENT_KEY="your_client_key"
MIDTRANS_IS_PRODUCTION=false
```

## 🏃 Running the Application

```bash
# Generate Prisma Client
npx prisma generate

# Sync Database Schema
npx prisma db push

# Run in Development
npm run start:dev
```

## 📂 Key Directory Structure

- `src/api`: Controller and Service modules for User, Reservation, and Midtrans.
- `src/common`: Global filters, guards, and response standardizers.
- `src/dto`: Shared request and response data transfer objects.
- `prisma`: Database schema definition and migration history.
