/*
  Warnings:

  - You are about to drop the `TransactionHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `midtransId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_userId_fkey";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "midtransId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE "TransactionHistory";

-- CreateTable
CREATE TABLE "Midtrans" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Midtrans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_midtransId_fkey" FOREIGN KEY ("midtransId") REFERENCES "Midtrans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
