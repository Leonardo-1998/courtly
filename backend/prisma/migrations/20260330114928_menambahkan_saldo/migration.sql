/*
  Warnings:

  - The `status` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateEnum
CREATE TYPE "MidtransStatus" AS ENUM ('pending', 'settlement', 'expire', 'deny', 'cancel', 'capture', 'failure', 'refund', 'chargeback', 'partial_refund', 'partial_chargeback', 'authorized');

-- AlterTable
ALTER TABLE "Midtrans" ADD COLUMN     "status" "MidtransStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "status",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "saldo" INTEGER NOT NULL DEFAULT 0;
