-- CreateEnum
CREATE TYPE "TopupStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- AlterTable
ALTER TABLE "Topup" ADD COLUMN     "status" "TopupStatus" NOT NULL DEFAULT 'pending';
