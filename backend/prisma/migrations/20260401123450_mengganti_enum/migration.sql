/*
  Warnings:

  - The values [saldo] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('midtrans', 'balance');
ALTER TABLE "public"."Reservation" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "public"."Topup" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "Reservation" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TABLE "Topup" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
ALTER TABLE "Reservation" ALTER COLUMN "paymentMethod" SET DEFAULT 'midtrans';
ALTER TABLE "Topup" ALTER COLUMN "paymentMethod" SET DEFAULT 'midtrans';
COMMIT;
