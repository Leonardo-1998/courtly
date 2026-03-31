-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('midtrans', 'saldo');

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_midtransId_fkey";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'midtrans',
ALTER COLUMN "midtransId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_midtransId_fkey" FOREIGN KEY ("midtransId") REFERENCES "Midtrans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
