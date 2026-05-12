/*
  Warnings:

  - You are about to drop the column `saldo` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Topup" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'midtrans';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "saldo",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
